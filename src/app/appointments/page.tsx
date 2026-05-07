'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Search, MapPin, Star, Clock, Phone, ArrowUpRight, Filter, Bell, CheckCircle2, X, Globe, Stethoscope, Award } from 'lucide-react';
import Link from 'next/link';
import { INDIA_LOCATIONS } from '@/data/india-locations';
import { HOSPITALS_DATA, Hospital } from '@/data/hospitals-data';
import { generateProceduralData } from '@/lib/healthcare-factory';

const CATEGORIES = [
    { id: 'all', name: 'All Services', icon: '🏥' },
    { id: 'general', name: 'General Medicine', icon: '🩺' },
    { id: 'cardio', name: 'Cardiology', icon: '❤️' },
    { id: 'neuro', name: 'Neurology', icon: '🧠' },
    { id: 'ortho', name: 'Orthopedics', icon: '🦴' },
    { id: 'peds', name: 'Pediatrics', icon: '👶' },
    { id: 'gastro', name: 'Gastroenterology', icon: '🧪' },
    { id: 'onco', name: 'Oncology', icon: '🎗️' },
    { id: 'nephro', name: 'Nephrology', icon: '💧' },
    { id: 'pulmo', name: 'Pulmonology', icon: '🫁' },
    { id: 'ent', name: 'ENT', icon: '👂' },
    { id: 'eyes', name: 'Ophthalmology', icon: '👁️' },
    { id: 'skin', name: 'Dermatology', icon: '🧴' },
    { id: 'gynae', name: 'Gynecology', icon: '🚺' },
    { id: 'dental', name: 'Dental', icon: '🦷' },
    { id: 'psych', name: 'Psychiatry', icon: '🧠' },
];



export default function AppointmentsPage() {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedState, setSelectedState] = useState('All India');
    const [selectedCity, setSelectedCity] = useState('All Cities');
    const [searchQuery, setSearchQuery] = useState('');
    const [isLocationOpen, setIsLocationOpen] = useState(false);
    const [viewMode, setViewMode] = useState<'states' | 'districts'>('states');
    const [emergencyConfirm, setEmergencyConfirm] = useState<{ show: boolean, name?: string }>({ show: false });
    const [isNotified, setIsNotified] = useState(false);

    const filteredData = React.useMemo(() => {
        const realFiltered = HOSPITALS_DATA.filter(item => {
            const matchesCategory = selectedCategory === 'all' ||
                item.specialty.toLowerCase().includes(selectedCategory.toLowerCase()) ||
                (selectedCategory === 'peds' && item.specialty.toLowerCase().includes('pediatric')) ||
                (selectedCategory === 'cardio' && item.specialty.toLowerCase().includes('cardio')) ||
                (selectedCategory === 'neuro' && item.specialty.toLowerCase().includes('neuro')) ||
                (selectedCategory === 'ortho' && item.specialty.toLowerCase().includes('ortho')) ||
                (selectedCategory === 'gastro' && item.specialty.toLowerCase().includes('gastro')) ||
                (selectedCategory === 'onco' && item.specialty.toLowerCase().includes('onco')) ||
                (selectedCategory === 'nephro' && item.specialty.toLowerCase().includes('nephro')) ||
                (selectedCategory === 'pulmo' && item.specialty.toLowerCase().includes('pulmo')) ||
                (selectedCategory === 'eyes' && item.specialty.toLowerCase().includes('ophthal')) ||
                (selectedCategory === 'skin' && item.specialty.toLowerCase().includes('derm')) ||
                (selectedCategory === 'gynae' && item.specialty.toLowerCase().includes('gyna')) ||
                (selectedCategory === 'dental' && item.specialty.toLowerCase().includes('dent')) ||
                (selectedCategory === 'psych' && item.specialty.toLowerCase().includes('psych'));

            const matchesState = selectedState === 'All India' || item.state === selectedState;
            const matchesCity = selectedCity === 'All Cities' || item.city === selectedCity;

            const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.state.toLowerCase().includes(searchQuery.toLowerCase());

            return matchesCategory && matchesState && matchesCity && matchesSearch;
        });

        // Generate procedural data if we have a specific city and state
        const procedural = generateProceduralData(selectedState, selectedCity, selectedCategory);

        // Return combined list, prioritizing real data
        return [...realFiltered, ...procedural];
    }, [selectedCategory, selectedState, selectedCity, searchQuery]);


    const triggerEmergency = (name: string) => {
        setEmergencyConfirm({ show: true, name });
        setIsNotified(false);
    };

    const confirmEmergency = () => {
        setIsNotified(true);
        setTimeout(() => {
            setEmergencyConfirm({ show: false });
            setIsNotified(false);
        }, 3000);
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            {/* Header */}
            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-white border-b border-slate-100 sticky top-0 z-50"
            >
                <div className="max-w-md mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href="/triage" className="p-2 -ml-2 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                        <ChevronLeft size={20} className="text-slate-600" />
                    </Link>
                    <div className="text-center">
                        <h1 className="text-lg font-bold text-slate-800 leading-none">Care Directory</h1>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsLocationOpen(true)}
                            className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-1 flex items-center justify-center gap-1 mx-auto"
                        >
                            <MapPin size={10} /> {selectedCity === 'All Cities' ? selectedState.toUpperCase() : `${selectedCity}, ${selectedState}`.toUpperCase()}
                        </motion.button>
                    </div>
                    <div className="w-10" />
                </div>
            </motion.div>

            <div className="max-w-md mx-auto p-6 space-y-8 pb-32">
                {/* Search Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="relative group"
                >
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                        <Search size={20} className="text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search hospitals, doctors, or cities..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-white rounded-3xl border border-slate-100 shadow-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none"
                    />
                </motion.div>

                {/* Categories */}
                <div className="space-y-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="flex items-center justify-between"
                    >
                        <h2 className="text-xl font-black text-slate-900 tracking-tight">SPECIALTIES</h2>
                        <button className="text-blue-600 text-xs font-bold flex items-center gap-1 uppercase tracking-widest">
                            <Filter size={14} /> FILTER
                        </button>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide no-scrollbar"
                    >
                        {CATEGORIES.map(cat => (
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className={`flex-shrink-0 px-5 py-3 rounded-2xl font-bold transition-all flex items-center gap-2 ${selectedCategory === cat.id
                                    ? 'bg-slate-900 text-white shadow-lg shadow-slate-200'
                                    : 'bg-white text-slate-500 border border-slate-100 hover:border-slate-200'
                                    }`}
                            >
                                <span>{cat.icon}</span>
                                <span className="text-sm whitespace-nowrap">{cat.name}</span>
                            </motion.button>
                        ))}
                    </motion.div>
                </div>

                {/* List */}
                <div className="space-y-4">
                    <motion.h2
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-xl font-black text-slate-900 tracking-tight flex justify-between items-center"
                    >
                        NEARBY CARE
                        <span className="text-[10px] bg-slate-100 text-slate-400 px-2 py-1 rounded-full">{filteredData.length} FOUND</span>
                    </motion.h2>
                    <motion.div
                        layout
                        className="space-y-4"
                    >
                        <AnimatePresence mode="popLayout">
                            {filteredData.length > 0 ? (
                                filteredData.map((item, index) => (
                                    <motion.div
                                        layout
                                        key={item.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="bg-white rounded-[2rem] p-5 shadow-xl shadow-slate-200/50 border border-slate-50 hover:border-blue-200 transition-all group"
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-black tracking-widest text-blue-600 uppercase">
                                                    {item.specialty}
                                                </p>
                                                <h3 className="text-lg font-bold text-slate-800 leading-tight group-hover:text-blue-600 transition-colors">{item.name}</h3>
                                                <div className="flex items-center gap-1 text-slate-400">
                                                    <MapPin size={14} />
                                                    <span className="text-xs font-medium">{item.address}, {item.city}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1 bg-amber-50 px-3 py-1.5 rounded-full text-amber-700 font-black text-xs">
                                                <Star size={12} fill="currentColor" />
                                                {item.rating}
                                            </div>
                                        </div>

                                        {/* Specialists List */}
                                        {item.specialists && item.specialists.length > 0 && (
                                            <div className="space-y-3 mb-4 bg-slate-50/50 p-4 rounded-2xl border border-slate-100/50">
                                                <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                                                    <Stethoscope size={12} /> Experts Available
                                                </div>
                                                <div className="flex flex-col gap-3">
                                                    {item.specialists.slice(0, 2).map(doc => (
                                                        <div key={doc.id} className="flex justify-between items-center">
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xs uppercase">
                                                                    {doc.name.split(' ').pop()?.[0]}
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm font-bold text-slate-700 leading-none mb-0.5">{doc.name}</p>
                                                                    <div className="flex items-center gap-1.5">
                                                                        <span className="text-[10px] font-bold text-blue-600 uppercase">{doc.specialty}</span>
                                                                        <span className="w-1 h-1 bg-slate-300 rounded-full" />
                                                                        <span className="text-[10px] font-medium text-slate-400">{doc.experience} EXP</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-lg">
                                                                <Award size={10} /> {doc.rating}
                                                            </div>
                                                        </div>
                                                    ))}
                                                    {item.specialists.length > 2 && (
                                                        <p className="text-[10px] font-black text-blue-600 text-center pt-1 tracking-widest uppercase">
                                                            + {item.specialists.length - 2} MORE SPECIALISTS
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                        <div className="flex items-center justify-between pt-4 border-t border-slate-50 mt-4">
                                            <div className="flex gap-4">
                                                <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-xs uppercase tracking-wider">
                                                    <Clock size={14} />
                                                    {item.availability}
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                {item.isEmergency && (
                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => triggerEmergency(item.name)}
                                                        className="bg-rose-500 text-white p-3 rounded-2xl shadow-lg shadow-rose-200 hover:bg-rose-600 transition-all active:scale-95 flex items-center gap-2 px-4"
                                                    >
                                                        <Bell size={18} />
                                                        <span className="text-xs font-black">ALERT</span>
                                                    </motion.button>
                                                )}
                                                <Link
                                                    href={`/appointments/${item.id}`}
                                                    className="bg-blue-600 text-white p-3 rounded-2xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95"
                                                >
                                                    <ArrowUpRight size={20} />
                                                </Link>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-center py-12 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200"
                                >
                                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No entries for this city/specialty</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </div>

            {/* Modals with AnimatePresence */}
            <AnimatePresence>
                {isLocationOpen && (
                    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-900/60 backdrop-blur-sm p-4">
                        <motion.div
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="w-full max-w-md bg-white rounded-[3rem] p-8 shadow-2xl max-h-[85vh] flex flex-col"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h3 className="text-2xl font-black text-slate-800 tracking-tight">
                                        {viewMode === 'states' ? 'Select State' : `Districts in ${selectedState}`}
                                    </h3>
                                    <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mt-1">
                                        {viewMode === 'states' ? 'PAN-INDIA COVERAGE' : 'LOCAL DIRECTORY'}
                                    </p>
                                </div>
                                <button onClick={() => setIsLocationOpen(false)} className="p-2 bg-slate-50 rounded-full text-slate-400 hover:bg-slate-100 transition-colors">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto no-scrollbar pb-6 space-y-2">
                                {viewMode === 'states' ? (
                                    <>
                                        <button
                                            onClick={() => {
                                                setSelectedState('All India');
                                                setSelectedCity('All Cities');
                                                setIsLocationOpen(false);
                                            }}
                                            className={`w-full p-4 rounded-2xl text-left font-black text-sm transition-all flex items-center gap-3 ${selectedState === 'All India'
                                                ? 'bg-slate-900 text-white shadow-xl shadow-slate-200'
                                                : 'bg-slate-50 text-slate-600 hover:bg-white hover:shadow-md'
                                                }`}
                                        >
                                            <Globe size={18} /> ALL INDIA
                                        </button>
                                        {Object.keys(INDIA_LOCATIONS).map(state => (
                                            <button
                                                key={state}
                                                onClick={() => {
                                                    setSelectedState(state);
                                                    setViewMode('districts');
                                                }}
                                                className={`w-full p-4 rounded-2xl text-left font-bold text-sm transition-all flex justify-between items-center ${selectedState === state
                                                    ? 'bg-blue-600 text-white shadow-xl shadow-blue-200'
                                                    : 'bg-slate-50 text-slate-600 hover:bg-white hover:shadow-md'
                                                    }`}
                                            >
                                                {state}
                                                <ChevronLeft size={16} className="rotate-180 opacity-50" />
                                            </button>
                                        ))}
                                    </>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => setViewMode('states')}
                                            className="w-full p-3 mb-4 rounded-xl text-blue-600 font-black text-[10px] tracking-widest flex items-center gap-2 uppercase hover:bg-blue-50 transition-all border border-blue-100"
                                        >
                                            <ChevronLeft size={14} /> Back to States
                                        </button>
                                        <button
                                            onClick={() => {
                                                setSelectedCity('All Cities');
                                                setIsLocationOpen(false);
                                                setViewMode('states');
                                            }}
                                            className={`w-full p-4 rounded-2xl text-left font-black text-sm transition-all ${selectedCity === 'All Cities'
                                                ? 'bg-blue-600 text-white shadow-xl'
                                                : 'bg-slate-50 text-slate-600 hover:bg-white hover:shadow-md'
                                                }`}
                                        >
                                            ALL {selectedState.toUpperCase()}
                                        </button>
                                        {INDIA_LOCATIONS[selectedState]?.map(city => (
                                            <button
                                                key={city}
                                                onClick={() => {
                                                    setSelectedCity(city);
                                                    setIsLocationOpen(false);
                                                    setViewMode('states');
                                                }}
                                                className={`w-full p-4 rounded-2xl text-left font-bold text-sm transition-all ${selectedCity === city
                                                    ? 'bg-blue-600 text-white shadow-xl shadow-blue-200'
                                                    : 'bg-slate-50 text-slate-600 hover:bg-white hover:shadow-md'
                                                    }`}
                                            >
                                                {city}
                                            </button>
                                        ))}
                                    </>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {emergencyConfirm.show && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-rose-900/40 backdrop-blur-md">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="w-full max-w-md bg-white rounded-[3rem] p-10 text-center shadow-3xl"
                        >
                            {!isNotified ? (
                                <div className="space-y-6">
                                    <motion.div
                                        animate={{ scale: [1, 1.1, 1] }}
                                        transition={{ repeat: Infinity, duration: 1.5 }}
                                        className="w-24 h-24 bg-rose-100 rounded-full flex items-center justify-center mx-auto text-rose-600"
                                    >
                                        <Bell size={48} />
                                    </motion.div>
                                    <div className="space-y-2">
                                        <h3 className="text-3xl font-black text-slate-900 leading-none uppercase">Emergency Notify</h3>
                                        <p className="text-slate-500 font-medium leading-relaxed">Alert <span className="text-rose-600 font-bold">{emergencyConfirm.name}</span> that you are arriving for urgent care?</p>
                                    </div>
                                    <div className="flex gap-4">
                                        <button
                                            onClick={() => setEmergencyConfirm({ show: false })}
                                            className="flex-1 py-5 rounded-3xl font-black text-slate-400 bg-slate-50 hover:bg-slate-100 transition-all"
                                        >
                                            CANCEL
                                        </button>
                                        <button
                                            onClick={confirmEmergency}
                                            className="flex-1 py-5 rounded-3xl font-black text-white bg-rose-600 shadow-xl shadow-rose-200 hover:bg-rose-700 transition-all"
                                        >
                                            SEND ALERT
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                                        <CheckCircle2 size={48} />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-3xl font-black text-slate-900 leading-none">ALERT SENT</h3>
                                        <p className="text-slate-500 font-medium italic">"Hospital notified. Staff is preparing for your arrival at {emergencyConfirm.name}."</p>
                                    </div>
                                    <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                                        <p className="text-emerald-700 text-sm font-bold">Please use the emergency entrance.</p>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Bottom Floating Phone */}
            <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1 }}
                className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-md px-6"
            >
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-slate-900 text-white py-5 rounded-3xl font-black flex items-center justify-center gap-3 shadow-2xl shadow-slate-400 hover:bg-slate-800 transition-all group"
                >
                    <div className="bg-blue-500 p-2 rounded-xl group-hover:rotate-12 transition-transform">
                        <Phone size={20} fill="white" />
                    </div>
                    <span>GOVERNMENT EMERGENCY HELPLINE</span>
                </motion.button>
            </motion.div>
        </div>
    );
}
