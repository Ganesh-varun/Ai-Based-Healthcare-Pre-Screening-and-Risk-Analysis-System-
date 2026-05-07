'use client';

import React from 'react';
import { TriageForm } from '@/components/features/triage/TriageForm';
import { ChevronLeft, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function TriagePage() {
    return (
        <div className="min-h-screen bg-slate-50">
            <div className="max-w-4xl mx-auto py-8 px-6 space-y-8 pb-24">
                <Link href="/" className="inline-flex items-center gap-2 text-slate-500 font-bold hover:text-slate-800 transition-colors">
                    <ChevronLeft size={20} /> BACK TO HOME
                </Link>

                <div className="relative">
                    <div className="absolute -top-4 -right-2 text-blue-500/20"><Sparkles size={64} /></div>
                    <h1 className="text-4xl font-black text-slate-900 leading-none">SMART <span className="text-blue-600 underline">TRIAGE</span></h1>
                    <p className="text-slate-500 font-medium mt-2">AI-assisted clinical risk scoring engine.</p>
                </div>

                <TriageForm />

                <div className="p-8 bg-blue-600 rounded-[2.5rem] text-white shadow-xl shadow-blue-200">
                    <h3 className="text-xl font-bold mb-2">Rule-Based Analysis</h3>
                    <p className="text-blue-100 text-sm leading-relaxed">
                        Our analysis uses weighted scoring based on age and symptom severity.
                        Pediatric and Geriatric cases receive higher risk multipliers to ensure safety.
                    </p>
                </div>
            </div>
        </div>
    );
}
