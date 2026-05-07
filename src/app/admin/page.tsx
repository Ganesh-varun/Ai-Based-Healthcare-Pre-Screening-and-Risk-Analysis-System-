'use client';

import React from 'react';
import { DatasetUpload } from '@/components/features/upload/DatasetUpload';
import { DatasetList } from '@/components/features/upload/DatasetList';
import { ChevronLeft, Database, LayoutDashboard, Settings } from 'lucide-react';
import Link from 'next/link';

export default function AdminPage() {
    return (
        <div className="min-h-screen bg-[#f8fafc]">
            {/* Toolbar */}
            <nav className="fixed top-0 left-0 w-full h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 z-50 flex items-center justify-between px-8">
                <div className="flex items-center gap-6">
                    <Link href="/" className="p-3 hover:bg-slate-50 rounded-2xl transition-colors">
                        <ChevronLeft size={24} className="text-slate-400" />
                    </Link>
                    <div className="h-8 w-[1px] bg-slate-100" />
                    <h1 className="text-xl font-black text-slate-800 tracking-tighter">System <span className="text-blue-600">Admin</span></h1>
                </div>

                <div className="flex items-center gap-2">
                    <button className="p-3 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all">
                        <LayoutDashboard size={22} />
                    </button>
                    <button className="p-3 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all">
                        <Database size={22} />
                    </button>
                    <button className="p-3 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all">
                        <Settings size={22} />
                    </button>
                </div>
            </nav>

            <main className="pt-32 pb-20 px-6 container mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Left Sidebar Info */}
                    <div className="lg:col-span-1 space-y-8">
                        <div className="bg-blue-600 p-8 rounded-[40px] text-white shadow-2xl shadow-blue-200">
                            <Database size={48} className="mb-6 opacity-80" />
                            <h2 className="text-3xl font-black leading-tight mb-4">Core Dataset Infrastructure</h2>
                            <p className="font-medium opacity-80 leading-relaxed">
                                Upload and synchronize your healthcare records with the global engine.
                                Our system uses stream-processing to ensure responsive ingestion.
                            </p>
                        </div>

                        <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-xl">
                            <h3 className="text-lg font-black text-slate-800 mb-4">Ingestion Policy</h3>
                            <ul className="space-y-4 text-sm font-bold text-slate-500">
                                <li className="flex gap-3">
                                    <span className="text-blue-500">•</span>
                                    Only RFC-4180 compliant CSV files.
                                </li>
                                <li className="flex gap-3">
                                    <span className="text-blue-500">•</span>
                                    Data is encrypted rest.
                                </li>
                                <li className="flex gap-3">
                                    <span className="text-blue-500">•</span>
                                    Real-time sanity check performed.
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="lg:col-span-2 space-y-12">
                        <DatasetList />
                        <div className="h-[1px] bg-slate-100 w-full" />
                        <DatasetUpload />
                    </div>
                </div>
            </main>
        </div>
    );
}
