import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { AlertCircle, Navigation, WifiOff } from 'lucide-react';
import { saveSOSPacket } from '@/lib/offline/db';

export const SOSButton = () => {
    const [isActivating, setIsActivating] = useState(false);
    const [holdProgress, setHoldProgress] = useState(0);
    const [status, setStatus] = useState<'idle' | 'locating' | 'sending' | 'offline-stored' | 'success'>('idle');
    const controls = useAnimation();

    const handleStart = () => {
        if (status !== 'idle') return;
        setIsActivating(true);
    };

    const handleEnd = () => {
        if (status !== 'idle') return;
        setIsActivating(false);
        setHoldProgress(0);
    };

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isActivating && holdProgress < 100) {
            interval = setInterval(() => {
                setHoldProgress((prev: number) => {
                    if (prev >= 100) {
                        clearInterval(interval);
                        triggerSOS();
                        return 100;
                    }
                    return prev + 2; // ~1 second to fill
                });
            }, 20);
        }
        return () => clearInterval(interval);
    }, [isActivating]);

    const triggerSOS = async () => {
        setIsActivating(false);
        setStatus('locating');

        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser');
            setStatus('idle');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude, accuracy } = position.coords;
                setStatus('sending');

                const packet = {
                    id: crypto.randomUUID(),
                    timestamp: Date.now(),
                    location: { lat: latitude, lng: longitude, accuracy },
                    status: (navigator.onLine ? 'synced' : 'pending') as 'synced' | 'pending'
                };

                await saveSOSPacket(packet);

                if (!navigator.onLine) {
                    setStatus('offline-stored');
                } else {
                    try {
                        await fetch('/api/sos', {
                            method: 'POST',
                            body: JSON.stringify(packet),
                        });
                        setStatus('success');
                    } catch (e) {
                        setStatus('offline-stored');
                    }
                }

                setTimeout(() => setStatus('idle'), 5000);
            },
            (error) => {
                alert('Could not get location. Check permissions.');
                setStatus('idle');
            }
        );
    };

    return (
        <div className="flex flex-col items-center gap-8 p-10 bg-white rounded-[40px] border border-slate-200 shadow-2xl relative overflow-hidden group">
            {/* Animated Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-b from-red-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

            <div className="text-center space-y-2 relative z-10">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">SOS SIGNAL</h2>
                <p className="text-slate-500 font-medium">Professional emergency response</p>
            </div>

            <div className="relative w-64 h-64 flex items-center justify-center">
                {/* Ripple Effects */}
                <AnimatePresence>
                    {(isActivating || status !== 'idle') && (
                        <>
                            {[1, 2, 3].map((i) => (
                                <motion.div
                                    key={i}
                                    initial={{ scale: 0.8, opacity: 0.5 }}
                                    animate={{ scale: 2.5, opacity: 0 }}
                                    exit={{ opacity: 0 }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        delay: i * 0.6,
                                        ease: "easeOut"
                                    }}
                                    className="absolute w-full h-full rounded-full bg-red-500/20"
                                />
                            ))}
                        </>
                    )}
                </AnimatePresence>

                {/* Progress Ring */}
                <svg className="absolute w-full h-full -rotate-90">
                    <circle
                        cx="128"
                        cy="128"
                        r="120"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        className="text-slate-100"
                    />
                    <motion.circle
                        cx="128"
                        cy="128"
                        r="120"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        strokeLinecap="round"
                        className="text-red-600"
                        initial={{ strokeDasharray: "754 754", strokeDashoffset: 754 }}
                        animate={{ strokeDashoffset: 754 - (754 * holdProgress) / 100 }}
                        transition={{ type: "spring", bounce: 0, duration: 0.1 }}
                    />
                </svg>

                {/* Main Button */}
                <motion.button
                    onMouseDown={handleStart}
                    onMouseUp={handleEnd}
                    onMouseLeave={handleEnd}
                    onTouchStart={handleStart}
                    onTouchEnd={handleEnd}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.95 }}
                    className={`relative z-10 w-48 h-48 rounded-full flex flex-col items-center justify-center gap-2 shadow-2xl transition-colors duration-500 ${status === 'success' ? 'bg-emerald-500' :
                        status === 'offline-stored' ? 'bg-amber-500' :
                            isActivating ? 'bg-red-700' : 'bg-red-600'
                        }`}
                >
                    <AlertCircle size={64} className="text-white" />
                    <span className="text-white font-black text-xs tracking-widest uppercase">
                        {isActivating ? 'Hold Tight' : 'Press & Hold'}
                    </span>
                </motion.button>
            </div>

            <div className="text-center min-h-[40px] relative z-10">
                <AnimatePresence mode="wait">
                    {status === 'locating' && (
                        <motion.p
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -10, opacity: 0 }}
                            className="text-amber-600 font-bold flex items-center gap-2"
                        >
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                            </span>
                            Locating Device...
                        </motion.p>
                    )}
                    {status === 'sending' && (
                        <motion.p
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -10, opacity: 0 }}
                            className="text-blue-600 font-bold flex items-center gap-2"
                        >
                            <Navigation className="animate-bounce" size={18} />
                            Broadcasting SOS...
                        </motion.p>
                    )}
                    {status === 'offline-stored' && (
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="flex items-center gap-2 text-amber-700 font-bold bg-amber-100 px-6 py-2 rounded-full border border-amber-200"
                        >
                            <WifiOff size={18} />
                            <span>Signal Stored Offline</span>
                        </motion.div>
                    )}
                    {status === 'success' && (
                        <motion.p
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="text-emerald-600 font-bold"
                        >
                            ✓ Alert Sent Successfully
                        </motion.p>
                    )}
                    {status === 'idle' && !isActivating && (
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-slate-400 text-sm font-medium"
                        >
                            Release to cancel trigger
                        </motion.p>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

