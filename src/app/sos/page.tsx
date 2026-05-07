'use client';

import React, { useState } from 'react';
import { SOSButton } from '@/components/features/sos/SOSButton';
import dynamic from 'next/dynamic';
const OfflineMap = dynamic(() => import('@/components/features/maps/OfflineMap').then((mod) => mod.OfflineMap), {
    ssr: false,
    loading: () => <div className="h-[650px] w-full bg-slate-100 animate-pulse rounded-3xl flex items-center justify-center text-slate-400 font-bold">LOADING OFFLINE MAP...</div>
});
import { ChevronLeft, LifeBuoy, Info, ShieldAlert, HeartPulse, Droplets, Wind, Zap, Navigation, X, Phone, MapPin, User, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function SOSPage() {
    const [calling, setCalling] = useState(false);
    const [callData, setCallData] = useState<any>(null);
    const [locationSent, setLocationSent] = useState(false);
    const [familyNotified, setFamilyNotified] = useState(false);

    const handleSOSTrigger = (data: any) => {
        setCallData(data);
        setCalling(true);
        
        // Simulation for overlay messages
        setTimeout(() => setLocationSent(true), 1500);
        setTimeout(() => setFamilyNotified(true), 3500);
    };


    const instructions = [
        "Keep the patient warm and calm.",
        "Do not move if spinal injury is suspected.",
        "Apply pressure to any bleeding wounds."
    ];

    const emergencySituations = [
        {
            title: "Cardiac Arrest",
            icon: <HeartPulse className="text-red-500" />,
            color: "red",
            steps: [
                "Check for breathing and pulse.",
                "Call emergency services immediately.",
                "Perform chest compressions (100-120 bpm).",
                "Use an AED if available."
            ]
        },
        {
            title: "Severe Bleeding",
            icon: <Droplets className="text-orange-500" />,
            color: "orange",
            steps: [
                "Apply direct pressure with a clean cloth.",
                "Elevate the wound above heart level.",
                "Apply a tourniquet if bleeding is life-threatening.",
                "Do not remove soaked bandages; add more on top."
            ]
        },
        {
            title: "Choking",
            icon: <Wind className="text-blue-500" />,
            color: "blue",
            steps: [
                "Encourage the person to cough.",
                "Give 5 back blows between shoulder blades.",
                "Perform 5 abdominal thrusts (Heimlich maneuver).",
                "Repeat until object is forced out or person faints."
            ]
        },
        {
            title: "Electric Shock",
            icon: <Zap className="text-amber-500" />,
            color: "amber",
            steps: [
                "Do not touch the person if still in contact with current.",
                "Turn off the power source if safe.",
                "Use a non-conductive object to move them away.",
                "Check for breathing and start CPR if needed."
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-[#f8fafc]">
            {/* Header / Background Glow */}
            <div className="fixed top-0 left-0 w-full h-96 bg-gradient-to-b from-red-50 to-transparent pointer-events-none" />

            <div className="max-w-6xl mx-auto py-8 px-6 space-y-12 pb-32 relative z-10">
                <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                >
                    <Link href="/" className="inline-flex items-center gap-2 text-slate-500 font-bold hover:text-slate-800 transition-colors group">
                        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        BACK TO HOME
                    </Link>
                </motion.div>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-center"
                >
                    <div className="flex flex-col items-center gap-3 mb-1">
                        <div className="p-2 bg-red-100 rounded-lg text-red-600">
                            <ShieldAlert size={20} />
                        </div>
                        <span className="text-xs font-black tracking-[0.2em] text-red-600 uppercase">Emergency Protocol</span>
                    </div>
                    <h1 className="text-6xl font-black text-slate-900 leading-none tracking-tighter">
                        GET <span className="text-red-600">HELP.</span>
                    </h1>
                </motion.div>

                {/* Top Section Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                    {/* Left Cards */}
                    <div className="lg:col-span-3 space-y-4 order-2 lg:order-1">
                        {emergencySituations.slice(0, 2).map((situation, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ x: -20, opacity: 0 }}
                                whileInView={{ x: 0, opacity: 1 }}
                                whileHover={{ scale: 1.02, x: 5 }}
                                transition={{ delay: idx * 0.1 }}
                                viewport={{ once: true }}
                                className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-lg hover:shadow-2xl hover:border-slate-200 transition-all cursor-pointer group"
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-xl bg-${situation.color}-50 group-hover:scale-110 transition-transform`}>
                                            {situation.icon}
                                        </div>
                                        <h3 className="text-md font-bold text-slate-800">{situation.title}</h3>
                                    </div>
                                    <div className="text-[10px] font-black text-slate-300 group-hover:text-blue-500 transition-colors">TAP FOR MORE</div>
                                </div>
                                <div className="space-y-3">
                                    {situation.steps.slice(0, 3).map((step, sIdx) => (
                                        <div key={sIdx} className="flex gap-3">
                                            <div className="w-5 h-5 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                                                <span className="text-[10px] font-black text-slate-400">{sIdx + 1}</span>
                                            </div>
                                            <p className="text-[12px] text-slate-600 font-bold leading-tight">{step}</p>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Middle SOS Button */}
                    <div className="lg:col-span-6 order-1 lg:order-2 flex flex-col items-center gap-6">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", damping: 15 }}
                            className="w-full"
                        >
                            <SOSButton onTrigger={handleSOSTrigger} />
                        </motion.div>
                        <div className="flex gap-4">
                             <div className="px-5 py-2 bg-white rounded-full border border-slate-100 shadow-sm flex items-center gap-2">
                                <span className="w-2 h-2 bg-blue-500 rounded-full animate-ping" />
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Signal Strength: Optimal</span>
                             </div>
                             <div className="px-5 py-2 bg-white rounded-full border border-slate-100 shadow-sm flex items-center gap-2">
                                <span className="w-2 h-2 bg-emerald-500 rounded-full" />
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Battery: Protected</span>
                             </div>
                        </div>
                    </div>

                    {/* Right Cards */}
                    <div className="lg:col-span-3 space-y-4 order-3 lg:order-3">
                        {emergencySituations.slice(2, 4).map((situation, idx) => (
                            <motion.div
                                key={idx + 2}
                                initial={{ x: 20, opacity: 0 }}
                                whileInView={{ x: 0, opacity: 1 }}
                                whileHover={{ scale: 1.02, x: -5 }}
                                transition={{ delay: (idx + 2) * 0.1 }}
                                viewport={{ once: true }}
                                className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-lg hover:shadow-2xl hover:border-slate-200 transition-all cursor-pointer group"
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-xl bg-${situation.color}-50 group-hover:scale-110 transition-transform`}>
                                            {situation.icon}
                                        </div>
                                        <h3 className="text-md font-bold text-slate-800">{situation.title}</h3>
                                    </div>
                                    <div className="text-[10px] font-black text-slate-300 group-hover:text-blue-500 transition-colors">TAP FOR MORE</div>
                                </div>
                                <div className="space-y-3">
                                    {situation.steps.slice(0, 3).map((step, sIdx) => (
                                        <div key={sIdx} className="flex gap-3">
                                            <div className="w-5 h-5 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                                                <span className="text-[10px] font-black text-slate-400">{sIdx + 1}</span>
                                            </div>
                                            <p className="text-[12px] text-slate-600 font-bold leading-tight">{step}</p>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    className="space-y-6"
                >
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
                            <LifeBuoy className="text-blue-500" size={28} /> Professional Support
                        </h2>
                        <div className="flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-full text-xs font-bold ring-1 ring-emerald-100">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                            OFFLINE SYSTEMS ACTIVE
                        </div>
                    </div>
                    <div className="h-[650px] rounded-[40px] overflow-hidden border-8 border-white shadow-2xl relative">
                        <OfflineMap variant="simple" />
                    </div>
                    <p className="text-xs text-slate-400 text-center uppercase tracking-[0.3em] font-black">
                        High-precision satellite mapping cached locally for emergency response
                    </p>
                </motion.div>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-2xl space-y-8"
                >
                    <h3 className="text-xl font-black flex items-center gap-4 text-slate-800">
                        <div className="p-3 bg-amber-50 rounded-2xl text-amber-500 shadow-sm">
                            <Info size={24} />
                        </div>
                        General Survival Guidelines
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {instructions.map((text, i) => (
                            <motion.div
                                key={i}
                                initial={{ y: 10, opacity: 0 }}
                                whileInView={{ y: 0, opacity: 1 }}
                                transition={{ delay: i * 0.1 }}
                                viewport={{ once: true }}
                                className="flex gap-4 p-4 rounded-3xl bg-slate-50 border border-slate-100"
                            >
                                <span className="w-8 h-8 bg-white rounded-xl shadow-sm flex items-center justify-center text-xs font-black text-slate-400 shrink-0 border border-slate-100">
                                    0{i + 1}
                                </span>
                                <p className="text-sm text-slate-600 font-bold leading-snug">{text}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Emergency Overlay UI */}
            <AnimatePresence>
                {calling && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-red-600 text-white z-[100] flex flex-col p-8 md:p-12 overflow-hidden"
                    >
                        {/* Dramatic Red Pulse Background */}
                        <motion.div 
                            animate={{ opacity: [0.1, 0.4, 0.1] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                            className="absolute inset-0 bg-gradient-to-tr from-black/60 via-transparent to-black/60"
                        />

                        <div className="relative z-10 flex flex-col h-full max-w-5xl mx-auto w-full">
                            <div className="flex justify-between items-start">
                                <motion.div
                                    animate={{ scale: [1, 1.1, 1] }}
                                    transition={{ repeat: Infinity, duration: 0.6 }}
                                    className="p-5 bg-white/10 rounded-[2.5rem] border-2 border-white/20 backdrop-blur-md"
                                >
                                    <AlertTriangle size={48} className="text-white fill-white/20" />
                                </motion.div>
                                <button 
                                    onClick={() => setCalling(false)}
                                    className="p-5 bg-black/20 hover:bg-black/40 rounded-full transition-all border border-white/10 backdrop-blur-lg"
                                >
                                    <X size={32} />
                                </button>
                            </div>

                            <div className="mt-12 space-y-4">
                                <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] animate-pulse">
                                    🚨 EMERGENCY <br /> IN PROGRESS
                                </h1>
                                <p className="text-lg md:text-xl font-black text-red-100 uppercase tracking-[0.4em] opacity-80">
                                    SATELLITE LINK ESTABLISHED • LEVEL 1 RESPONSE
                                </p>
                            </div>

                            {/* Patient Data Grid */}
                            <div className="mt-auto grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
                                <div className="p-8 bg-white/10 rounded-[3rem] border border-white/20 backdrop-blur-2xl space-y-4">
                                    <div className="flex items-center gap-4 text-white/50">
                                        <User size={18} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Identification</span>
                                    </div>
                                    <h3 className="text-3xl font-black leading-none">{callData?.name || 'GUEST USER'}</h3>
                                    <p className="text-red-100/60 font-medium text-sm italic">&quot;{callData?.medicalHistory || 'No pre-existing conditions reported'}&quot;</p>
                                </div>

                                <div className="p-8 bg-white/10 rounded-[3rem] border border-white/20 backdrop-blur-2xl space-y-4">
                                    <div className="flex items-center gap-4 text-white/50">
                                        <Phone size={18} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Primary Contact</span>
                                    </div>
                                    <h3 className="text-4xl font-black tracking-tighter tabular-nums">{callData?.emergencyContact || '+91 XXXX XXXX'}</h3>
                                    <div className="flex items-center gap-2">
                                        <motion.div 
                                            animate={{ opacity: [1, 0, 1] }}
                                            className="w-2.5 h-2.5 bg-emerald-400 rounded-full"
                                        />
                                        <span className="font-black text-[10px] uppercase tracking-widest text-emerald-300">
                                            {familyNotified ? "CONNECTION CONFIRMED" : "CONNECTING..."}
                                        </span>
                                    </div>
                                </div>

                                <div className="md:col-span-2 p-8 bg-white/10 rounded-[3rem] border border-white/20 backdrop-blur-2xl space-y-4">
                                    <div className="flex items-center gap-4 text-white/50">
                                        <MapPin size={18} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Active Geodata</span>
                                    </div>
                                    <p className="text-2xl font-black leading-tight max-w-2xl">{callData?.address || 'CALCULATING ACCURATE LOCATION...'}</p>
                                    <div className="flex items-center gap-4 pt-2">
                                        <div className="flex items-center gap-2 px-4 py-2 bg-black/20 rounded-full border border-white/10">
                                            <Navigation size={14} className="text-white/40" />
                                            <span className="font-black text-[10px] tabular-nums opacity-60 uppercase">17.3850 N, 78.4867 E</span>
                                        </div>
                                        <span className="text-[10px] font-black text-rose-300 animate-pulse uppercase">GPS Lock: High Precision</span>
                                    </div>
                                </div>
                            </div>

                            {/* Status Bar */}
                            <div className="flex flex-col md:flex-row justify-between items-center bg-black/30 p-8 rounded-[3rem] border border-white/10 backdrop-blur-md">
                                <div className="flex gap-6 mb-4 md:mb-0">
                                    <div className={`p-5 rounded-2xl ${locationSent ? 'bg-emerald-500 shadow-lg shadow-emerald-500/40' : 'bg-white/5'} transition-all duration-500`}>
                                        <Navigation className={locationSent ? "text-white" : "animate-pulse text-white/20"} />
                                    </div>
                                    <div className={`p-5 rounded-2xl ${familyNotified ? 'bg-emerald-500 shadow-lg shadow-emerald-500/40' : 'bg-white/5'} transition-all duration-500`}>
                                        <Phone className={familyNotified ? "text-white" : "animate-bounce text-white/20"} />
                                    </div>
                                    <div className="p-5 rounded-2xl bg-white/5">
                                        <MapPin className="text-white/10" />
                                    </div>
                                </div>
                                <div className="text-center md:text-right">
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mb-2">Operation Status</p>
                                    <p className="font-black text-sm uppercase tracking-[0.2em] text-red-100">
                                        {familyNotified ? "SUCCESS • ALERT DISTRIBUTED" : "EXECUTING COMPLIANCE CHECKS..."}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

