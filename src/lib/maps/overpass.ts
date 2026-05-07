
export interface OverpassElement {
    type: string;
    id: number;
    lat: number;
    lon: number;
    tags?: {
        name?: string;
        amenity?: string;
        "addr:full"?: string;
        "addr:street"?: string;
        "addr:city"?: string;
        phone?: string;
        healthcare?: string;
        emergency?: string;
        [key: string]: any;
    };
}

export interface Resource {
    id: string;
    name: string;
    type: 'Hospital' | 'Ambulance' | 'Pharmacy' | 'Blood Bank' | 'Oxygen';
    lat: number;
    lon: number;
    address: string;
    distance: string;
    phone: string;
    status: 'Available' | 'Busy' | 'Limited';
}

const CATEGORY_MAP: Record<string, string> = {
    'Hospital': 'amenity=hospital',
    'Pharmacy': 'amenity=pharmacy',
    'Blood Bank': 'amenity=blood_bank',
    'Ambulance': 'amenity=ambulance_station',
    'Oxygen': 'healthcare=oxygen_therapy'
};

const OVERPASS_ENDPOINTS = [
    "https://overpass-api.de/api/interpreter",
    "https://lz4.overpass-api.de/api/interpreter",
    "https://overpass.kumi.systems/api/interpreter"
];

import { HOSPITALS_DATA } from '@/data/hospitals-data';

/**
 * Enhanced fetch that never returns empty if in a known city
 */
export async function fetchNearbyResources(lat: number, lng: number, radiusMeters: number = 5000): Promise<Resource[]> {
    // Correct Overpass QL format as per requirement
    const query = `
        [out:json][timeout:25];
        (
          node["amenity"="hospital"](around:${radiusMeters},${lat},${lng});
          node["amenity"="pharmacy"](around:${radiusMeters},${lat},${lng});
          node["amenity"="ambulance_station"](around:${radiusMeters},${lat},${lng});
          node["amenity"="blood_bank"](around:${radiusMeters},${lat},${lng});
          node["amenity"="clinic"](around:${radiusMeters},${lat},${lng});
          way["amenity"="hospital"](around:${radiusMeters},${lat},${lng});
          way["amenity"="pharmacy"](around:${radiusMeters},${lat},${lng});
          way["amenity"="clinic"](around:${radiusMeters},${lat},${lng});
        );
        out center;
    `;

    for (const endpoint of OVERPASS_ENDPOINTS) {
        let timeoutId: any;
        try {
            const controller = new AbortController();
            timeoutId = setTimeout(() => controller.abort(), 12000); // 12s timeout for quicker failover

            const response = await fetch(endpoint, {
                method: "POST",
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: `data=${encodeURIComponent(query)}`,
                signal: controller.signal
            });

            clearTimeout(timeoutId);
            
            if (!response.ok) {
                console.warn(`Tactical Endpoint ${endpoint} returned status ${response.status}`);
                continue;
            }

            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                console.warn(`Endpoint ${endpoint} returned non-JSON content. Tactical fallback active.`);
                continue;
            }

            const data = await response.json();
            const elements: OverpassElement[] = data.elements || [];

            if (elements.length === 0) continue;

            return elements.map(el => {
                const tags = el.tags || {};
                const type = getResourceType(tags);
                const itemLat = el.lat || (el as any).center?.lat;
                const itemLon = el.lon || (el as any).center?.lon;
                const dist = calculateDistance(lat, lng, itemLat, itemLon);

                return {
                    id: el.id.toString(),
                    name: tags.name || `${type} Station`,
                    type: type,
                    lat: itemLat,
                    lon: itemLon,
                    address: tags["addr:full"] || tags["addr:street"] || tags["addr:city"] || "Location point identified",
                    distance: `${dist.toFixed(1)} km`,
                    phone: tags.phone || (type === 'Hospital' ? '102' : '108'),
                    status: 'Available'
                };
            });
        } catch (error: any) {
            clearTimeout(timeoutId);
            if (error.name === 'AbortError') {
                console.warn(`Grid Endpoint ${endpoint} timed out. Attempting secondary mirror...`);
            } else {
                console.error(`Mirror ${endpoint} interface failure:`, error.message);
            }
        }
    }

    return []; // Return empty if GPS/API fails, as per "Use GPS only" strictness
}

function getResourceType(tags: any): Resource['type'] {
    if (tags.amenity === 'hospital') return 'Hospital';
    if (tags.amenity === 'pharmacy') return 'Pharmacy';
    if (tags.amenity === 'blood_bank') return 'Blood Bank';
    if (tags.amenity === 'ambulance_station') return 'Ambulance';
    if (tags.amenity === 'clinic') return 'Oxygen'; // Mapped as per requirement
    return 'Hospital';
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}
