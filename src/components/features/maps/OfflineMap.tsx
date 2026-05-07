'use client';

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import {
    Plus,
    Minus,
    Search,
    MapPin,
    ArrowLeft,
    Navigation as NavIcon,
    Locate,
    X,
    Filter,
    HeartPulse,
    Activity,
    Droplets,
    Shield
} from 'lucide-react';
import { CITY_COORDINATES } from '@/data/city-coordinates';
import Link from 'next/link';

// Fix for default marker icons in Leaflet
const DefaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const MARKER_CONFIGS: Record<string, { bg: string, icon: string }> = {
    'Hospital': { bg: 'bg-blue-600', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 6v12M3 13h18"/></svg>' },
    'Ambulance': { bg: 'bg-red-600', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10 10H6M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></svg>' },
    'Pharmacy': { bg: 'bg-emerald-600', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 8v8M8 12h8"/><circle cx="12" cy="12" r="10"/></svg>' },
    'Blood Bank': { bg: 'bg-rose-600', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>' },
    'Oxygen': { bg: 'bg-cyan-600', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/></svg>' },
    'Default': { bg: 'bg-slate-700', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/></svg>' }
};

const MapController = ({ center }: { center: [number, number] | null, zoom: number }) => {
    const map = useMap();

    useEffect(() => {
        if (!center || !center[0] || !center[1] || !map) return;

        const executeSetView = () => {
            try {
                // Ensure dimensions are stable
                map.invalidateSize();
                map.setView(center, 13, {
                    animate: true,
                    duration: 0.5
                });
            } catch (e) {
                console.warn("Retrying view stabilization...");
                setTimeout(() => map.setView(center, 13), 200);
            }
        };

        map.whenReady(() => {
            // Small deferment resolves internal Leaflet racing for container offsets
            const timer = setTimeout(executeSetView, 100);
            return () => clearTimeout(timer);
        });
    }, [center, map]);

    return null;
};

const MapEvents = ({ onViewChange }: { onViewChange?: (center: [number, number], zoom: number) => void }) => {
    const map = useMapEvents({
        moveend: () => {
            const center = map.getCenter();
            if (onViewChange) {
                onViewChange([center.lat, center.lng], map.getZoom());
            }
        },
    });
    return null;
};

export const OfflineMap = ({
    center,
    markers = [],
    searchQuery = '',
    onSearch,
    activeCategory = 'All',
    onCategoryChange,
    onViewChange,
    variant = 'default',
    selectedMarkerId = null
}: {
    center?: [number, number];
    markers?: { id: string, name: string, type: string, lat: number, lon: number, distance: string, address: string, phone?: string }[];
    searchQuery?: string;
    onSearch?: (query: string) => void;
    activeCategory?: string;
    onCategoryChange?: (category: string) => void;
    onViewChange?: (center: [number, number], zoom: number) => void;
    variant?: 'default' | 'simple';
    selectedMarkerId?: string | null;
}) => {
    const [viewPosition, setViewPosition] = useState<[number, number] | null>(center || null);
    const [currentZoom, setCurrentZoom] = useState(13);
    const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
    const [localSearchInput, setLocalSearchInput] = useState(searchQuery);

    useEffect(() => {
        if (center) {
            setViewPosition(center);
        }
    }, [center]);

    useEffect(() => {
        setLocalSearchInput(searchQuery);
    }, [searchQuery]);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((pos) => {
                const loc: [number, number] = [pos.coords.latitude, pos.coords.longitude];
                setUserLocation(loc);
                if (!center) setViewPosition(loc);
            }, undefined, { enableHighAccuracy: true });
        }
    }, []);

    const searchLocation = async (name: string) => {
        if (!name.trim()) return;
        
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(name)}&limit=1`, {
                headers: { 'User-Agent': 'HealthcareApp-TacticalGrid/6.0' }
            });

            if (!response.ok) return;

            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                const data = await response.json();
                if (data && data.length > 0) {
                    const lat = parseFloat(data[0].lat);
                    const lon = parseFloat(data[0].lon);

                    // Precise positioning as per requirement
                    setViewPosition([lat, lon]);

                    // Reload tactical resources
                    if (onViewChange) {
                        onViewChange([lat, lon], 13);
                    }
                }
            }
        } catch (error) {
            console.error("Geocoding Failed:", error);
        }
    };

    const handleSearchClick = useCallback(async () => {
        if (onSearch) onSearch(localSearchInput);
        await searchLocation(localSearchInput);
    }, [localSearchInput, onSearch, onViewChange]);

    const jumpToMyLocation = () => {
        if (userLocation) {
            setViewPosition([...userLocation]);
        }
    };

    return (
        <div className={`w-full h-full relative overflow-hidden font-sans ${variant === 'simple' ? 'bg-white' : 'bg-slate-950'}`}>
            <div className="absolute top-8 left-8 right-8 z-[1000] pointer-events-none flex flex-col gap-6">
                <div className="flex items-center gap-4 w-full">
                    {variant === 'default' && (
                        <div className="pointer-events-auto bg-slate-900/90 backdrop-blur-xl border border-white/5 p-2 pr-6 rounded-[2rem] shadow-2xl flex items-center gap-4">
                            <Link href="/" className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400 hover:text-white transition-all">
                                <ArrowLeft size={20} />
                            </Link>
                            <div className="hidden sm:block">
                                <h2 className="text-sm font-black text-white leading-none tracking-tighter uppercase">RESOURCE <span className="text-blue-500">locator</span></h2>
                                <p className="text-[8px] text-slate-500 font-black uppercase tracking-[0.2em] mt-1 italic">Tactical Grid v6.0</p>
                            </div>
                        </div>
                    )}

                    <div className={`pointer-events-auto flex-1 max-w-2xl backdrop-blur-xl border p-2 rounded-[2rem] shadow-2xl flex items-center gap-3 transition-all ${variant === 'simple' ? 'bg-white/90 border-slate-200' : 'bg-slate-900/90 border-white/5'}`}>
                        <button onClick={handleSearchClick} className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg hover:scale-105 transition-all">
                            <Search size={22} />
                        </button>
                        <input
                            type="text"
                            placeholder={variant === 'simple' ? "Search location..." : "Find medical resources..."}
                            value={localSearchInput}
                            onChange={(e) => setLocalSearchInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearchClick()}
                            className={`flex-1 bg-transparent border-none outline-none font-bold text-sm px-2 ${variant === 'simple' ? 'text-slate-900' : 'text-white'}`}
                        />
                        {localSearchInput && (
                            <button onClick={() => { setLocalSearchInput(''); if (onSearch) onSearch(''); }} className="p-2 text-slate-500 hover:text-white">
                                <X size={20} />
                            </button>
                        )}
                    </div>

                    {variant === 'default' && (
                        <div className="pointer-events-auto hidden lg:flex items-center bg-slate-900/90 backdrop-blur-xl border border-white/5 p-2 rounded-[2rem] shadow-2xl gap-1">
                            <button onClick={() => setCurrentZoom(z => Math.min(z + 1, 18))} className="p-3 text-slate-400 hover:text-white"><Plus size={18} /></button>
                            <button onClick={() => setCurrentZoom(z => Math.max(z - 1, 3))} className="p-3 text-slate-400 hover:text-white"><Minus size={18} /></button>
                            <div className="w-px h-6 bg-white/5 mx-1" />
                            <button onClick={jumpToMyLocation} className="p-3 text-blue-500 hover:bg-blue-500/10 rounded-xl transition-all"><Locate size={20} /></button>
                        </div>
                    )}
                </div>

                {variant === 'default' && (
                    <div className="flex gap-2 pointer-events-auto overflow-x-auto no-scrollbar pb-2 max-w-full px-1">
                        {['All', 'Hospital', 'Ambulance', 'Pharmacy', 'Blood Bank', 'Oxygen'].map((category) => (
                            <button
                                key={category}
                                onClick={() => onCategoryChange && onCategoryChange(category)}
                                className={`px-8 py-3.5 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all border shadow-xl flex items-center gap-2 whitespace-nowrap ${activeCategory === category ? 'bg-red-600 border-red-500 text-white shadow-red-500/30' : 'bg-slate-900/90 border-white/10 text-slate-500 hover:text-white'}`}
                            >
                                {activeCategory === category && <Filter size={12} className="animate-pulse" />}
                                {category}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {viewPosition && (
                <MapContainer center={viewPosition} zoom={currentZoom} className="w-full h-full z-0" zoomControl={false}>
                    <MapController center={viewPosition} zoom={currentZoom} />
                    <MapEvents onViewChange={onViewChange} />
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap" />

                    {markers.map((marker) => {
                        const isSelected = selectedMarkerId === marker.id;
                        const config = MARKER_CONFIGS[marker.type as keyof typeof MARKER_CONFIGS] || MARKER_CONFIGS['Default'];

                        return (
                            <Marker
                                key={marker.id}
                                position={[marker.lat, marker.lon]}
                                icon={L.divIcon({
                                    className: 'custom-resource-marker',
                                    html: `
                                        <div class="relative flex items-center justify-center group transition-all duration-300 ${isSelected ? 'scale-125 z-[5000]' : 'hover:scale-110'}">
                                            ${isSelected ? '<div class="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-40 scale-150"></div>' : ''}
                                            <div class="relative w-10 h-10 ${config.bg} ${isSelected ? 'shadow-2xl border-2 border-white' : 'border border-white/20'} rounded-2xl flex items-center justify-center transition-all">
                                                <div class="text-white transform group-hover:rotate-12 transition-transform">
                                                    ${config.icon}
                                                </div>
                                            </div>
                                        </div>
                                    `,
                                    iconSize: [40, 40],
                                    iconAnchor: [20, 20],
                                    popupAnchor: [0, -20]
                                })}
                            >
                                <Popup className="premium-map-popup">
                                    <div className="p-6 w-80 bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100">
                                        <h3 className="text-sm font-black text-slate-900 uppercase leading-tight mb-2">{marker.name}</h3>
                                        <div className="flex items-center gap-2 mb-4">
                                            <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black rounded-lg uppercase">{marker.type}</span>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{marker.distance}</span>
                                        </div>
                                        <div className="flex items-start gap-4 text-slate-500 mb-6">
                                            <MapPin size={16} className="shrink-0 mt-0.5" />
                                            <p className="text-[11px] font-bold leading-relaxed">{marker.address}</p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <button className="bg-red-600 text-white py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center">Contact</button>
                                            <button className="bg-slate-950 text-white py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2"><NavIcon size={14} className="text-blue-500" /> Route</button>
                                        </div>
                                    </div>
                                </Popup>
                            </Marker>
                        );
                    })}

                    {userLocation && (
                        <Marker position={userLocation} icon={L.divIcon({
                            className: 'user-location-marker',
                            html: `
                                <div class="relative flex items-center justify-center">
                                    <div class="absolute w-8 h-8 bg-blue-500 rounded-full animate-ping opacity-25"></div>
                                    <div class="relative w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-lg"></div>
                                </div>
                            `,
                            iconSize: [32, 32],
                            iconAnchor: [16, 16]
                        })}>
                            <Popup>
                                <div className="p-4 text-center">
                                    <h3 className="font-extrabold text-slate-800 uppercase text-xs tracking-widest">Origin Point</h3>
                                    <p className="text-[9px] text-slate-500 font-bold uppercase mt-1.5 opacity-60 italic">Live GPS Intel Active</p>
                                </div>
                            </Popup>
                        </Marker>
                    )}
                </MapContainer>
            )}

            <style jsx global>{`
                .leaflet-container { background: ${variant === 'simple' ? '#f8fafc' : '#020617'}; font-family: 'Inter', sans-serif; }
                ${variant !== 'simple' ? '.leaflet-tile { filter: invert(100%) hue-rotate(180deg) brightness(98%) contrast(92%); }' : ''}
                .leaflet-popup-content-wrapper { border-radius: 40px; padding: 0; box-shadow: 0 50px 100px rgba(0,0,0,0.6); border: none; overflow: hidden; }
                .leaflet-popup-content { margin: 0; pointer-events: auto; }
                .leaflet-popup-tip-container { display: none; }
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .custom-resource-marker { background: none; border: none; cursor: pointer; }
                @keyframes ping {
                    0% { transform: scale(1); opacity: 0.5; }
                    70%, 100% { transform: scale(3); opacity: 0; }
                }
                .animate-ping { animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite; }
            `}</style>
        </div>
    );
};
