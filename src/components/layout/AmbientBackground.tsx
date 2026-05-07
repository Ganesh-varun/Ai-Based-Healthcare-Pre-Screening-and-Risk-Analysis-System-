'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MedicalCross = ({ size }: { size: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
);

const MedicalHeart = ({ size }: { size: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
);

const VitalPulse = ({ size }: { size: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
);

const HeartbeatLine = () => (
    <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
        <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{
                duration: 8,
                repeat: Infinity,
                ease: "linear",
            }}
            className="w-full h-full flex items-center"
        >
            <svg width="100%" height="150" viewBox="0 0 1000 150" preserveAspectRatio="none" className="text-emerald-500">
                <path
                    d="M0,75 L400,75 L410,60 L425,90 L440,30 L455,120 L470,75 L480,75 L1000,75"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    className="filter blur-[1px]"
                />
            </svg>
        </motion.div>
    </div>
);

export const AmbientBackground = () => {
    const [particles, setParticles] = useState<any[]>([]);

    useEffect(() => {
        setParticles([...Array(25)].map((_, i) => ({
            id: i,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            size: Math.random() * 15 + 8,
            duration: Math.random() * 25 + 15,
            delay: Math.random() * 10,
            type: ['cross', 'heart', 'pulse', 'circle'][Math.floor(Math.random() * 4)],
            opacity: Math.random() * 0.3 + 0.1
        })));
    }, []);

    const orbs = [
        { color: 'bg-emerald-600/20', size: 'w-[40rem] h-[40rem]', pos: '-top-48 -right-48', duration: 15 },
        { color: 'bg-blue-600/10', size: 'w-[35rem] h-[35rem]', pos: '-bottom-48 -left-48', duration: 20 },
        { color: 'bg-indigo-600/10', size: 'w-[30rem] h-[30rem]', pos: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2', duration: 25 },
        { color: 'bg-emerald-500/10', size: 'w-[25rem] h-[25rem]', pos: 'top-1/4 left-1/3', duration: 18 },
    ];

    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-[-2] bg-slate-950">
            {/* Moving Aura Orbs */}
            {orbs.map((orb, i) => (
                <motion.div
                    key={i}
                    animate={{
                        x: [0, 50, -30, 0],
                        y: [0, -40, 60, 0],
                        scale: [1, 1.1, 0.9, 1],
                    }}
                    transition={{
                        duration: orb.duration,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className={`absolute ${orb.pos} ${orb.size} ${orb.color} rounded-full blur-[120px]`}
                />
            ))}

            {/* Scanning Heartbeat Line */}
            <HeartbeatLine />
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{ backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`, backgroundSize: '40px 40px' }}
            />

            {/* Floating Medical Particles */}
            {particles.map((p) => (
                <motion.div
                    key={p.id}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{
                        y: [0, -150, 0],
                        opacity: [0, p.opacity, 0],
                        scale: [0.8, 1, 0.8],
                        rotate: [0, 10, -10, 0]
                    }}
                    transition={{
                        duration: p.duration,
                        repeat: Infinity,
                        delay: p.delay,
                        ease: "easeInOut",
                    }}
                    style={{
                        top: p.top,
                        left: p.left,
                        color: 'rgba(52, 211, 153, 0.4)' // Emerald color for medical feel
                    }}
                    className="absolute pointer-events-none"
                >
                    {p.type === 'cross' && <MedicalCross size={p.size} />}
                    {p.type === 'heart' && <MedicalHeart size={p.size} />}
                    {p.type === 'pulse' && <VitalPulse size={p.size} />}
                    {p.type === 'circle' && (
                        <div
                            className="rounded-full bg-emerald-400/20 blur-[1px]"
                            style={{ width: p.size, height: p.size }}
                        />
                    )}
                </motion.div>
            ))}

            {/* Mesh Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-transparent to-slate-950 opacity-80" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(2,6,23,0.6)_100%)]" />
        </div>
    );
};
