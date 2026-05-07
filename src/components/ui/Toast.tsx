'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((message: string, type: ToastType = 'info') => {
        const id = Math.random().toString(36).substr(2, 9);
        setToasts((prev) => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 5000);
    }, []);

    const removeToast = (id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[300] flex flex-col gap-3 pointer-events-none w-full max-w-sm px-6">
                <AnimatePresence>
                    {toasts.map((toast) => (
                        <motion.div
                            key={toast.id}
                            initial={{ y: -20, opacity: 0, scale: 0.9 }}
                            animate={{ y: 0, opacity: 1, scale: 1 }}
                            exit={{ y: -20, opacity: 0, scale: 0.9 }}
                            className={`pointer-events-auto p-4 rounded-3xl shadow-2xl flex items-center gap-4 border backdrop-blur-xl ${toast.type === 'success' ? 'bg-emerald-500/90 border-emerald-400 text-white' :
                                    toast.type === 'error' ? 'bg-red-500/90 border-red-400 text-white' :
                                        'bg-slate-900/90 border-slate-700 text-white'
                                }`}
                        >
                            <div className="shrink-0">
                                {toast.type === 'success' && <CheckCircle2 size={24} />}
                                {toast.type === 'error' && <AlertCircle size={24} />}
                                {toast.type === 'info' && <Info size={24} />}
                            </div>
                            <p className="flex-1 font-bold text-sm tracking-tight">{toast.message}</p>
                            <button
                                onClick={() => removeToast(toast.id)}
                                className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) throw new Error('useToast must be used within ToastProvider');
    return context;
};
