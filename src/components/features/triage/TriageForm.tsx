'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { AgeGroup } from '@/lib/risk/engine';
import { DiseasePattern } from '@/data/diseases';
import { ChevronRight, User, Activity, Edit3, AlertTriangle, CheckCircle, Info, Stethoscope, Search, Loader2, ShieldAlert, Zap, Mic, MicOff, X, HeartPulse, Clock, ClipboardList, MapPin } from 'lucide-react';

export const TriageForm = () => {
    const [step, setStep] = useState(1);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [patientData, setPatientData] = useState({
        name: '',
        dob: '',
        mobile: '',
        address: '',
        history: '',
        emergencyContact: ''
    });
    const [manualSymptoms, setManualSymptoms] = useState<string>('');
    const [result, setResult] = useState<any>(null);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const suggestionsRef = React.useRef<HTMLDivElement>(null);
    const [isListening, setIsListening] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isDetectingLocation, setIsDetectingLocation] = useState(false);
    const [mounted, setMounted] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleVoiceInput = () => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

        if (!SpeechRecognition) {
            alert("Speech recognition is not supported in this browser.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.continuous = true; // Still listening until stop
        recognition.interimResults = false;

        let fullTranscript = '';

        recognition.onstart = () => {
            setIsListening(true);
        };

        recognition.onresult = (event: any) => {
            let current = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    current += event.results[i][0].transcript + ' ';
                }
            }
            fullTranscript += current;
        };

        recognition.onerror = (event: any) => {
            console.error("Speech recognition error:", event.error);
            setIsListening(false);
            setIsProcessing(false);
        };

        recognition.onend = () => {
            setIsListening(false);
            if (fullTranscript.trim()) {
                setIsProcessing(true);

                // Smart Formatting for high accuracy feel
                const processAndFormat = (text: string) => {
                    let cleaned = text.trim()
                        .replace(/\s+/g, ' ') // Remove double spaces
                        .replace(/\bi\b/g, 'I'); // Capitalize "i"

                    if (!cleaned) return "";

                    // Capitalize first letter
                    cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);

                    // Ensure it ends with punctuation
                    if (!/[.!?]$/.test(cleaned)) {
                        cleaned += ".";
                    }

                    return cleaned;
                };

                // Artificial processing delay of 7 seconds as requested
                setTimeout(() => {
                    const formattedSymptoms = processAndFormat(fullTranscript);
                    setManualSymptoms(prev => prev ? `${prev}\n${formattedSymptoms}` : formattedSymptoms);
                    setIsProcessing(false);
                }, 7000);
            }
        };

        recognition.start();
    };

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
        patientData.address.trim() !== '' &&
        /^\d{10}$/.test(patientData.mobile) &&
        /^\d{10}$/.test(patientData.emergencyContact);

    const handleCalculate = async () => {
        setIsAnalyzing(true);
        try {
            console.log('Sending analysis request to localhost:5000...');
            const response = await fetch('http://localhost:5000/api/risk/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    symptoms: manualSymptoms,
                    ageGroup: ageGroup
                })
            });

            const contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
                const data = await response.json();
                if (!response.ok) throw new Error(data.error || 'Failed to analyze');
                console.log('API Result:', data);
                const finalResult = { ...data, patientInfo: patientData };
                setResult(finalResult);
                
                // Save emergency details for SOS page
                if (data.riskLevel === 'emergency') {
                    localStorage.setItem('patientData', JSON.stringify({
                        name: patientData.name,
                        dob: patientData.dob,
                        mobile: patientData.mobile,
                        address: patientData.address,
                        emergencyContact: patientData.emergencyContact,
                        medicalHistory: patientData.history,
                        riskLevel: data.riskLevel,
                        pathway: data.pathway || 'IMMEDIATE_EMERGENCY_CARE',
                        timestamp: new Date().toISOString()
                    }));
                }

                
                setShowSuggestions(false); // Reset for new result
                setStep(3);
            } else {
                const text = await response.text();
                console.error('Invalid response format:', text);
                throw new Error(`Server error: ${response.status} ${response.statusText}. The server returned non-JSON data.`);
            }
        } catch (error: any) {
            console.error('Analysis failed Detail:', error);
            if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
                alert('Connection Error: Failed to connect to the backend server at localhost:5000. \n\nPlease ensure your backend is running: \n1. Open a new terminal\n2. cd backend\n3. npm run dev');
            } else {
                alert(error.message || 'Failed to analyze symptoms. Please check backend logs.');
            }
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleDetectLocation = () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser.");
            return;
        }

        setIsDetectingLocation(true);
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    // Reverse Geocoding using Nominatim (OSM)
                    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                    if (!response.ok) throw new Error("Failed to fetch address");
                    
                    const data = await response.json();
                    const addressString = data.display_name || `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
                    
                    setPatientData(prev => ({ ...prev, address: addressString }));
                } catch (error) {
                    console.error("Geocoding failed:", error);
                    setPatientData(prev => ({ ...prev, address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}` }));
                } finally {
                    setIsDetectingLocation(false);
                }
            },
            (error) => {
                console.error("Geolocation error:", error);
                alert("Unable to retrieve your location. Please enter it manually.");
                setIsDetectingLocation(false);
            },
            { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        );
    };

    if (!mounted) return null;

    return (
        <div className="max-w-3xl mx-auto bg-white rounded-[4rem] shadow-2xl p-10 border border-slate-100 overflow-hidden relative">
            <AnimatePresence mode="wait">
                {step === 1 && (
                    <motion.div
                        key="step1"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-10"
                    >
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <h2 className="text-4xl font-black text-slate-900 flex items-center gap-3">
                                    <div className="p-3 bg-blue-50 rounded-2xl text-blue-600">
                                        <User size={28} />
                                    </div>
                                    Patient Details
                                </h2>
                                <p className="text-slate-400 font-medium text-sm">Customizing analysis based on clinical profile.</p>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 bg-blue-50/50 rounded-full border border-blue-100/50">
                                <span className={`w-2.5 h-2.5 rounded-full ${ageGroup === 'pediatric' ? 'bg-amber-400' : ageGroup === 'adult' ? 'bg-emerald-400' : 'bg-blue-400'}`} />
                                <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">{currentAge} Years • {ageGroup}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name *</label>
                                <input
                                    type="text"
                                    placeholder="e.g. John Doe"
                                    value={patientData.name}
                                    onChange={(e) => setPatientData({ ...patientData, name: e.target.value })}
                                    className="w-full p-4 bg-slate-50 rounded-[1.5rem] border-none focus:ring-4 focus:ring-blue-500/10 font-bold transition-all text-slate-900 placeholder:text-slate-400"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Date of Birth *</label>
                                <input
                                    type="date"
                                    value={patientData.dob}
                                    onChange={(e) => setPatientData({ ...patientData, dob: e.target.value })}
                                    className="w-full p-4 bg-slate-50 rounded-[1.5rem] border-none focus:ring-4 focus:ring-blue-500/10 font-bold transition-all text-sm text-slate-900"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mobile Number *</label>
                                <input
                                    type="tel"
                                    placeholder="Your number"
                                    maxLength={10}
                                    value={patientData.mobile}
                                    onChange={(e) => setPatientData({ ...patientData, mobile: e.target.value.replace(/\D/g, '') })}
                                    className="w-full p-4 bg-slate-50 rounded-[1.5rem] border-none focus:ring-4 focus:ring-blue-500/10 font-bold transition-all text-slate-900 placeholder:text-slate-400"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-rose-600 uppercase tracking-widest ml-1">Emergency Contact *</label>
                                <input
                                    type="tel"
                                    placeholder="Relative's number"
                                    maxLength={10}
                                    value={patientData.emergencyContact}
                                    onChange={(e) => setPatientData({ ...patientData, emergencyContact: e.target.value.replace(/\D/g, '') })}
                                    className="w-full p-4 bg-rose-50/30 rounded-[1.5rem] border-none focus:ring-4 focus:ring-rose-500/10 font-bold transition-all text-slate-900 placeholder:text-slate-400 text-rose-900"
                                />
                            </div>

                            <div className="space-y-2 col-span-1">
                                <div className="flex items-center justify-between ml-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Current Address *</label>
                                    <button 
                                        onClick={handleDetectLocation}
                                        disabled={isDetectingLocation}
                                        className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-1 hover:text-blue-700 transition-colors disabled:opacity-50"
                                    >
                                        {isDetectingLocation ? (
                                            <>
                                                <Loader2 size={10} className="animate-spin" /> Detecting...
                                            </>
                                        ) : (
                                            <>
                                                <MapPin size={10} /> Detect Location
                                            </>
                                        )}
                                    </button>
                                </div>
                                <textarea
                                    placeholder="House No, Street, Landmark, City"
                                    value={patientData.address}
                                    onChange={(e) => setPatientData({ ...patientData, address: e.target.value })}
                                    className="w-full p-4 bg-slate-50 rounded-[1.5rem] border-none focus:ring-4 focus:ring-blue-500/10 font-bold transition-all resize-none h-24 text-slate-900 placeholder:text-slate-400 text-sm"
                                />
                            </div>

                            <div className="space-y-2 col-span-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Medical History (Optional)</label>
                                <textarea
                                    placeholder="Diabetes, Hypertension, Allergies, etc."
                                    value={patientData.history}
                                    onChange={(e) => setPatientData({ ...patientData, history: e.target.value })}
                                    className="w-full p-4 bg-slate-50 rounded-[1.5rem] border-none focus:ring-4 focus:ring-blue-500/10 font-bold transition-all resize-none h-24 text-slate-900 placeholder:text-slate-400 text-sm"
                                />
                            </div>
                        </div>

                        <div className="pt-2">
                            <motion.button
                                whileHover={isStep1Valid ? { scale: 1.02 } : {}}
                                whileTap={isStep1Valid ? { scale: 0.98 } : {}}
                                disabled={!isStep1Valid}
                                onClick={() => {
                                    // Eagerly save details for SOS page availability
                                    localStorage.setItem('patientData', JSON.stringify({
                                        name: patientData.name,
                                        dob: patientData.dob,
                                        mobile: patientData.mobile,
                                        emergencyContact: patientData.emergencyContact,
                                        address: patientData.address,
                                        medicalHistory: patientData.history,
                                        timestamp: new Date().toISOString()
                                    }));
                                    setStep(2);
                                }}
                                className="w-full bg-slate-900 text-white py-6 rounded-[2rem] font-black flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 disabled:opacity-30 disabled:shadow-none pointer-events-auto cursor-pointer"
                            >
                                CONTINUE <ChevronRight size={20} />
                            </motion.button>
                        </div>
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
                            <div className="flex items-center justify-between">
                                <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3">
                                    <div className="p-3 bg-rose-50 rounded-2xl text-rose-600">
                                        <Activity size={24} />
                                    </div>
                                    Symptoms
                                </h2>
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={handleVoiceInput}
                                    disabled={isListening || isProcessing}
                                    className={`p-4 rounded-2xl transition-all shadow-lg ${isListening ? 'bg-red-500 text-white animate-pulse' : isProcessing ? 'bg-amber-500 text-white animate-spin' : 'bg-slate-100 text-slate-600 hover:bg-rose-600 hover:text-white'}`}
                                    title="Speak Symptoms"
                                >
                                    {isProcessing ? <Loader2 size={24} /> : <Mic size={24} className={isListening ? 'animate-bounce' : ''} />}
                                </motion.button>
                            </div>
                            <div className="flex items-center justify-between mt-1">
                                <p className="text-slate-400 font-medium italic">&quot;Tell us exactly how you feel...&quot;</p>
                                {isListening && (
                                    <span className="text-[10px] font-black text-red-600 bg-red-50 px-3 py-1 rounded-full uppercase tracking-tighter animate-pulse">
                                        Listening... Stop speaking to process.
                                    </span>
                                )}
                                {isProcessing && (
                                    <span className="text-[10px] font-black text-amber-600 bg-amber-50 px-3 py-1 rounded-full uppercase tracking-tighter animate-bounce">
                                        Processing voice pattern...
                                    </span>
                                )}
                            </div>
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
                                disabled={manualSymptoms.trim().length < 5 || isAnalyzing}
                                className="w-full bg-blue-600 text-white py-6 rounded-[2rem] font-black shadow-2xl shadow-blue-200 disabled:opacity-50 disabled:shadow-none transition-all uppercase tracking-widest flex items-center justify-center gap-2"
                            >
                                {isAnalyzing ? (
                                    <>
                                        <Loader2 className="animate-spin" size={20} />
                                        Analyzing Patterns...
                                    </>
                                ) : (
                                    'Run Smart Analysis'
                                )}
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
                            className={`inline-block p-8 rounded-full shadow-2xl ${result.riskLevel === 'emergency' ? 'bg-red-600 text-white shadow-red-200' :
                                result.riskLevel === 'high' ? 'bg-red-500 text-white shadow-red-100' :
                                    result.riskLevel === 'moderate' ? 'bg-orange-500 text-white shadow-orange-100' :
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


                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="bg-slate-50 p-8 rounded-[3rem] border border-slate-100 space-y-4"
                        >
                            <p className="text-[10px] uppercase text-slate-400 font-black tracking-[0.3em]">Recommendation</p>
                            <div className="flex flex-col items-center gap-4">
                                <p className="text-xl font-black text-slate-800 leading-tight">
                                    {result.riskLevel === 'emergency' ? 'IMMEDIATE EMERGENCY RESPONSE' : 'Action Required'}
                                </p>
                                {result.riskLevel !== 'emergency' && (
                                    <button
                                        onClick={() => setShowSuggestions(true)}
                                        className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all uppercase tracking-widest text-sm flex items-center justify-center gap-2 group"
                                    >
                                        Click for Detailed Suggestions
                                        <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                    </button>
                                )}
                            </div>
                            {result.riskLevel === 'emergency' && (
                                <div className="p-4 bg-red-50 rounded-2xl border border-red-100 mt-4 space-y-3">
                                    {patientData.address && (
                                        <p className="text-red-700 text-[11px] font-black leading-relaxed uppercase tracking-tight">
                                            📍 Emergency dispatch set for: {patientData.address}
                                        </p>
                                    )}
                                    {patientData.history && (
                                        <p className="text-red-700 text-xs font-bold leading-relaxed italic">
                                            Medical history logged: &quot;{patientData.history}&quot;. This data is being shared with the emergency response team for precise medication.
                                        </p>
                                    )}
                                </div>
                            )}
                            {/* MODAL FOR SUGGESTIONS */}
                            <AnimatePresence>
                                {showSuggestions && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md"
                                        onClick={() => setShowSuggestions(false)}
                                    >
                                        <motion.div
                                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                                            animate={{ scale: 1, opacity: 1, y: 0 }}
                                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                                            onClick={(e) => e.stopPropagation()}
                                            className="bg-white w-full max-w-xl max-h-[85vh] rounded-[3rem] shadow-3xl overflow-hidden flex flex-col border border-slate-100"
                                        >
                                            <div className="p-8 bg-emerald-600 text-white flex items-center justify-between shrink-0 relative overflow-hidden">
                                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-12 translate-x-12 blur-2xl" />
                                                <div className="flex items-center gap-4 relative z-10">
                                                    <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                                                        <HeartPulse size={28} />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-2xl font-black tracking-tight leading-tight">Care Instructions</h3>
                                                        <p className="text-emerald-100 text-xs font-bold uppercase tracking-widest opacity-80">Tailored for your symptoms</p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => setShowSuggestions(false)}
                                                    className="p-3 bg-white/20 hover:bg-white/30 rounded-2xl transition-all relative z-10"
                                                >
                                                    <X size={24} />
                                                </button>
                                            </div>

                                            <div className="flex-1 overflow-y-auto p-8 space-y-8 scroll-smooth custom-scrollbar">
                                                {result?.suggestions && result.suggestions.length > 0 ? (
                                                    result.suggestions.map((item: any, i: number) => (
                                                        <motion.div
                                                            key={i}
                                                            initial={{ opacity: 0, x: -10 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            transition={{ delay: i * 0.1 }}
                                                            className="space-y-4"
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-2 h-8 bg-emerald-500 rounded-full" />
                                                                <div>
                                                                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest leading-none mb-1">Precaution for</p>
                                                                    <h4 className="text-xl font-black text-slate-800 uppercase tracking-tight">
                                                                        {item.symptom}
                                                                    </h4>
                                                                </div>
                                                            </div>
                                                            <div className="grid gap-3">
                                                                {item.advice?.map((text: string, idx: number) => (
                                                                    <motion.div
                                                                        key={idx}
                                                                        initial={{ opacity: 0, y: 5 }}
                                                                        animate={{ opacity: 1, y: 0 }}
                                                                        transition={{ delay: (i * 0.1) + (idx * 0.05) }}
                                                                        className="flex gap-4 items-start p-5 bg-slate-50 rounded-[2rem] border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/30 transition-all group"
                                                                    >
                                                                        <div className="mt-1 w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-sm group-hover:border-emerald-300">
                                                                            <span className="text-[10px] font-black text-slate-400 group-hover:text-emerald-600">{idx + 1}</span>
                                                                        </div>
                                                                        <p className="text-sm font-bold text-slate-600 leading-relaxed group-hover:text-slate-900 transition-colors">
                                                                            {text}
                                                                        </p>
                                                                    </motion.div>
                                                                ))}
                                                            </div>
                                                        </motion.div>
                                                    ))
                                                ) : (
                                                    <div className="text-center py-20 space-y-4">
                                                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
                                                            <ClipboardList size={40} />
                                                        </div>
                                                        <p className="text-slate-400 font-bold italic">No specific precautions matched. Please stay hydrated and rest.</p>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="p-8 border-t border-slate-100 bg-slate-50 shrink-0 space-y-4">
                                                <div className="flex items-center gap-3 px-2">
                                                    <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
                                                        <AlertTriangle size={16} />
                                                    </div>
                                                    <p className="text-[11px] font-bold text-slate-500 leading-tight">
                                                        If symptoms persist or worsen, we recommend consulting a specialist for a professional diagnosis.
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() => {
                                                        setShowSuggestions(false);
                                                        router.push('/appointments');
                                                    }}
                                                    className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-3 group"
                                                >
                                                    <Stethoscope size={18} className="group-hover:rotate-12 transition-transform" />
                                                    Book Hospital Appointment
                                                </button>
                                                <button
                                                    onClick={() => setShowSuggestions(false)}
                                                    className="w-full text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] hover:text-slate-600 transition-colors"
                                                >
                                                    Dismiss
                                                </button>
                                            </div>
                                        </motion.div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>

                        <div className="space-y-6 pt-4">
                            {result.riskLevel === 'emergency' && (
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => router.push('/sos')}
                                    className="w-full bg-red-600 text-white py-8 rounded-[3rem] font-black shadow-2xl shadow-red-300 hover:bg-red-700 transition-all flex flex-col items-center justify-center gap-2 group relative overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none" />
                                    <div className="flex items-center gap-3 text-2xl">
                                        ACTIVATE EMERGENCY SOS
                                        <ShieldAlert size={32} className="animate-bounce" />
                                    </div>
                                    <div className="flex items-center gap-1 text-[10px] opacity-80 uppercase tracking-widest font-bold">
                                        <Zap size={10} className="fill-current" />
                                        Redirect to Immediate Response Team
                                    </div>
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
