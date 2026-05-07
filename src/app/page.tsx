'use client';

import React from 'react';
import Link from 'next/link';
import { AlertCircle, Activity, Heart, Shield, Navigation, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white overflow-hidden relative">
      {/* Dynamic Background */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3],
          x: [-20, 20, -20]
        }}
        transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-blue-600/20 to-transparent blur-[120px] rounded-full pointer-events-none"
      />

      {/* Hero Section */}
      <div className="relative pt-24 pb-16 px-6">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.2 }
            }
          }}
          className="relative z-10 text-center space-y-6"
        >
          <motion.div
            variants={{ hidden: { opacity: 0, scale: 0.8 }, visible: { opacity: 1, scale: 1 } }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-sm font-black uppercase tracking-widest"
          >
            <Shield size={16} />
          </motion.div>

          <motion.h1
            variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
            className="text-6xl md:text-8xl font-black tracking-tighter leading-none"
          >
            Health<span className="text-blue-500 text-shadow-glow">Guard</span>
          </motion.h1>

          <motion.p
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
            className="text-slate-400 max-w-lg mx-auto text-lg leading-relaxed font-medium"
          >
            Advanced medical triage and emergency SOS that works even in the most remote areas without internet.
          </motion.p>
        </motion.div>
      </div>

      {/* Main Actions */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          hidden: { opacity: 0, y: 40 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { staggerChildren: 0.1 }
          }
        }}
        className="max-w-4xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-6 pb-24"
      >
        <Link href="/sos">
          <motion.div
            variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }}
            whileHover={{ scale: 1.02, backgroundColor: "rgba(220, 38, 38, 0.25)" }}
            whileTap={{ scale: 0.98 }}
            className="group relative h-72 bg-red-600/10 border-2 border-red-500/20 rounded-[3rem] p-10 overflow-hidden cursor-pointer transition-colors"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-red-500/10 blur-3xl group-hover:bg-red-500/30 transition-all duration-500" />
            <AlertCircle className="text-red-500 mb-6 group-hover:rotate-12 transition-transform" size={56} />
            <h2 className="text-4xl font-black mb-3">Emergency SOS</h2>
            <p className="text-red-200/40 text-sm font-bold leading-relaxed">One-tap beacon with offline location capture and medical guidance.</p>
            <div className="mt-8 inline-flex items-center text-red-500 font-black gap-2 text-sm tracking-widest uppercase">
              Activate Beacon <Navigation size={18} />
            </div>
          </motion.div>
        </Link>

        <Link href="/triage">
          <motion.div
            variants={{ hidden: { opacity: 0, x: 20 }, visible: { opacity: 1, x: 0 } }}
            whileHover={{ scale: 1.02, backgroundColor: "rgba(16, 185, 129, 0.25)" }}
            whileTap={{ scale: 0.98 }}
            className="group relative h-72 bg-emerald-600/10 border-2 border-emerald-500/20 rounded-[3rem] p-10 overflow-hidden cursor-pointer transition-colors"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 blur-3xl group-hover:bg-emerald-500/30 transition-all duration-500" />
            <Activity className="text-emerald-500 mb-6 group-hover:rotate-12 transition-transform" size={56} />
            <h2 className="text-4xl font-black mb-3">Smart Triage</h2>
            <p className="text-emerald-200/40 text-sm font-bold leading-relaxed">Age-based symptom analysis and medical risk scoring.</p>
            <div className="mt-8 inline-flex items-center text-emerald-500 font-black gap-2 text-sm tracking-widest uppercase">
              Start Analysis <Activity size={18} />
            </div>
          </motion.div>
        </Link>
      </motion.div>

      {/* Stats Display */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="bg-slate-900/40 backdrop-blur-md border-t border-slate-800/50 py-16"
      >
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-3 gap-12 text-center">
          {[
            { label: 'OFFLINE', val: '100%', sub: 'No Data Needed' },
            { label: 'GPS', val: 'READ', sub: 'Satellite Link' },
            { label: 'SYNC', val: 'AUTO', sub: 'p2p Mesh' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <p className="text-xs font-black text-slate-500 tracking-[0.2em] mb-1">{stat.label}</p>
              <p className="text-4xl font-black text-white leading-none">{stat.val}</p>
              <p className="text-[10px] text-blue-500/60 font-bold mt-2 tracking-widest uppercase">{stat.sub}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <style jsx global>{`
        .text-shadow-glow {
          text-shadow: 0 0 20px rgba(59, 130, 246, 0.5);
        }
      `}</style>
    </main>
  );
}