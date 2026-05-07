'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export const DatasetUpload = () => {
    const [file, setFile] = useState<File | null>(null);
    const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');
    const [stats, setStats] = useState<{ count: number; name: string } | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setStatus('idle');
            setMessage('');
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setStatus('uploading');
        const formData = new FormData();
        formData.append('dataset', file);
        formData.append('name', file.name);

        try {
            const response = await fetch('http://127.0.0.1:5000/api/dataset/upload', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();

            if (response.ok) {
                setStatus('success');
                setStats({ count: result.count, name: result.datasetName });
                setMessage('Dataset processed and saved to database successfully!');
            } else {
                setStatus('error');
                setMessage(result.error || 'Failed to upload dataset');
            }
        } catch (error) {
            setStatus('error');
            setMessage('Network error. Is the backend server running?');
        }
    };

    return (
        <div className="max-w-xl mx-auto p-8 bg-white rounded-[40px] shadow-2xl border border-slate-100">
            <div className="space-y-6">
                <div className="text-center">
                    <h2 className="text-2xl font-black text-slate-800">Dataset Management</h2>
                    <p className="text-slate-500 text-sm font-medium">Upload .csv files to update the healthcare engine</p>
                </div>

                <div className="relative group">
                    <input
                        type="file"
                        accept=".csv"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className={`
                        border-2 border-dashed rounded-[32px] p-12 flex flex-col items-center gap-4 transition-all
                        ${file ? 'border-emerald-200 bg-emerald-50' : 'border-slate-200 bg-slate-50 group-hover:border-blue-300 group-hover:bg-blue-50'}
                    `}>
                        <div className={`p-4 rounded-2xl ${file ? 'bg-emerald-100 text-emerald-600' : 'bg-white text-slate-400 shadow-sm'}`}>
                            {file ? <FileText size={32} /> : <Upload size={32} />}
                        </div>
                        <div className="text-center">
                            <p className="font-bold text-slate-700">{file ? file.name : 'Select CSV File'}</p>
                            <p className="text-xs text-slate-400 font-medium">Max size: 10MB</p>
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleUpload}
                    disabled={!file || status === 'uploading'}
                    className={`
                        w-full py-5 rounded-[24px] font-black text-lg transition-all shadow-xl
                        flex items-center justify-center gap-3
                        ${!file || status === 'uploading'
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95 shadow-blue-200'}
                    `}
                >
                    {status === 'uploading' ? (
                        <>
                            <Loader2 className="animate-spin" />
                            PROCESSING DATA...
                        </>
                    ) : (
                        'START SECURE UPLOAD'
                    )}
                </button>

                <AnimatePresence>
                    {status !== 'idle' && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                        >
                            <div className={`
                                p-6 rounded-[24px] flex items-start gap-4
                                ${status === 'success' ? 'bg-emerald-50 text-emerald-700' : ''}
                                ${status === 'error' ? 'bg-red-50 text-red-700' : ''}
                                ${status === 'uploading' ? 'bg-blue-50 text-blue-700' : ''}
                            `}>
                                <div className="mt-1">
                                    {status === 'success' && <CheckCircle2 size={24} />}
                                    {status === 'error' && <AlertCircle size={24} />}
                                    {status === 'uploading' && <Loader2 size={24} className="animate-spin" />}
                                </div>
                                <div>
                                    <p className="font-bold">{status === 'uploading' ? 'Hydrating Database...' : status.toUpperCase()}</p>
                                    <p className="text-sm font-medium opacity-90">{message}</p>
                                    {stats && (
                                        <div className="mt-2 text-xs font-black uppercase tracking-widest bg-white/50 inline-block px-3 py-1 rounded-full">
                                            {stats.count} RECORDS INGESTED
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};
