'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { calculateRisk, AgeGroup, RiskLevel, analyzeSymptoms } from '@/lib/risk/engine';
import { DiseasePattern } from '@/data/diseases';
import { ChevronRight, User, Activity, Edit3, AlertTriangle, CheckCircle, Info, Stethoscope } from 'lucide-react';

export const TriageForm = () => {
    const [step, setStep] = useState(1);
    const [patientData, setPatientData] = useState({
        name: '',
        dob: '',
        mobile: '',
        history: ''
    });
    const [manualSymptoms, setManualSymptoms] = useState<string>('');
    const [result, setResult] = useState<any>(null);
    const router = useRouter();

    const calculateAge = (dob: string): number => {
        if (!dob) return 25; // Default if not entered yet
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const currentAge = calculateAge(patientData.dob);
    const ageGroup: AgeGroup = currentAge < 14 ? 'pediatric' : currentAge <= 50 ? 'adult' : 'geriatric';

    const isStep1Valid = patientData.name.trim() !== '' &&
        patientData.dob !== '' &&
        /^\d{10}$/.test(patientData.mobile);

    const handleCalculate = () => {
        const symptomsToScore = analyzeSymptoms(manualSymptoms);
        const analysis = calculateRisk(symptomsToScore, ageGroup);
        // Add patient background to result if needed or just store it
        setResult({ ...analysis, patientInfo: patientData });
        setStep(3);
    };

    return (
        <div className="max-w-md mx-auto bg-white rounded-[3rem] shadow-2xl p-8 border border-slate-100 overflow-hidden relative">
            <AnimatePresence mode="wait">
                {step === 1 && (
                    <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-8"
                    >
                        <div className="space-y-2">
                            <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3">
                                <div className="p-3 bg-blue-50 rounded-2xl text-blue-600">
                                    <User size={24} />
                                </div>
                                Patient Details
                            </h2>
                            <p className="text-slate-400 font-medium">We customize analysis based on age group.</p>
                        </div>

                        <div className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name *</label>
                                <input
                                    type="text"
                                    placeholder="e.g. John Doe"
                                    value={patientData.name}
                                    onChange={(e) => setPatientData({ ...patientData, name: e.target.value })}
                                    className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-4 focus:ring-blue-500/10 font-bold transition-all text-slate-900 placeholder:text-slate-400"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Date of Birth *</label>
                                    <input
                                        type="date"
                                        value={patientData.dob}
                                        onChange={(e) => setPatientData({ ...patientData, dob: e.target.value })}
                                        className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-4 focus:ring-blue-500/10 font-bold transition-all text-sm text-slate-900"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mobile Number *</label>
                                    <input
                                        type="tel"
                                        placeholder="10-digit number"
                                        maxLength={10}
                                        value={patientData.mobile}
                                        onChange={(e) => setPatientData({ ...patientData, mobile: e.target.value.replace(/\D/g, '') })}
                                        className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-4 focus:ring-blue-500/10 font-bold transition-all text-slate-900 placeholder:text-slate-400"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Medical History (Optional)</label>
                                <textarea
                                    placeholder="Diabetes, Hypertension, Allergies, etc."
                                    value={patientData.history}
                                    onChange={(e) => setPatientData({ ...patientData, history: e.target.value })}
                                    className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-4 focus:ring-blue-500/10 font-bold transition-all resize-none h-24 text-slate-900 placeholder:text-slate-400"
                                />
                            </div>

                            <div className="flex items-center gap-2 px-4 py-2 bg-blue-50/50 rounded-full w-fit">
                                <span className={`w-2 h-2 rounded-full ${ageGroup === 'pediatric' ? 'bg-amber-400' : ageGroup === 'adult' ? 'bg-emerald-400' : 'bg-blue-400'}`} />
                                <p className="text-xs font-black text-slate-600 uppercase tracking-widest">{currentAge} Years • {ageGroup} CATEGORY</p>
                            </div>
                        </div>

                        <motion.button
                            whileHover={isStep1Valid ? { scale: 1.02 } : {}}
                            whileTap={isStep1Valid ? { scale: 0.98 } : {}}
                            disabled={!isStep1Valid}
                            onClick={() => setStep(2)}
                            className="w-full bg-slate-900 text-white py-6 rounded-[2rem] font-black flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 disabled:opacity-30 disabled:shadow-none pointer-events-auto cursor-pointer"
                        >
                            CONTINUE <ChevronRight size={20} />
                        </motion.button>
                    </motion.div>
                )}

                {step === 2 && (
                    <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-8"
                    >
                        <div className="space-y-2">
                            <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3">
                                <div className="p-3 bg-rose-50 rounded-2xl text-rose-600">
                                    <Activity size={24} />
                                </div>
                                Symptoms
                            </h2>
                            <p className="text-slate-400 font-medium italic">"Tell us exactly how you feel..."</p>
                        </div>

                        <div className="space-y-4">
                            <textarea
                                value={manualSymptoms}
                                onChange={(e) => setManualSymptoms(e.target.value)}
                                placeholder="Describe symptoms like chest pain, fever, cold..."
                                className="w-full h-48 p-6 bg-slate-50 rounded-[2.5rem] border-2 border-slate-100 focus:border-blue-500 focus:ring-0 transition-all text-slate-900 font-bold placeholder:text-slate-400 resize-none text-lg"
                            />
                            <div className="flex items-center gap-2 text-blue-500/60 font-bold text-[10px] uppercase tracking-widest px-2">
                                <Info size={12} /> Minimum 5 characters required
                            </div>
                        </div>

                        <div className="space-y-4">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleCalculate}
                                disabled={manualSymptoms.trim().length < 5}
                                className="w-full bg-blue-600 text-white py-6 rounded-[2rem] font-black shadow-2xl shadow-blue-200 disabled:opacity-50 disabled:shadow-none transition-all uppercase tracking-widest"
                            >
                                Run Smart Analysis
                            </motion.button>
                            <button
                                onClick={() => setStep(1)}
                                className="w-full py-2 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-slate-900 transition-colors"
                            >
                                Back to Profile
                            </button>
                        </div>
                    </motion.div>
                )}

                {step === 3 && result && (
                    <motion.div
                        key="result"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center space-y-8"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", damping: 10, stiffness: 100 }}
                            className={`inline-block p-8 rounded-full shadow-2xl ${result.riskLevel === 'emergency' ? 'bg-red-500 text-white shadow-red-200' :
                                result.riskLevel === 'high' ? 'bg-orange-500 text-white shadow-orange-200' :
                                    'bg-emerald-500 text-white shadow-emerald-200'
                                }`}
                        >
                            <AlertCircle size={64} />
                        </motion.div>

                        <div className="space-y-2">
                            <motion.h3
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-4xl font-black uppercase tracking-tighter text-slate-900"
                            >
                                {result.riskLevel} Risk
                            </motion.h3>
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="text-slate-400 font-black tracking-widest uppercase text-xs"
                            >
                                {result.pathway}
                            </motion.p>
                        </div>

                        {result.suspectedConditions && result.suspectedConditions.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.35 }}
                                className="bg-white p-6 rounded-[2.5rem] border border-blue-100 shadow-xl shadow-blue-50 space-y-3"
                            >
                                <div className="flex items-center justify-center gap-2 text-blue-600 font-black text-[10px] uppercase tracking-widest">
                                    <Stethoscope size={14} /> Identified Clinical Pattern
                                </div>
                                {result.suspectedConditions.map((condition: DiseasePattern) => (
                                    <div key={condition.id} className="space-y-1">
                                        <p className="text-xl font-black text-slate-800">{condition.name}</p>
                                        <p className="text-[10px] text-slate-400 font-medium leading-relaxed px-4">
                                            {condition.description}
                                        </p>
                                    </div>
                                ))}
                                <p className="text-[9px] font-bold text-amber-600 uppercase tracking-tight pt-2">
                                    ⚠ Disclaimer: This is an AI-assisted risk factor analysis, not a diagnosis.
                                </p>
                            </motion.div>
                        )}

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="bg-slate-50 p-8 rounded-[3rem] border border-slate-100 space-y-4"
                        >
                            <p className="text-[10px] uppercase text-slate-400 font-black tracking-[0.3em]">Recommendation</p>
                            <p className="text-xl font-black text-slate-800 leading-tight">
                                {result.riskLevel === 'emergency' ? 'IMMEDIATE EMERGENCY RESPONSE' : 'CONSULT NEARBY SPECIALIST'}
                            </p>
                            {result.riskLevel === 'emergency' && result.patientInfo.history && (
                                <div className="p-4 bg-red-50 rounded-2xl border border-red-100 mt-4">
                                    <p className="text-red-700 text-xs font-bold leading-relaxed">
                                        Medical history logged: "{result.patientInfo.history}". This data is being shared with the emergency response team for precise medication.
                                    </p>
                                </div>
                            )}
                        </motion.div>

                        <div className="space-y-6 pt-4">
                            {result.riskLevel !== 'emergency' && (
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => router.push('/appointments')}
                                    className="w-full bg-slate-900 text-white py-6 rounded-[2.5rem] font-black shadow-2xl shadow-slate-300 hover:bg-slate-800 transition-all flex items-center justify-center gap-3 group"
                                >
                                    BOOK CLINIC NOW
                                    <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </motion.button>
                            )}
                            <button
                                onClick={() => setStep(1)}
                                className="text-slate-400 font-bold hover:text-slate-900 transition-colors uppercase tracking-widest text-[10px]"
                            >
                                Start New Analysis
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const AlertCircle = ({ size, className }: { size: number, className?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className || ''}>
        <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
);
