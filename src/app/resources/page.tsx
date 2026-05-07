'use client';

import React, { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Loader2, MapPin, Search } from 'lucide-react';
import Link from 'next/link';

// Dynamically import map to avoid hydration issues
const OfflineMap = dynamic(() => import('@/components/features/maps/OfflineMap').then(mod => mod.OfflineMap), {
    ssr: false,
    loading: () => <div className="w-full h-full bg-slate-950 animate-pulse flex items-center justify-center text-slate-500 font-black">INITIALIZING SATELLITE...</div>
});

import { fetchNearbyResources, Resource } from '@/lib/maps/overpass';
import { Phone, Navigation, Info, ChevronRight, Activity } from 'lucide-react';

export default function EmergencyResourcesLocator() {
    const [activeTab, setActiveTab] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [userCoords, setUserCoords] = useState<[number, number] | null>(null);
    const [mapCenter, setMapCenter] = useState<[number, number] | null>(null);
    const [focusLocation, setFocusLocation] = useState<[number, number] | null>(null);
    const [resources, setResources] = useState<Resource[]>([]);
    const [isLocating, setIsLocating] = useState(true);
    const [isFetching, setIsFetching] = useState(false);
    const [selectedResourceId, setSelectedResourceId] = useState<string | null>(null);

    // Initial location fetch
    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    const coords: [number, number] = [latitude, longitude];
                    setUserCoords(coords);
                    setMapCenter(coords);
                    setIsLocating(false);
                },
                (error) => {
                    console.error("Geolocation error:", error);
                    setIsLocating(false);
                },
                { enableHighAccuracy: true }
            );
        }
    }, []);

    // Fetch resources when map center changes
    useEffect(() => {
        if (!mapCenter) return;

        const refreshData = async () => {
            setIsFetching(true);
            try {
                // radius strictly 5000 as per requirement
                const data = await fetchNearbyResources(mapCenter[0], mapCenter[1], 5000);
                setResources(data);
            } catch (error) {
                console.error("Fetch error:", error);
            } finally {
                setIsFetching(false);
            }
        };

        const timeoutId = setTimeout(refreshData, 500);
        return () => clearTimeout(timeoutId);
    }, [mapCenter]);

    const filteredResources = useMemo(() => {
        return resources.filter(res => {
            const query = searchQuery.toLowerCase().trim();
            const matchesTab = activeTab === 'All' || res.type === activeTab;

            const matchesSearch =
                res.name.toLowerCase().includes(query) ||
                res.address.toLowerCase().includes(query) ||
                res.type.toLowerCase().includes(query);

            return matchesTab && (query === '' || matchesSearch);
        }).sort((a, b) => {
            return parseFloat(a.distance) - parseFloat(b.distance);
        });
    }, [resources, activeTab, searchQuery]);

    const handleResourceClick = (res: Resource) => {
        setSelectedResourceId(res.id);
        setFocusLocation([res.lat, res.lon]);
    };

    if (isLocating) {
        return (
            <div className="fixed inset-0 bg-slate-950 flex flex-col items-center justify-center">
                <div className="relative">
                    <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <MapPin className="text-white w-6 h-6" />
                    </div>
                </div>
                <h2 className="mt-8 text-white font-black text-xl uppercase tracking-tighter">Locating Your Position...</h2>
                <p className="mt-2 text-slate-500 font-bold uppercase text-[10px] tracking-widest">Pinpointing tactical coordinates</p>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black flex flex-row overflow-hidden">
            <div className="flex-1 relative order-2">
                <OfflineMap
                    center={focusLocation || userCoords || undefined}
                    markers={filteredResources}
                    searchQuery={searchQuery}
                    onSearch={setSearchQuery}
                    activeCategory={activeTab}
                    onCategoryChange={setActiveTab}
                    onViewChange={(center) => setMapCenter(center)}
                    selectedMarkerId={selectedResourceId}
                />

                {isFetching && (
                    <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-[1001] bg-blue-600/90 backdrop-blur-xl border border-blue-400/30 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-pulse">
                        <Activity size={18} className="text-blue-200" />
                        <span className="text-xs font-black uppercase tracking-widest">Scanning Network Area...</span>
                    </div>
                )}
            </div>

            <div className="w-[450px] bg-slate-950 border-r border-white/5 flex flex-col z-[2000] relative order-1 shadow-[20px_0_50px_rgba(0,0,0,0.5)]">
                <div className="p-8 border-b border-white/5 bg-slate-900/40">
                    <div className="flex items-center justify-between mb-8">
                        <Link href="/" className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400 hover:text-white transition-all border border-white/5">
                            <ArrowLeft size={20} />
                        </Link>
                        <div className="px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                            <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest leading-none">Intelligence Hub</span>
                        </div>
                    </div>

                    <h1 className="text-3xl font-black text-white leading-tight tracking-tighter">
                        TACTICAL <br />
                        <span className="text-blue-500">RESOURCES</span>
                    </h1>
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mt-3 italic flex items-center gap-2">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                        Live Field Data Active
                    </p>
                </div>

                <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-4">
                    <div className="flex items-center justify-between mb-6 px-2">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em]">Operational results</span>
                        <span className="text-[10px] font-black text-white bg-slate-800 px-3 py-1 rounded-full">{filteredResources.length}</span>
                    </div>

                    <AnimatePresence mode="popLayout">
                        {filteredResources.map((res, idx) => (
                            <motion.div
                                key={res.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                onClick={() => handleResourceClick(res)}
                                className={`group p-6 rounded-[2rem] border transition-all cursor-pointer relative overflow-hidden ${selectedResourceId === res.id
                                    ? 'bg-blue-600 border-blue-500 shadow-[0_20px_40px_rgba(37,99,235,0.3)]'
                                    : 'bg-slate-900/40 border-white/5 hover:bg-slate-900/60 hover:border-white/10'
                                    }`}
                            >
                                <div className="flex items-start justify-between gap-4 relative z-10">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-md ${
                                                res.type === 'Hospital' ? 'bg-blue-500/20 text-blue-400' :
                                                res.type === 'Pharmacy' ? 'bg-emerald-500/20 text-emerald-400' :
                                                res.type === 'Ambulance' ? 'bg-rose-500/20 text-rose-400' :
                                                res.type === 'Blood Bank' ? 'bg-red-500/20 text-red-400' :
                                                'bg-amber-500/20 text-amber-400'
                                                }`}>
                                                {res.type}
                                            </span>
                                            <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">{res.distance} away</span>
                                        </div>
                                        <h3 className={`text-sm font-black uppercase tracking-tight leading-tight ${selectedResourceId === res.id ? 'text-white' : 'text-slate-100 group-hover:text-white'}`}>
                                            {res.name}
                                        </h3>
                                        <p className="text-[10px] text-slate-500 mt-3 font-bold line-clamp-1 flex items-center gap-2">
                                            <MapPin size={10} />
                                            {res.address}
                                        </p>
                                    </div>
                                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${selectedResourceId === res.id ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-500 group-hover:bg-slate-700'
                                        }`}>
                                        <ChevronRight size={18} />
                                    </div>
                                </div>

                                {selectedResourceId === res.id && (
                                    <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/20" />
                                )}
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {filteredResources.length === 0 && (
                        <div className="text-center py-20 px-10">
                            <div className="w-16 h-16 bg-slate-900 rounded-[2rem] flex items-center justify-center text-slate-700 mx-auto mb-6">
                                <Search size={24} />
                            </div>
                            <h4 className="text-white font-black uppercase tracking-tighter">Zero Intel Found</h4>
                            <p className="text-[10px] text-slate-500 font-bold uppercase mt-2 tracking-widest leading-loose">Try adjusting your tactical search filters or panning the satellite grid.</p>
                        </div>
                    )}
                </div>

                {/* Footer Intelligence Summary */}
                <div className="p-8 border-t border-white/5 bg-slate-900/60 backdrop-blur-xl">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-500/20">
                            <Info size={16} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-white uppercase tracking-widest leading-none mb-1">Grid Compliance</p>
                            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest leading-none">Verified via Global Overpass Mirror Network</p>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </div>
    );
}

