'use client';

import React from 'react';
import { SOSButton } from '@/components/features/sos/SOSButton';
import { OfflineMap } from '@/components/features/maps/OfflineMap';
import { ChevronLeft, LifeBuoy, Info, ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function SOSPage() {
    const instructions = [
        "Keep the patient warm and calm.",
        "Do not move if spinal injury is suspected.",
        "Apply pressure to any bleeding wounds."
    ];

    return (
        <div className="min-h-screen bg-[#f8fafc]">
            {/* Header / Background Glow */}
            <div className="fixed top-0 left-0 w-full h-96 bg-gradient-to-b from-red-50 to-transparent pointer-events-none" />

            <div className="max-w-md mx-auto py-8 px-6 space-y-8 pb-32 relative z-10">
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
                >
                    <div className="flex items-center gap-3 mb-1">
                        <div className="p-2 bg-red-100 rounded-lg text-red-600">
                            <ShieldAlert size={20} />
                        </div>
                        <span className="text-xs font-black tracking-[0.2em] text-red-600 uppercase">Emergency Protocol</span>
                    </div>
                    <h1 className="text-5xl font-black text-slate-900 leading-none tracking-tighter">
                        GET <span className="text-red-600">HELP.</span>
                    </h1>
                </motion.div>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <SOSButton />
                </motion.div>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    className="space-y-4"
                >
                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <LifeBuoy className="text-blue-500" /> Professional Support
                    </h2>
                    <div className="rounded-[32px] overflow-hidden border border-slate-200 shadow-xl">
                        <OfflineMap />
                    </div>
                    <p className="text-[10px] text-slate-400 text-center uppercase tracking-widest font-black">
                        Maps cached locally for offline response
                    </p>
                </motion.div>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-xl space-y-6"
                >
                    <h3 className="font-bold flex items-center gap-3 text-slate-700">
                        <div className="p-2 bg-amber-50 rounded-xl text-amber-500">
                            <Info size={18} />
                        </div>
                        First Aid Instructions
                    </h3>
                    <div className="space-y-4">
                        {instructions.map((text, i) => (
                            <motion.div
                                key={i}
                                initial={{ x: -10, opacity: 0 }}
                                whileInView={{ x: 0, opacity: 1 }}
                                transition={{ delay: i * 0.1 }}
                                viewport={{ once: true }}
                                className="flex gap-4"
                            >
                                <span className="w-6 h-6 bg-slate-50 rounded-lg flex items-center justify-center text-[10px] font-bold text-slate-400 shrink-0 border border-slate-100">
                                    0{i + 1}
                                </span>
                                <p className="text-sm text-slate-600 font-medium leading-relaxed">{text}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
