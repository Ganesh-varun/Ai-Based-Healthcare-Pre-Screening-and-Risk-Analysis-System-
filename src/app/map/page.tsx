'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';

const OfflineMap = dynamic(() => import('@/components/features/maps/OfflineMap').then((mod) => mod.OfflineMap), {
    ssr: false,
    loading: () => (
        <div className="fixed inset-0 bg-slate-950 flex flex-col items-center justify-center text-white space-y-6">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin shadow-[0_0_30px_rgba(59,130,246,0.3)]" />
            <div className="text-center">
                <h1 className="text-2xl font-black tracking-tighter uppercase mb-2">Initializing Satellite Link</h1>
                <p className="text-slate-500 text-xs font-bold tracking-[0.2em]">CACHING LOCAL EMERGERCY DATA</p>
            </div>
        </div>
    )
});

export default function MapPage() {
    return (
        <main className="fixed inset-0 bg-white">
            <OfflineMap />

            {/* Minimal Overlay for Branding if needed */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="fixed top-6 left-1/2 -translate-x-1/2 z-[3000] pointer-events-none"
            >
                <div className="bg-slate-900/40 backdrop-blur-md px-6 py-2 rounded-full border border-white/10 flex items-center gap-2">
                    <span className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em]">HealthGuard</span>
                    <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em]">Visualizer</span>
                </div>
            </motion.div>
        </main>
    );
}
