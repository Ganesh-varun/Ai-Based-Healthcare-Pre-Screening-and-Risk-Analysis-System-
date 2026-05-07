'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { AlertCircle, Activity, MapPin, Shield } from 'lucide-react';

export const TopNav = () => {
    return (
        <nav className="fixed top-0 left-0 right-0 z-[100] px-8 py-6 flex justify-between items-center bg-slate-950/20 backdrop-blur-xl border-b border-white/5">
            <Link href="/" className="flex items-center gap-2 group">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:rotate-12 transition-transform">
                    <Shield className="text-white" size={20} />
                </div>
                <span className="text-2xl font-black tracking-tighter">
                    Health<span className="text-blue-500">Guard</span>
                </span>
            </Link>

            {/* Navigation Links Removed */}

            <div className="flex items-center gap-4">
                <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-900/50 rounded-full border border-white/5">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">System Online</span>
                </div>
            </div>
        </nav>
    );
};
