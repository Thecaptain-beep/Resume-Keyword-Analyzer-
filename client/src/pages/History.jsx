import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { analysisService } from '../services/analysisService';
import Sidebar from '../components/Sidebar';
import SkeletonCard from '../components/SkeletonCard';
import ConfirmModal from '../components/ConfirmModal';
import ThemeToggle from '../components/ThemeToggle';
import {
  History as HistoryIcon,
  Search,
  Filter,
  ArrowUpDown,
  Eye,
  Trash2,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Menu,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getScoreColor, formatDate, formatShortDate } from '../utils/formatters';
import toast from 'react-hot-toast';

export default function History() {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'oldest' | 'scoreHigh' | 'scoreLow'

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Deletion modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [targetId, setTargetId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchAnalyses = async () => {
    try {
      setLoading(true);
      const res = await analysisService.getAllAnalyses();
      if (res.success) {
        setAnalyses(res.analyses);
      }
    } catch (err) {
      console.error('Failed to load history:', err);
      toast.error('Failed to load analysis history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyses();
  }, []);

  const openDeleteModal = (id) => {
    setTargetId(id);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!targetId) return;
    try {
      setIsDeleting(true);
      await analysisService.deleteAnalysis(targetId);
      toast.success('Analysis deleted successfully.');
      setAnalyses((prev) => prev.filter((a) => a.AnalysisId !== targetId));
      setDeleteModalOpen(false);
    } catch (err) {
      toast.error('Failed to delete analysis.');
    } finally {
      setIsDeleting(false);
      setTargetId(null);
    }
  };

  // Filter and Sort Pipeline
  const filteredList = analyses
    .filter((item) => {
      const title = item.JobTitle || '';
      const matchesSearch = title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTier =
        tierFilter === 'All'
          ? true
          : tierFilter === 'High'
          ? item.MatchPercentage >= 70
          : tierFilter === 'Medium'
          ? item.MatchPercentage >= 40 && item.MatchPercentage < 70
          : item.MatchPercentage < 40;
      return matchesSearch && matchesTier;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.CreatedAt) - new Date(a.CreatedAt);
      if (sortBy === 'oldest') return new Date(a.CreatedAt) - new Date(b.CreatedAt);
      if (sortBy === 'scoreHigh') return b.MatchPercentage - a.MatchPercentage;
      if (sortBy === 'scoreLow') return a.MatchPercentage - b.MatchPercentage;
      return 0;
    });

  // Pagination calculation
  const totalPages = Math.ceil(filteredList.length / itemsPerPage) || 1;
  const paginatedList = filteredList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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

      {/* Main Canvas */}
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
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Analysis History
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Explore, compare, and manage your past resume evaluations.
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

        {/* Main Content Area */}
        <main className="p-4 sm:p-8 max-w-7xl w-full mx-auto space-y-6">
          {/* Controls Bar */}
          <div className="p-4 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Search */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search by job title..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/60 focus:outline-none focus:ring-1 focus:ring-brand-500 text-slate-900 dark:text-white"
              />
            </div>

            {/* Filter and Sort Group */}
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
              {/* Tier Filter */}
              <select
                value={tierFilter}
                onChange={(e) => {
                  setTierFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 focus:outline-none"
              >
                <option value="All">All Scores</option>
                <option value="High">High (70%+)</option>
                <option value="Medium">Medium (40-69%)</option>
                <option value="Low">Low (&lt;40%)</option>
              </select>

              {/* Sort Order */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 focus:outline-none"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="scoreHigh">Score: High to Low</option>
                <option value="scoreLow">Score: Low to High</option>
              </select>
            </div>
          </div>

          {loading ? (
            <SkeletonCard rows={6} />
          ) : filteredList.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80">
              <HistoryIcon className="w-10 h-10 text-slate-400 mx-auto mb-3 opacity-60" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                No analyses found
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                {searchQuery || tierFilter !== 'All'
                  ? 'No records match your search or filter settings.'
                  : 'You have not performed any keyword checks yet. Run your first comparison!'}
              </p>
              <Link
                to="/analyze"
                className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow transition"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Analyze a Resume
              </Link>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block p-6 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md shadow-sm">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                      <th className="pb-3 px-3">Date</th>
                      <th className="pb-3 px-3">Job Title</th>
                      <th className="pb-3 px-3">Match Score</th>
                      <th className="pb-3 px-3">Matched</th>
                      <th className="pb-3 px-3">Missing</th>
                      <th className="pb-3 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                    <AnimatePresence>
                      {paginatedList.map((item) => {
                        const scoreStyle = getScoreColor(item.MatchPercentage);
                        return (
                          <motion.tr
                            key={item.AnalysisId}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                          >
                            <td className="py-3 px-3 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                              {formatShortDate(item.CreatedAt)}
                            </td>
                            <td className="py-3 px-3 text-slate-800 dark:text-slate-200 font-bold max-w-[240px] truncate">
                              {item.JobTitle || 'Untitled Position'}
                            </td>
                            <td className="py-3 px-3">
                              <span
                                className={`px-2.5 py-1 rounded-lg font-bold text-xs border ${scoreStyle.badge}`}
                              >
                                {Number(item.MatchPercentage).toFixed(1)}%
                              </span>
                            </td>
                            <td className="py-3 px-3 text-emerald-600 dark:text-emerald-400 font-semibold">
                              {item.MatchedKeywords}
                            </td>
                            <td className="py-3 px-3 text-amber-600 dark:text-amber-400 font-semibold">
                              {item.MissingKeywords}
                            </td>
                            <td className="py-3 px-3 text-right whitespace-nowrap">
                              <div className="flex items-center justify-end gap-2">
                                <Link
                                  to={`/results/${item.AnalysisId}`}
                                  className="p-1.5 text-slate-500 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-950/40 rounded-lg transition"
                                  title="View Analysis"
                                >
                                  <Eye className="w-4 h-4" />
                                </Link>
                                <button
                                  onClick={() => openDeleteModal(item.AnalysisId)}
                                  className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition"
                                  title="Delete Analysis"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </motion.tr>
                        );
                      })}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards View */}
              <div className="md:hidden space-y-3">
                <AnimatePresence>
                  {paginatedList.map((item) => {
                    const scoreStyle = getScoreColor(item.MatchPercentage);
                    return (
                      <motion.div
                        key={item.AnalysisId}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="p-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm"
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div>
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                              {item.JobTitle || 'Untitled Position'}
                            </h4>
                            <span className="text-[11px] text-slate-400">
                              {formatShortDate(item.CreatedAt)}
                            </span>
                          </div>
                          <span
                            className={`px-2 py-0.5 rounded-lg font-bold text-xs border ${scoreStyle.badge}`}
                          >
                            {Number(item.MatchPercentage).toFixed(1)}%
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-xs py-2 border-y border-slate-100 dark:border-slate-800/60 my-2">
                          <span className="text-slate-500">
                            Matched: <strong className="text-emerald-600">{item.MatchedKeywords}</strong>
                          </span>
                          <span className="text-slate-500">
                            Missing: <strong className="text-amber-600">{item.MissingKeywords}</strong>
                          </span>
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-1">
                          <Link
                            to={`/results/${item.AnalysisId}`}
                            className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold text-brand-600 bg-brand-50 dark:bg-brand-950/40 rounded-lg"
                          >
                            <Eye className="w-3.5 h-3.5" /> View
                          </Link>
                          <button
                            onClick={() => openDeleteModal(item.AnalysisId)}
                            className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold text-rose-600 bg-rose-50 dark:bg-rose-950/40 rounded-lg"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Delete
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>

              {/* Pagination Bar */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-2 pt-2 text-xs text-slate-500">
                  <span>
                    Page {currentPage} of {totalPages} ({filteredList.length} total)
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 disabled:opacity-30 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 disabled:opacity-30 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Analysis"
        message="Are you sure you want to delete this historical analysis? This will permanently remove the record."
        confirmText="Yes, Delete"
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteModalOpen(false)}
      />
    </div>
  );
}
