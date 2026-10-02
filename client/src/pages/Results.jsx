import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { analysisService } from '../services/analysisService';
import Sidebar from '../components/Sidebar';
import ScoreCard from '../components/ScoreCard';
import StatCard from '../components/StatCard';
import KeywordBadge from '../components/KeywordBadge';
import SkeletonCard from '../components/SkeletonCard';
import ThemeToggle from '../components/ThemeToggle';
import {
  FileCheck2,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Search,
  Filter,
  ArrowLeft,
  Share2,
  Sparkles,
  Info,
  Menu,
  Check,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeUp, staggerContainer, staggerItem } from '../utils/animations';
import { getImportanceBadge } from '../utils/formatters';
import toast from 'react-hot-toast';

export default function Results() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Filter & Search states for the breakdown table
  const [tableFilter, setTableFilter] = useState('All'); // 'All' | 'Matched' | 'Missing'
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function loadAnalysis() {
      try {
        setLoading(true);
        const res = await analysisService.getAnalysisById(id);
        setData(res);
      } catch (err) {
        console.error('Failed to load analysis results:', err);
        toast.error('Unable to retrieve analysis details.');
      } finally {
        setLoading(false);
      }
    }
    loadAnalysis();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-slate-100">
        <Sidebar className="hidden lg:flex" />
        <div className="flex-1 p-8 max-w-7xl mx-auto space-y-6">
          <SkeletonCard rows={3} />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <SkeletonCard rows={2} />
            <SkeletonCard rows={2} />
            <SkeletonCard rows={2} />
            <SkeletonCard rows={2} />
          </div>
          <SkeletonCard rows={6} />
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-navy-950 p-4">
        <div className="text-center max-w-md">
          <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Analysis Not Found</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            This analysis may have been deleted or you don't have permission to view it.
          </p>
          <Link
            to="/dashboard"
            className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 text-white text-sm font-bold shadow"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // Filter breakdown rows
  const filteredBreakdown = (data.breakdownList || []).filter((item) => {
    const matchesFilter =
      tableFilter === 'All'
        ? true
        : tableFilter === 'Matched'
        ? item.found
        : !item.found;

    const matchesSearch =
      item.keyword.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {/* Desktop Sidebar */}
      <Sidebar className="hidden lg:flex" />

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setMobileSidebarOpen(false)}
            />
            <div className="relative z-10 h-full w-64">
              <Sidebar onItemClick={() => setMobileSidebarOpen(false)} />
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Main Results Canvas */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Header Bar */}
        <header className="sticky top-0 z-30 glass-nav border-b border-slate-200/80 dark:border-slate-800/80 px-4 sm:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
            >
              <Menu className="w-5 h-5" />
            </button>
            <Link
              to="/dashboard"
              className="p-2 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
              title="Return to Dashboard"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Resume Analysis Complete
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Position: <span className="font-semibold text-slate-700 dark:text-slate-200">{data.jobTitle}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              to="/analyze"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow transition"
            >
              <Sparkles className="w-4 h-4" />
              New Analysis
            </Link>
          </div>
        </header>

        {/* Content Body */}
        <main className="p-4 sm:p-8 max-w-7xl w-full mx-auto space-y-8">
          {/* Top Score & Summary Banner */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
            {/* Score Circular Gauge */}
            <div className="lg:col-span-1">
              <ScoreCard
                score={data.matchPercentage}
                tier={data.matchTier}
                subtitle="Calculated as (Matched Job Keywords / Total Job Keywords) × 100"
              />
            </div>

            {/* Quick Stats Grid */}
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatCard
                title="Total Job Keywords"
                value={data.totalKeywords}
                icon={FileCheck2}
                colorScheme="blue"
                subtitle="Identified from requirements"
              />
              <StatCard
                title="Matched Keywords"
                value={data.matchedKeywords}
                icon={CheckCircle2}
                colorScheme="emerald"
                subtitle="Found in your resume"
              />
              <StatCard
                title="Missing Keywords"
                value={data.missingKeywords}
                icon={AlertTriangle}
                colorScheme="amber"
                subtitle="Not detected in your resume"
              />

              {/* Disclaimer callout box spanning full width */}
              <div className="sm:col-span-3 p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900/60 flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-blue-900 dark:text-blue-200 leading-relaxed">
                  <span className="font-bold">Important Notice: </span>
                  Keyword match percentage is an indicator and does not guarantee job selection. Tailor your resume authentically to demonstrate relevant experience.
                </p>
              </div>
            </div>
          </div>

          {/* Matched Keywords Section */}
          <div className="p-6 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Matched Keywords ({data.matchedKeywords})
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Skills and tools in the job posting that are present in your resume
                </p>
              </div>
            </div>

            {data.matchedKeywordsList?.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No matched keywords detected.</p>
            ) : (
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="flex flex-wrap gap-2.5"
              >
                {data.matchedKeywordsList.map((kw, i) => (
                  <motion.div key={i} variants={staggerItem}>
                    <KeywordBadge
                      keyword={kw.keyword}
                      category={kw.category}
                      importance={kw.importance}
                      isMatched={true}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>

          {/* Missing Keywords Section */}
          <div className="p-6 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Missing Keywords ({data.missingKeywords})
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Requirements specified in the job posting that were not found in your resume
                </p>
              </div>
            </div>

            {data.missingKeywordsList?.length === 0 ? (
              <p className="text-xs text-emerald-600 font-semibold">
                Terrific! No missing keywords found. Your resume mentions all key requirements.
              </p>
            ) : (
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="flex flex-wrap gap-2.5"
              >
                {data.missingKeywordsList.map((kw, i) => (
                  <motion.div key={i} variants={staggerItem}>
                    <KeywordBadge
                      keyword={kw.keyword}
                      category={kw.category}
                      importance={kw.importance}
                      isMatched={false}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>

          {/* Recommendations Panel */}
          <div className="p-6 rounded-2xl bg-gradient-to-tr from-brand-50/50 via-white/70 to-cyan-50/50 dark:from-slate-900/80 dark:via-slate-900/70 dark:to-navy-900/80 border border-brand-200/60 dark:border-slate-800/80 backdrop-blur-md shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
                <Lightbulb className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Strategic Recommendations
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Actionable enhancements based on your keyword analysis
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {data.recommendations?.map((rec, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-white/80 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-start gap-3 shadow-xs"
                >
                  <span className="w-5 h-5 rounded-full bg-brand-100 dark:bg-brand-900/60 text-brand-600 dark:text-brand-300 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                    {rec}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Keyword Breakdown Table */}
          <div className="p-6 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Comprehensive Keyword Breakdown
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Detailed status of each detected skill requirement
                </p>
              </div>

              {/* Filters & Search */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Search input */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search keywords..."
                    className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/60 focus:outline-none focus:ring-1 focus:ring-brand-500 text-slate-900 dark:text-white"
                  />
                </div>

                {/* Filter buttons */}
                <div className="inline-flex rounded-xl border border-slate-200 dark:border-slate-800 p-0.5 bg-slate-100/80 dark:bg-slate-800/60 text-xs">
                  {['All', 'Matched', 'Missing'].map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setTableFilter(tab)}
                      className={`px-3 py-1 rounded-lg font-bold transition ${
                        tableFilter === tab
                          ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                          : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                    <th className="pb-3 px-3">Keyword</th>
                    <th className="pb-3 px-3">Category</th>
                    <th className="pb-3 px-3">Importance</th>
                    <th className="pb-3 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                  {filteredBreakdown.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-slate-400">
                        No keywords matching filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredBreakdown.map((item, idx) => (
                      <tr
                        key={idx}
                        className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                      >
                        <td className="py-3 px-3 text-slate-800 dark:text-slate-200 font-bold">
                          {item.keyword}
                        </td>
                        <td className="py-3 px-3 text-slate-500 dark:text-slate-400">
                          {item.category}
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-0.5 rounded-md border text-[11px] font-semibold ${getImportanceBadge(
                              item.importance
                            )}`}
                          >
                            {item.importance}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          {item.found ? (
                            <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                              <Check className="w-3.5 h-3.5" /> Matched
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 font-bold">
                              <X className="w-3.5 h-3.5" /> Missing
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
