import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Bell, Shield, Database, LogOut, ChevronRight } from 'lucide-react';

interface SettingsDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

export const SettingsDrawer = ({ isOpen, onClose }: SettingsDrawerProps) => {
    const menuItems = [
        { icon: User, label: 'Profile Settings', sub: 'Personal information' },
        { icon: Bell, label: 'Notifications', sub: 'Emergency alerts & updates' },
        { icon: Database, label: 'Offline Data', sub: 'Manage cached maps & records' },
        { icon: Shield, label: 'Privacy & Security', sub: 'Permissions & data safety' },
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[150]"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 bottom-0 w-full max-w-[320px] bg-white z-[200] shadow-2xl flex flex-col"
                    >
                        <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                            <div>
                                <h2 className="text-2xl font-black text-slate-900">Settings</h2>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Control Center</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
                            {menuItems.map((item, i) => (
                                <motion.button
                                    key={i}
                                    initial={{ x: 20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="w-full flex items-center gap-4 p-4 hover:bg-slate-50 rounded-3xl transition-all group active:scale-[0.98]"
                                >
                                    <div className="p-3 bg-slate-100 rounded-2xl text-slate-600 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                                        <item.icon size={20} />
                                    </div>
                                    <div className="text-left flex-1">
                                        <p className="font-bold text-slate-800">{item.label}</p>
                                        <p className="text-xs text-slate-400 font-medium">{item.sub}</p>
                                    </div>
                                    <ChevronRight size={16} className="text-slate-300 group-hover:text-slate-500 transition-colors" />
                                </motion.button>
                            ))}
                        </div>

                        <div className="p-6 border-t border-slate-100">
                            <button className="w-full flex items-center justify-center gap-2 p-4 bg-red-50 text-red-600 rounded-[24px] font-bold hover:bg-red-100 transition-colors active:scale-95">
                                <LogOut size={18} />
                                Sign Out
                            </button>
                            <p className="text-[10px] text-center text-slate-300 mt-4 font-black uppercase tracking-widest">
                                HealthGuard v1.0.4
                            </p>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
