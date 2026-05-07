'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronLeft,
    Star,
    MapPin,
    Clock,
    Phone,
    Calendar,
    User,
    Mail,
    CheckCircle2,
    ShieldCheck,
    Stethoscope,
    Building2,
    Activity,
    ArrowRight,
    Clock as ClockIcon,
    XCircle,
    AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { getHospitalById, generateSpecialists } from '@/lib/healthcare-factory';
import { Hospital, Doctor } from '@/data/hospitals-data';

const API_BASE = 'http://127.0.0.1:5000/api';

type AppointmentStatus = 'PENDING' | 'CONFIRMED' | 'DECLINED';

export default function HospitalAppointmentPage() {
    const params = useParams();
    const router = useRouter();
    const [hospital, setHospital] = useState<Hospital | undefined>(undefined);
    const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
    const [bookingDate, setBookingDate] = useState('');
    const [bookingTime, setBookingTime] = useState('');
    const [patientDetails, setPatientDetails] = useState({
        name: '',
        phone: '',
        email: '',
        reason: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [bookingStatus, setBookingStatus] = useState<AppointmentStatus>('PENDING');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line
        setMounted(true);
        if (params.id) {
            // Check static data first
            const staticH = getHospitalById(params.id as string);
            if (staticH) {
                setHospital(staticH);
                if (staticH.specialists?.length) {
                    setSelectedDoctor(staticH.specialists[0]);
                }
            } else {
                // Fetch from API
                const fetchHospital = async () => {
                    try {
                        const res = await fetch(`${API_BASE}/hospitals/${params.id}`);
                        const h = await res.json();
                        if (h && !h.error) {
                            const mapped: Hospital = {
                                id: h._id,
                                name: h.name,
                                specialty: h.specialties && h.specialties !== '0' ? h.specialties : (h.category === '0' ? 'General Care' : h.category),
                                address: h.address || h.location || 'N/A',
                                city: h.district,
                                state: h.state,
                                rating: 4.8,
                                availability: 'Available Today',
                                distance: 'N/A',
                                isEmergency: h.emergencyNum !== '0' && h.emergencyNum !== '',
                                phone: h.mobile || h.telephone || 'N/A',
                                specialists: generateSpecialists(h._id, h.district, h.specialties && h.specialties !== '0' ? h.specialties : 'General Care')
                            };
                            setHospital(mapped);
                            setSelectedDoctor(mapped.specialists![0]);
                        }
                    } catch (error) {
                        console.error('Failed to fetch hospital:', error);
                    }
                };
                fetchHospital();
            }
        }
    }, [params.id]);

    if (!mounted) return null;

    if (!hospital) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-20 h-20 bg-slate-900 rounded-[2rem] flex items-center justify-center text-slate-700 mb-6 border border-white/5">
                    <Building2 size={32} />
                </div>
                <h1 className="text-white font-black text-2xl uppercase tracking-tighter">Facility Not Found</h1>
                <p className="text-slate-500 text-sm mt-2 max-w-xs font-medium uppercase tracking-widest text-[10px]">The requested tactical medical resource could not be localized in the current grid.</p>
                <Link href="/appointments" className="mt-8 px-8 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-blue-500/20">
                    Return to Directory
                </Link>
            </div>
        );
    }

    const handleBooking = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedDoctor || !bookingDate || !bookingTime) return;

        setIsSubmitting(true);
        // Simulate tactical dispatch and status determination
        setTimeout(() => {
            setIsSubmitting(false);
            setIsConfirmed(true);

            // Set to CONFIRMED for successful user experience
            // In a real app, this would come from the backend validation
            setBookingStatus('CONFIRMED');
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-20">
            {/* Tactical Header */}
            <div className="relative h-64 bg-slate-950 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent z-10" />
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:20px_20px]" />
                </div>

                <div className="relative z-20 max-w-md mx-auto px-6 pt-12">
                    <Link href="/appointments" className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center text-white border border-white/10 hover:bg-white/20 transition-all">
                        <ChevronLeft size={20} />
                    </Link>

                    <div className="mt-8">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <span className="px-3 py-1 bg-blue-600 text-white text-[10px] font-black rounded-lg uppercase tracking-widest">
                                {hospital.specialty}
                            </span>
                            <h1 className="text-3xl font-black text-white mt-3 leading-tight tracking-tighter uppercase">
                                {hospital.name}
                            </h1>
                            <div className="flex items-center gap-4 mt-4 text-slate-400">
                                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider">
                                    <MapPin size={14} className="text-blue-500" />
                                    {hospital.city}
                                </div>
                                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider">
                                    <Star size={14} className="text-amber-500 fill-amber-500" />
                                    {hospital.rating} RATING
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            <div className="max-w-md mx-auto px-6 -mt-8 relative z-30 space-y-8">
                {/* Specialists Dispatch */}
                <div className="space-y-4">
                    <h2 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-2">
                        <Stethoscope size={16} className="text-blue-600" />
                        Select Specialist
                    </h2>
                    <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                        {hospital.specialists?.map((doc) => (
                            <motion.div
                                key={doc.id}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setSelectedDoctor(doc)}
                                className={`flex-shrink-0 w-64 p-5 rounded-[2.5rem] border transition-all cursor-pointer ${selectedDoctor?.id === doc.id
                                    ? 'bg-slate-900 border-slate-900 text-white shadow-2xl'
                                    : 'bg-white border-slate-100 text-slate-800 hover:border-blue-200'
                                    }`}
                            >
                                <div className="flex items-center gap-4 mb-4">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg ${selectedDoctor?.id === doc.id ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-600'}`}>
                                        {doc?.name?.split(' ').pop()?.[0] || 'D'}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-sm leading-tight">{doc.name}</h3>
                                        <p className={`text-[10px] font-black uppercase tracking-widest ${selectedDoctor?.id === doc.id ? 'text-blue-400' : 'text-blue-600'}`}>{doc.specialty}</p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-4">
                                    <div className="flex flex-col">
                                        <span className="text-[8px] font-black uppercase opacity-50">Experience</span>
                                        <span className="text-[10px] font-bold">{doc.experience}</span>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="text-[8px] font-black uppercase opacity-50">Rating</span>
                                        <div className="flex items-center gap-1">
                                            <Star size={8} fill="currentColor" className="text-amber-500" />
                                            <span className="text-[10px] font-bold">{doc.rating}</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Consolidated Booking Details */}
                <form onSubmit={handleBooking} className="space-y-8">
                    <div className="space-y-6">
                        <h2 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-2">
                            <Activity size={16} className="text-blue-600" />
                            Patient Details & Appointment Schedule
                        </h2>

                        <div className="space-y-4">
                            {/* Patient Info */}
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-all" size={18} />
                                <input
                                    type="text"
                                    required
                                    placeholder="Full Patient Name"
                                    className="w-full pl-12 pr-4 py-4 bg-white border border-slate-100 rounded-2xl font-bold text-sm text-slate-900 outline-none focus:border-blue-500 transition-all"
                                    value={patientDetails.name}
                                    onChange={(e) => setPatientDetails({ ...patientDetails, name: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="relative group">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        type="tel"
                                        required
                                        placeholder="Contact Number"
                                        className="w-full pl-12 pr-4 py-4 bg-white border border-slate-100 rounded-2xl font-bold text-sm text-slate-900 outline-none focus:border-blue-500 transition-all"
                                        value={patientDetails.phone}
                                        onChange={(e) => setPatientDetails({ ...patientDetails, phone: e.target.value })}
                                    />
                                </div>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        type="email"
                                        required
                                        placeholder="Email Address"
                                        className="w-full pl-12 pr-4 py-4 bg-white border border-slate-100 rounded-2xl font-bold text-sm text-slate-900 outline-none focus:border-blue-500 transition-all"
                                        value={patientDetails.email}
                                        onChange={(e) => setPatientDetails({ ...patientDetails, email: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Schedule Info */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="relative">
                                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        type="date"
                                        required
                                        className="w-full pl-12 pr-4 py-4 bg-white border border-slate-100 rounded-2xl font-bold text-sm text-slate-900 outline-none focus:border-blue-500 transition-all"
                                        value={bookingDate}
                                        onChange={(e) => setBookingDate(e.target.value)}
                                    />
                                </div>
                                <div className="relative">
                                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <select
                                        required
                                        className="w-full pl-12 pr-4 py-4 bg-white border border-slate-100 rounded-2xl font-bold text-sm text-slate-900 outline-none focus:border-blue-500 transition-all appearance-none"
                                        value={bookingTime}
                                        onChange={(e) => setBookingTime(e.target.value)}
                                    >
                                        <option value="">Select Time</option>
                                        <option value="09:00">09:00 AM</option>
                                        <option value="10:30">10:30 AM</option>
                                        <option value="12:00">12:00 PM</option>
                                        <option value="15:30">03:30 PM</option>
                                        <option value="17:00">05:00 PM</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Dispatch Control */}
                    <div className="pt-6">
                        <button
                            type="submit"
                            disabled={isSubmitting || !selectedDoctor}
                            className={`w-full py-6 rounded-[2rem] font-black text-white uppercase tracking-[0.2em] text-sm shadow-2xl transition-all flex items-center justify-center gap-3 relative overflow-hidden ${!selectedDoctor
                                ? 'bg-slate-300 cursor-not-allowed shadow-none'
                                : 'bg-slate-900 shadow-slate-300 hover:bg-slate-800'
                                }`}
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Encrypting Dispatch...
                                </>
                            ) : (
                                <>
                                    Confirm Tactical Appointment
                                    <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                        {!selectedDoctor && (
                            <p className="text-center text-[10px] text-slate-400 font-black uppercase tracking-widest mt-4">
                                Please select a specialist to enable dispatch
                            </p>
                        )}
                    </div>
                </form>
            </div>

            {/* Confirmation Overlay */}
            <AnimatePresence>
                {isConfirmed && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-slate-950 flex flex-col items-center justify-center p-8 text-center"
                    >
                        <motion.div
                            initial={{ scale: 0.5, rotate: -20 }}
                            animate={{ scale: 1, rotate: 0 }}
                            className={`w-32 h-32 rounded-[3rem] flex items-center justify-center text-white shadow-2xl mb-10 ${bookingStatus === 'CONFIRMED' ? 'bg-emerald-500 shadow-emerald-500/40' :
                                bookingStatus === 'PENDING' ? 'bg-amber-500 shadow-amber-500/40' :
                                    'bg-rose-500 shadow-rose-500/40'
                                }`}
                        >
                            {bookingStatus === 'CONFIRMED' && <ShieldCheck size={64} />}
                            {bookingStatus === 'PENDING' && <ClockIcon size={64} />}
                            {bookingStatus === 'DECLINED' && <XCircle size={64} />}
                        </motion.div>

                        <div className="space-y-4 max-w-sm">
                            <h2 className="text-4xl font-black text-white leading-none tracking-tighter uppercase italic">
                                {bookingStatus === 'CONFIRMED' && <>MISSION <br /> CONFIRMED</>}
                                {bookingStatus === 'PENDING' && <>DISPATCH <br /> PENDING</>}
                                {bookingStatus === 'DECLINED' && <>REQUEST <br /> DECLINED</>}
                            </h2>
                            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs leading-relaxed">
                                {bookingStatus === 'CONFIRMED' && (
                                    <>Appointment encrypted & dispatched to <span className="text-white">{hospital.name}</span>. Staff is briefed for your arrival.</>
                                )}
                                {bookingStatus === 'PENDING' && (
                                    <>Your request is in the tactical queue for <span className="text-white">{hospital.name}</span>. Awaiting final authorization from the facility.</>
                                )}
                                {bookingStatus === 'DECLINED' && (
                                    <>Tactical request was not authorized by <span className="text-white">{hospital.name}</span> at this time. Please select an alternative window or facility.</>
                                )}
                            </p>
                        </div>

                        <div className="mt-12 bg-white/5 border border-white/5 p-8 rounded-[3rem] w-full max-w-sm space-y-4">
                            <div className="flex justify-between items-center text-left">
                                <div>
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Specialist</p>
                                    <p className="text-white font-bold">{selectedDoctor?.name}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Time Delta</p>
                                    <p className="text-white font-bold">{bookingDate} @ {bookingTime}</p>
                                </div>
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => router.push('/appointments')}
                            className="mt-12 px-12 py-5 bg-white text-slate-950 rounded-[2rem] font-black uppercase text-xs tracking-[0.2em] shadow-2xl"
                        >
                            Close Intel
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>

            <style jsx global>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </div>
    );
}
