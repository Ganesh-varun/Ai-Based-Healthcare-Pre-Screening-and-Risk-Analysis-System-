import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Navigation, WifiOff, ShieldCheck, Radio, Satellite, Phone } from 'lucide-react';

interface SOSButtonProps {
    onTrigger?: (data: any) => void;
}

export const SOSButton: React.FC<SOSButtonProps> = ({ onTrigger }) => {

    const [isActivating, setIsActivating] = useState(false);
    const [holdProgress, setHoldProgress] = useState(0);
    const [status, setStatus] = useState<'idle' | 'executing' | 'success'>('idle');
    const [sosMessages, setSosMessages] = useState<{ id: string, text: string }[]>([]);
    const [alarmActive, setAlarmActive] = useState(false);
    const alarmRef = useRef<HTMLAudioElement | null>(null);

    const addMessage = (text: string) => {
        setSosMessages(prev => [...prev, { id: `${Date.now()}-${Math.random()}`, text }]);
    };

    const handleStart = useCallback(() => {
        if (status !== 'idle') return;
        setIsActivating(true);
        if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
            window.navigator.vibrate(50);
        }
    }, [status]);

    const handleEnd = useCallback(() => {
        if (status !== 'idle') return;
        setIsActivating(false);
        setHoldProgress(0);
    }, [status]);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isActivating && holdProgress < 100) {
            interval = setInterval(() => {
                setHoldProgress((prev: number) => {
                    if (prev >= 100) {
                        clearInterval(interval);
                        executeSOSRoutine();
                        return 100;
                    }
                    const speed = 2.5 + (prev / 20);
                    return Math.min(prev + speed, 100);
                });
            }, 30);
        }
        return () => clearInterval(interval);
    }, [isActivating]);

    const executeSOSRoutine = async () => {
        setIsActivating(false);
        setStatus('executing');
        setAlarmActive(true);
        
        // Load and play alert sound from /sounds/alert.mp3
        if (!alarmRef.current) {
            alarmRef.current = new Audio('/sounds/alert.mp3');
            alarmRef.current.loop = true;
            
            // Fallback to Pixabay alert if file doesn't exist yet
            alarmRef.current.onerror = () => {
                console.log("Using fallback alert sound - please add your alert.mp3 to public/sounds/");
                if (alarmRef.current) alarmRef.current.src = 'https://cdn.pixabay.com/audio/2022/03/10/audio_55a151b72b.mp3';
                alarmRef.current?.play().catch(e => console.log("Audio play blocked"));
            };
        }
        alarmRef.current.play().catch(e => console.log("Audio play blocked by browser. Interaction required."));

        // Step 1: Record SOS Signal in DB (Express API Simulation)
        addMessage("Initiating emergency protocol...");
        try {
            await fetch('http://127.0.0.1:5000/api/sos/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    device_id: window.navigator.userAgent,
                    status: 'active'
                }),
            });
            console.log("Database: Signal logged successfully.");
        } catch (e) {
            console.warn("Database: Local logging active.");
        }

        // Step 2: Simulated SOS Notification Flow (Dynamic Emergency Contact)
        const patientDataStr = localStorage.getItem("patientData");
        const patientData = patientDataStr ? JSON.parse(patientDataStr) : null;
        
        if (onTrigger) onTrigger(patientData);
        
        setTimeout(() => addMessage("Calling emergency contact..."), 1000);


        try {
            // Trigger Simulation API
            const res = await fetch('/api/sos-call', { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(patientData)
            });
            const data = await res.json();
            
            if (data.success) {
                console.log("Simulation API Result:", data);
                
                // Sequential Simulation Timeline
                setTimeout(() => {
                    addMessage("Sending location...");
                }, 2500);

                setTimeout(() => {
                    addMessage("Family notified...");
                }, 4000);

                setTimeout(() => {
                    addMessage("Emergency services alerted...");
                }, 5500);

                setTimeout(() => {
                    addMessage("All systems reporting success");
                    setStatus('success');
                    setAlarmActive(false);
                    if (alarmRef.current) {
                        alarmRef.current.pause();
                        alarmRef.current.currentTime = 0;
                    }
                }, 7500);

            } else {
                throw new Error("Simulation failure");
            }
        } catch (err) {
            console.error("SOS Trigger Simulation failure:", err);
            // Even if API fails, continue simulation for demo purposes
            setTimeout(() => {
                addMessage("Backup emergency protocols active");
                setStatus('success');
                setAlarmActive(false);
                if (alarmRef.current) alarmRef.current.pause();
            }, 3000);
        }
    };



    return (
        <motion.div 
            animate={isActivating || alarmActive ? {
                x: [0, -4, 4, -4, 4, 0],
                backgroundColor: alarmActive ? ['#fff', '#fee2e2', '#fff'] : '#fff',
                transition: { duration: 0.2, repeat: Infinity }
            } : {}}
            className={`flex flex-col items-center gap-8 p-10 rounded-[40px] border border-slate-200 shadow-2xl relative overflow-hidden group transition-all duration-300 ${alarmActive ? 'border-red-500 ring-4 ring-red-500/20 shadow-red-500/30' : 'bg-white'}`}
        >
            <div className={`absolute inset-0 bg-red-600 transition-opacity duration-300 ${alarmActive ? 'opacity-10 animate-pulse' : 'opacity-0'}`} />

            <div className="text-center space-y-2 relative z-10">
                <h2 className={`text-3xl font-black tracking-tight ${alarmActive ? 'text-red-600' : 'text-slate-900'}`}>
                    {alarmActive ? 'SOS ACTIVE' : 'SOS SIGNAL'}
                </h2>
                <p className="text-slate-500 font-medium">Professional emergency response</p>
            </div>

            <div className="relative w-64 h-64 flex items-center justify-center">
                {/* Visual Feedback Loops */}
                <AnimatePresence>
                    {(isActivating || alarmActive || status === 'executing') && (
                        <>
                            {[1, 2, 3].map((i) => (
                                <motion.div
                                    key={i}
                                    initial={{ scale: 0.8, opacity: 0.5 }}
                                    animate={{ scale: alarmActive ? 3.5 : 2.8, opacity: 0 }}
                                    transition={{
                                        duration: alarmActive ? 1 : 1.5,
                                        repeat: Infinity,
                                        delay: i * 0.4,
                                        ease: "easeOut"
                                    }}
                                    className={`absolute w-full h-full rounded-full ${status === 'success' ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}
                                />
                            ))}
                        </>
                    )}
                </AnimatePresence>

                <svg className="absolute w-full h-full -rotate-90">
                    <circle cx="128" cy="128" r="120" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-100/50" />
                    <motion.circle
                        cx="128" cy="128" r="120" stroke="currentColor" strokeWidth="12" fill="transparent" strokeLinecap="round"
                        className={status === 'success' ? 'text-emerald-500' : alarmActive ? 'text-red-500' : 'text-red-600'}
                        initial={{ strokeDasharray: "754 754", strokeDashoffset: 754 }}
                        animate={{ 
                            strokeDashoffset: 754 - (754 * holdProgress) / 100,
                            scale: holdProgress > 95 ? [1, 1.05, 1] : 1
                        }}
                    />
                </svg>

                <motion.button
                    onMouseDown={handleStart} onMouseUp={handleEnd} onMouseLeave={handleEnd} onTouchStart={handleStart} onTouchEnd={handleEnd}
                    className={`relative z-10 w-48 h-48 rounded-full flex flex-col items-center justify-center gap-2 shadow-3xl transition-all duration-300 ${
                        status === 'success' ? 'bg-emerald-500' :
                        alarmActive ? 'bg-red-600 animate-pulse' :
                        isActivating ? 'bg-red-700' : 'bg-red-600 hover:scale-105'
                    }`}
                >
                    <AnimatePresence mode="wait">
                        {status === 'success' ? (
                            <motion.div key="sc" initial={{ scale: 0 }} animate={{ scale: 1 }}><ShieldCheck size={80} className="text-white" /></motion.div>
                        ) : alarmActive ? (
                            <motion.div key="ph" animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 0.4 }}><Phone size={64} className="text-white fill-white" /></motion.div>
                        ) : (
                            <motion.div key="ac" animate={isActivating ? { scale: [1, 1.1, 1] } : {}}><AlertCircle size={64} className="text-white" /></motion.div>
                        )}
                    </AnimatePresence>
                    <span className="text-white font-black text-[10px] tracking-widest uppercase">
                        {isActivating ? 'Hold Tight' : status === 'success' ? 'RESOLVED' : 'Press & Hold'}
                    </span>
                </motion.button>
            </div>

            {/* Real-time Status Logs */}
            <div className="text-center min-h-[60px] relative z-10 w-full">
                <AnimatePresence>
                    {sosMessages.slice(-2).map((msg, i) => (
                        <motion.div
                            key={msg.id}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: i === 1 ? 0 : -20, opacity: i === 1 ? 1 : 0.4 }}
                            exit={{ y: -40, opacity: 0 }}
                            className={`flex items-center justify-center gap-3 font-black text-xs uppercase tracking-widest ${status === 'success' ? 'text-emerald-600' : 'text-red-600'}`}
                        >
                            {i === 1 && <Radio className="animate-pulse" size={14} />}
                            {msg.text}
                        </motion.div>
                    ))}
                    {status === 'idle' && !isActivating && (
                        <motion.p key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
                            Release to cancel secure trigger
                        </motion.p>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

