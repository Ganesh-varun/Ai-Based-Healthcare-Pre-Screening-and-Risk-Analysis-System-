export type EmergencyType = 'Hospital' | 'Medical Shop' | 'Emergency Centre' | 'Forest Official' | 'Police' | 'General';

export interface EmergencyUnit {
    id: string;
    pos: [number, number];
    name: string;
    type: EmergencyType;
    status: string;
    phone?: string;
    address?: string;
}

const SERVICE_NAMES: Record<EmergencyType, string[]> = {
    'Hospital': ['City General', 'LifeCare Specialist', 'Apex Medical', 'Holy Cross', 'Government District Hospital', 'Metro Care'],
    'Medical Shop': ['Medicare Pharmacy', 'Apollo Pharmacy', 'Wellness Chemist', 'Local Med-Store', '24/7 Pharma'],
    'Emergency Centre': ['Trauma Care Unit', 'Rapid Response Base', 'Red Cross Center', 'First Aid Point'],
    'Forest Official': ['Range Office', 'Wilderness Post', 'Forest Guard Station', 'Nature Reserve Base'],
    'Police': ['City Police Station', 'Traffic Outpost', 'District HQ', 'Patrol Base', 'Highway Checkpost'],
    'General': ['Health Outpost', 'Community Clinic', 'Info Hub']
};

const INDIA_POLYGON: [number, number][] = [
    // North & Himalayas
    [37.0, 74.5], [37.2, 75.5], [36.0, 77.5], [34.5, 79.2], [32.5, 78.5], [30.5, 80.2],
    [28.5, 83.0], [27.5, 85.5], [28.0, 88.2], [27.0, 88.8], [28.2, 91.8], [28.8, 95.5],
    [28.2, 97.2], [26.5, 97.0], [24.0, 94.5], [23.0, 93.2], [21.8, 92.2], [22.5, 91.5],
    // Bangladesh Border Detail
    [24.5, 91.8], [25.1, 89.8], [26.3, 89.5], [25.8, 88.2], [23.5, 88.5], [22.5, 89.1],
    // East Coast (Bay of Bengal)
    [21.8, 88.2], [21.3, 87.0], [20.0, 86.4], [19.2, 85.1], [18.2, 84.0], [17.7, 83.3], // Vizag
    [16.8, 82.3], [16.2, 81.5], [15.8, 80.4], [14.5, 80.1], [13.1, 80.3], [12.0, 79.9],
    [10.8, 79.9], [9.8, 79.2], [9.2, 78.5], [8.0, 77.5], // Kanyakumari
    // West Coast (Arabian Sea)
    [8.5, 76.8], [9.5, 76.3], [11.0, 75.8], [12.5, 74.8], [14.5, 74.2], [15.5, 73.7],
    [17.0, 73.2], [18.5, 72.8], [19.5, 72.7], [20.5, 72.8], [21.0, 72.0], [21.5, 70.0],
    [22.5, 69.0], [23.5, 68.2], [24.5, 68.5],
    // West Boundary (Pakistan)
    [25.0, 70.2], [26.5, 70.0], [28.5, 70.0], [30.5, 72.5], [32.0, 74.0], [34.5, 73.8], [37.0, 74.5]
];

const isInsideIndia = (lat: number, lng: number): boolean => {
    let inside = false;
    for (let i = 0, j = INDIA_POLYGON.length - 1; i < INDIA_POLYGON.length; j = i++) {
        const xi = INDIA_POLYGON[i][0], yi = INDIA_POLYGON[i][1];
        const xj = INDIA_POLYGON[j][0], yj = INDIA_POLYGON[j][1];

        // Ray casting algorithm (point in polygon)
        const intersect = ((xi > lat) !== (xj > lat))
            && (lng < (yj - yi) * (lat - xi) / (xj - xi) + yi);
        if (intersect) inside = !inside;
    }
    return inside;
};

const seededRandom = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
};

export const generateNearbyUnits = (lat: number, lng: number): EmergencyUnit[] => {
    const units: EmergencyUnit[] = [];
    const types: EmergencyType[] = ['Hospital', 'Medical Shop', 'Emergency Centre', 'Forest Official', 'Police'];

    // We generate units in a 3x3 grid of sectors around the point
    // Each sector is 0.2 degrees (~22km)
    const gridSize = 0.2;

    const startLat = Math.floor(lat / gridSize) - 1;
    const startLng = Math.floor(lng / gridSize) - 1;

    for (let sLat = startLat; sLat <= startLat + 2; sLat++) {
        for (let sLng = startLng; sLng <= startLng + 2; sLng++) {
            const sectorSeed = sLat * 10000 + sLng;
            // Generate 4-7 units per sector
            const count = 4 + Math.floor(seededRandom(sectorSeed) * 4);

            for (let i = 0; i < count; i++) {
                const seed = sectorSeed + i * 789; // Unique seed for unit
                const typeSeed = seededRandom(seed * 1.23);
                const type = types[Math.floor(typeSeed * types.length)];

                // Position within the sector (0.2 x 0.2 area)
                const uLat = (sLat * gridSize) + (seededRandom(seed * 2.34) * gridSize);
                const uLng = (sLng * gridSize) + (seededRandom(seed * 3.45) * gridSize);

                // ONLY generate if inside India's land boundaries
                if (isInsideIndia(uLat, uLng)) {
                    const nameList = SERVICE_NAMES[type];
                    const nameSeed = Math.floor(seededRandom(seed * 4.56) * nameList.length);
                    const name = `${nameList[nameSeed]} ${Math.floor(seededRandom(seed * 5.67) * 999)}`;

                    units.push({
                        id: `unit-${sLat}-${sLng}-${i}`,
                        pos: [uLat, uLng],
                        name,
                        type,
                        status: seededRandom(seed * 6.78) > 0.3 ? "Active - 24/7" : "Limited Service",
                        phone: `+91 ${Math.floor(seededRandom(seed * 7.89) * 9000000000) + 1000000000}`,
                        address: `Sector ${Math.abs(sLat)}, Area ${Math.abs(sLng)}, Unit ${i + 1}`
                    });
                }
            }
        }
    }

    return units;
};
