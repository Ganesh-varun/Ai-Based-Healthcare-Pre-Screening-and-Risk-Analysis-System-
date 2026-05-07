'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Database, Calendar, Files, RefreshCcw, Search } from 'lucide-react';

interface DatasetStats {
    _id: string;
    count: number;
    lastUploaded: string;
}

export const DatasetList = () => {
    const [stats, setStats] = useState<DatasetStats[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchStats = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://127.0.0.1:5000/api/dataset/summary');
            const data = await response.json();
            setStats(data);
            setError('');
        } catch (err) {
            setError('Failed to fetch dataset summary');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-black text-slate-800">Existing Inventory</h3>
                    <p className="text-slate-500 text-sm font-medium">Datasets currently active in the engine</p>
                </div>
                <button
                    onClick={fetchStats}
                    className="p-3 hover:bg-slate-100 rounded-2xl transition-colors text-slate-400 hover:text-blue-600"
                >
                    <RefreshCcw size={20} className={loading ? 'animate-spin' : ''} />
                </button>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[1, 2].map(i => (
                        <div key={i} className="h-32 bg-slate-100 animate-pulse rounded-[32px]" />
                    ))}
                </div>
            ) : stats.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {stats.map((item, idx) => (
                        <motion.div
                            key={item._id}
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-lg hover:shadow-xl transition-all group"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                    <Files size={24} />
                                </div>
                                <div className="text-right">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Records</span>
                                    <p className="text-2xl font-black text-slate-800 leading-none">{item.count}</p>
                                </div>
                            </div>

                            <div>
                                <h4 className="font-bold text-slate-800 truncate mb-1">{item._id || 'Unnamed Dataset'}</h4>
                                <div className="flex items-center gap-2 text-slate-400">
                                    <Calendar size={14} />
                                    <span className="text-xs font-bold">
                                        Last Sync: {new Date(item.lastUploaded).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[32px] p-12 text-center">
                    <div className="inline-block p-4 bg-white rounded-2xl shadow-sm text-slate-300 mb-4">
                        <Database size={32} />
                    </div>
                    <p className="font-bold text-slate-400">No datasets found in the cloud engine</p>
                </div>
            )}
        </div>
    );
};
