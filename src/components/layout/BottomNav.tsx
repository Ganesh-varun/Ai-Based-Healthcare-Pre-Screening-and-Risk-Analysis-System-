'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Navigation, Activity, Shield, Settings } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface BottomNavProps {
    onSettingsClick: () => void;
}

export const BottomNav = ({ onSettingsClick }: BottomNavProps) => {
    const pathname = usePathname();

    const tabs = [
        { icon: Heart, path: '/', label: 'Home' },
        { icon: Navigation, path: '/appointments', label: 'Care' },
        { icon: Activity, path: '/triage', label: 'Triage', isCenter: true },
        { icon: Shield, path: '/sos', label: 'SOS' },
        { icon: Settings, path: '#', label: 'Settings', isSettings: true },
    ];

    return (
        <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-slate-900/90 backdrop-blur-2xl border border-slate-800/50 px-8 py-4 rounded-full flex gap-10 items-center text-slate-400 shadow-[0_20px_50px_rgba(0,0,0,0.3)] z-[100] max-w-fit pointer-events-auto">
            {tabs.map((tab) => {
                const isActive = pathname === tab.path;

                const content = (
                    <motion.div
                        whileHover={{ scale: 1.1, y: tab.isCenter ? -5 : 0 }}
                        whileTap={{ scale: 0.9 }}
                        className={`${tab.isCenter
                                ? `w-14 h-14 rounded-full flex items-center justify-center text-white shadow-xl -mt-10 transition-all ${isActive ? 'bg-blue-500 ring-4 ring-slate-900' : 'bg-blue-600'}`
                                : `p-2 transition-colors relative ${isActive ? 'text-blue-500' : 'hover:text-blue-400'}`
                            }`}
                    >
                        <tab.icon size={tab.isCenter ? 28 : 24} />
                        {isActive && !tab.isCenter && (
                            <motion.div
                                layoutId="activeTab"
                                className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full"
                            />
                        )}
                    </motion.div>
                );

                if (tab.isSettings) {
                    return (
                        <button key={tab.label} onClick={onSettingsClick}>
                            {content}
                        </button>
                    );
                }

                return (
                    <Link key={tab.path} href={tab.path}>
                        {content}
                    </Link>
                );
            })}
        </nav>
    );
};
