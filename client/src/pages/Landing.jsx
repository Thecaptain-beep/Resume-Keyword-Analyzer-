import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  Target,
  CheckCircle2,
  AlertTriangle,
  History,
  BarChart3,
  ShieldCheck,
  FileText,
  Layers,
  Search,
  Check
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { fadeUp, staggerContainer, staggerItem, scaleIn } from '../utils/animations';

export default function Landing() {
  const floatingKeywords = [
    { name: 'Python', color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' },
    { name: 'React', color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20' },
    { name: 'SQL', color: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20' },
    { name: 'AWS', color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' },
    { name: 'Docker', color: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20' },
    { name: 'Machine Learning', color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20' }
  ];

  const features = [
    {
      icon: Search,
      title: 'Keyword Matching',
      desc: 'Deep tokenization and phrase recognition cross-references technical & professional requirements instantaneously.'
    },
    {
      icon: AlertTriangle,
      title: 'Missing Skills Detection',
      desc: 'Pinpoints exact tools, libraries, or methodologies highlighted in the job spec that are absent from your CV.'
    },
    {
      icon: Target,
      title: 'Match Percentage',
      desc: 'Transparent formulaic scoring based strictly on required keywords without opaque black-box guessing.'
    },
    {
      icon: History,
      title: 'Analysis History',
      desc: 'Review past job analyses, inspect matched breakdowns, and track resume optimization over time.'
    },
    {
      icon: BarChart3,
      title: 'Analytics Dashboard',
      desc: 'Visual trend charts, category distributions, and score metrics powered by Microsoft SQL Server.'
    },
    {
      icon: ShieldCheck,
      title: 'Secure Authentication',
      desc: 'Enterprise-grade password hashing, JWT authorization, and isolated user data security.'
    }
  ];

  const steps = [
    { num: '01', title: 'Paste Resume', desc: 'Copy and paste your current resume text or bio summary into our editor.' },
    { num: '02', title: 'Add Job Description', desc: 'Paste the target job requirements or LinkedIn role specification.' },
    { num: '03', title: 'Analyze Keywords', desc: 'Our multi-word keyword engine normalizes and cross-references skills.' },
    { num: '04', title: 'View Match Score', desc: 'Inspect your match percentage, missing skills, and tailored advice.' }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Decorative background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-brand-500/15 via-cyan-500/15 to-purple-500/10 blur-3xl rounded-full pointer-events-none -z-10" />

        <div className="text-center max-w-3xl mx-auto">
          {/* Badge */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-brand-500/20 bg-brand-500/5 text-brand-600 dark:text-brand-400 text-xs font-bold tracking-wide uppercase shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Smart Resume Analysis
          </motion.div>

          {/* Heading */}
          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.1 }}
            className="mt-6 text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]"
          >
            Check How Well Your Resume{' '}
            <span className="text-gradient">Matches Any Job</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
            className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed font-normal"
          >
            Compare your resume with a job description, discover missing keywords, and understand the skills recruiters may be looking for.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.3 }}
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/analyze"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 text-base font-bold text-white bg-gradient-to-r from-brand-600 to-cyan-600 hover:from-brand-500 hover:to-cyan-500 rounded-2xl shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all group"
            >
              <span>Analyze My Resume</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-base font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition shadow-sm hover:scale-[1.01]"
            >
              <span>Explore Dashboard</span>
            </Link>
          </motion.div>
        </div>

        {/* Hero Mockup Preview */}
        <motion.div
          variants={scaleIn}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.4 }}
          className="mt-16 max-w-4xl mx-auto relative"
        >
          {/* Mockup Card */}
          <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            {/* Window bar */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200/60 dark:border-slate-800/60 mb-6">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500" />
                <span className="w-3 h-3 rounded-full bg-amber-500" />
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
              </div>
              <div className="text-xs font-semibold text-slate-400">
                ResumeCheck AI Engine – Match Simulator
              </div>
              <div className="w-12"></div>
            </div>

            {/* Pipeline Flow representation */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              {/* Resume snippet */}
              <div className="p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 bg-slate-50/70 dark:bg-slate-800/40">
                <div className="flex items-center gap-2 mb-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <FileText className="w-3.5 h-3.5 text-brand-500" />
                  Your Resume
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3">
                  Software developer experienced in Python, JavaScript, React, Node.js, SQL, and Machine Learning...
                </p>
              </div>

              {/* Center Analysis arrow */}
              <div className="flex flex-col items-center justify-center text-center">
                <div className="w-10 h-10 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center mb-2 shadow-inner">
                  <Sparkles className="w-5 h-5 animate-spin-slow" />
                </div>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Keyword Extraction & Comparison
                </span>
                <span className="text-[11px] text-slate-400 mt-0.5">
                  Multi-word matching & normalization
                </span>
              </div>

              {/* Match Result */}
              <div className="p-4 rounded-2xl border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/80 dark:bg-emerald-950/40 flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500 text-white flex items-center justify-center font-black text-xl shadow-md shadow-emerald-500/30 flex-shrink-0">
                  78%
                </div>
                <div>
                  <h4 className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
                    Good Keyword Match
                  </h4>
                  <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
                    9 of 12 required keywords found
                  </p>
                </div>
              </div>
            </div>

            {/* Floating Keywords Badges Bar */}
            <div className="mt-8 pt-6 border-t border-slate-200/60 dark:border-slate-800/60">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                Detected Technical & Professional Keywords:
              </p>
              <div className="flex flex-wrap gap-2">
                {floatingKeywords.map((kw, i) => (
                  <motion.span
                    key={kw.name}
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: 'easeInOut' }}
                    className={`px-3 py-1 rounded-xl text-xs font-semibold border ${kw.color}`}
                  >
                    {kw.name}
                  </motion.span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Feature Section */}
      <section id="features" className="py-20 bg-slate-100/60 dark:bg-navy-900/40 border-y border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
              Comprehensive Toolkit
            </span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              Engineered For Modern Career Growth
            </h2>
            <p className="mt-4 text-slate-600 dark:text-slate-400 text-base">
              Everything you need to optimize your resume with precision keyword intelligence.
            </p>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <motion.div
                  key={idx}
                  variants={staggerItem}
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                  className="p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg hover:border-brand-500/40 transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                    {feat.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {feat.desc}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
            Intuitive Process
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            How ResumeCheck Works
          </h2>
          <p className="mt-4 text-slate-600 dark:text-slate-400 text-base">
            Follow four simple steps to analyze your alignment against any target job opening.
          </p>
        </div>

        {/* Steps Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          {steps.map((st, i) => (
            <div key={st.num} className="relative flex flex-col items-center text-center">
              {/* Step indicator */}
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-600 to-cyan-500 text-white font-black text-lg flex items-center justify-center shadow-lg shadow-brand-500/25 mb-5 z-10">
                {st.num}
              </div>

              <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                {st.title}
              </h4>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-xs">
                {st.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Trust & Info Disclaimer Section */}
      <section className="py-12 bg-slate-100/50 dark:bg-slate-900/50 border-t border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-900/60 text-blue-900 dark:text-blue-300 text-xs sm:text-sm font-medium">
            <Check className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
            <span>
              Your match score is a keyword-based indicator, not a guarantee of job selection.
            </span>
          </div>
          <p className="mt-4 text-xs text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            ResumeCheck empowers job seekers by revealing skill alignment and vocabulary coverage. Always describe your genuine experiences honestly and factually.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-950 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-brand-600 text-white flex items-center justify-center font-bold text-xs">
              RC
            </div>
            <span className="font-bold text-slate-700 dark:text-slate-300">
              ResumeCheck © {new Date().getFullYear()}
            </span>
          </div>
          <p>Full-Stack Resume Keyword Analyzer backed by Microsoft SQL Server.</p>
        </div>
      </footer>
    </div>
  );
}
