import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { dashboardService } from '../services/dashboardService';
import { analysisService } from '../services/analysisService';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';
import SkeletonCard from '../components/SkeletonCard';
import ConfirmModal from '../components/ConfirmModal';
import ThemeToggle from '../components/ThemeToggle';
import {
  FileText,
  Percent,
  TrendingUp,
  Award,
  Sparkles,
  Eye,
  Trash2,
  Menu,
  X,
  History,
  AlertCircle
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { getScoreColor, formatShortDate } from '../utils/formatters';
import { fadeUp, staggerContainer, staggerItem } from '../utils/animations';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [charts, setCharts] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Deletion modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [targetAnalysisId, setTargetAnalysisId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, recentRes] = await Promise.all([
        dashboardService.getStats(),
        dashboardService.getRecent()
      ]);

      if (statsRes.success) {
        setStats(statsRes.stats);
        setCharts(statsRes.charts);
      }
      if (recentRes.success) {
        setRecent(recentRes.recent);
      }
    } catch (err) {
      console.error('Error fetching dashboard:', err);
      toast.error('Failed to load dashboard metrics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const openDeleteModal = (id) => {
    setTargetAnalysisId(id);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!targetAnalysisId) return;
    try {
      setIsDeleting(true);
      await analysisService.deleteAnalysis(targetAnalysisId);
      toast.success('Analysis deleted successfully.');
      setDeleteModalOpen(false);
      // Refresh dashboard stats and recent
      fetchDashboardData();
    } catch (err) {
      toast.error('Failed to delete analysis.');
    } finally {
      setIsDeleting(false);
      setTargetAnalysisId(null);
    }
  };

  const PIE_COLORS = ['#0284c7', '#06b6d4', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#6366f1'];

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

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Dashboard Header Bar */}
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
                Welcome back, {user?.fullName?.split(' ')[0] || 'User'}!
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Track your resume match percentages and skill breakdowns.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              to="/analyze"
              className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-brand-600 to-cyan-600 hover:from-brand-500 hover:to-cyan-500 rounded-xl shadow-md shadow-brand-500/20 hover:scale-[1.02] active:scale-[0.98] transition"
            >
              <Sparkles className="w-4 h-4" />
              <span className="hidden sm:inline">New Analysis</span>
            </Link>
          </div>
        </header>

        {/* Dashboard Body */}
        <main className="p-4 sm:p-8 space-y-8 max-w-7xl w-full mx-auto">
          {loading ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <SkeletonCard rows={2} />
                <SkeletonCard rows={2} />
                <SkeletonCard rows={2} />
                <SkeletonCard rows={2} />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SkeletonCard rows={6} />
                <SkeletonCard rows={6} />
              </div>
            </div>
          ) : (
            <>
              {/* Statistic Cards */}
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
              >
                <motion.div variants={staggerItem}>
                  <StatCard
                    title="Total Analyses"
                    value={stats?.totalAnalyses || 0}
                    icon={FileText}
                    colorScheme="blue"
                    subtitle="Resumes checked against job roles"
                  />
                </motion.div>
                <motion.div variants={staggerItem}>
                  <StatCard
                    title="Average Match Score"
                    value={stats?.averageScore || 0}
                    suffix="%"
                    decimals={1}
                    icon={Percent}
                    colorScheme="emerald"
                    subtitle="Mean keyword alignment"
                  />
                </motion.div>
                <motion.div variants={staggerItem}>
                  <StatCard
                    title="Highest Match Score"
                    value={stats?.highestScore || 0}
                    suffix="%"
                    decimals={1}
                    icon={Award}
                    colorScheme="purple"
                    subtitle="Peak keyword coverage"
                  />
                </motion.div>
                <motion.div variants={staggerItem}>
                  <StatCard
                    title="Lowest Match Score"
                    value={stats?.lowestScore || 0}
                    suffix="%"
                    decimals={1}
                    icon={TrendingUp}
                    colorScheme="amber"
                    subtitle="Baseline benchmark"
                  />
                </motion.div>
              </motion.div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Chart 1: Match Score Over Time */}
                <div className="p-6 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        Match Score Over Time
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Historical progress across past job scans
                      </p>
                    </div>
                  </div>

                  <div className="h-64 w-full">
                    {charts?.scoreOverTime?.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={charts.scoreOverTime}>
                          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                          <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} />
                          <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={11} unit="%" />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: '#0f172a',
                              borderRadius: '12px',
                              border: '1px solid #1e293b',
                              color: '#fff',
                              fontSize: '12px'
                            }}
                            formatter={(val) => [`${val}%`, 'Score']}
                          />
                          <Line
                            type="monotone"
                            dataKey="score"
                            stroke="#0284c7"
                            strokeWidth={3}
                            dot={{ fill: '#0284c7', r: 4 }}
                            activeDot={{ r: 6 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-slate-400 text-xs">
                        <History className="w-8 h-8 mb-2 opacity-50" />
                        No analysis history yet. Run an analysis to visualize trends!
                      </div>
                    )}
                  </div>
                </div>

                {/* Chart 2: Matched vs Missing Bar Chart */}
                <div className="p-6 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        Matched vs Missing Keywords
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Keyword coverage comparison for recent applications
                      </p>
                    </div>
                  </div>

                  <div className="h-64 w-full">
                    {charts?.matchedVsMissing?.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={charts.matchedVsMissing}>
                          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                          <XAxis dataKey="jobTitle" stroke="#94a3b8" fontSize={11} />
                          <YAxis stroke="#94a3b8" fontSize={11} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: '#0f172a',
                              borderRadius: '12px',
                              border: '1px solid #1e293b',
                              color: '#fff',
                              fontSize: '12px'
                            }}
                          />
                          <Legend wrapperStyle={{ fontSize: '11px' }} />
                          <Bar dataKey="matched" name="Matched" fill="#10b981" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="missing" name="Missing" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-slate-400 text-xs">
                        <History className="w-8 h-8 mb-2 opacity-50" />
                        No keyword data available yet.
                      </div>
                    )}
                  </div>
                </div>

                {/* Chart 3: Category Distribution Donut Chart */}
                <div className="p-6 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md shadow-sm lg:col-span-2">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        Keyword Category Distribution
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Breakdown of demanded competencies across analyzed jobs
                      </p>
                    </div>
                  </div>

                  <div className="h-64 w-full">
                    {charts?.categoryChartData?.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={charts.categoryChartData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            innerRadius={55}
                            outerRadius={85}
                            paddingAngle={4}
                            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                            labelLine={false}
                          >
                            {charts.categoryChartData.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={PIE_COLORS[index % PIE_COLORS.length]}
                              />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{
                              backgroundColor: '#0f172a',
                              borderRadius: '12px',
                              border: '1px solid #1e293b',
                              color: '#fff',
                              fontSize: '12px'
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-slate-400 text-xs">
                        <History className="w-8 h-8 mb-2 opacity-50" />
                        No category data yet. Analyze a job posting to populate this breakdown.
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Recent Analyses Table */}
              <div className="p-6 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      Recent Analyses
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Your 5 latest resume and job comparisons
                    </p>
                  </div>

                  <Link
                    to="/history"
                    className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
                  >
                    View All History
                  </Link>
                </div>

                {recent.length === 0 ? (
                  <div className="py-12 text-center">
                    <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      No analyses recorded yet
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                      Paste your resume and target job requirements to generate your first match report.
                    </p>
                    <Link
                      to="/analyze"
                      className="inline-flex items-center gap-2 mt-4 px-4 py-2 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow transition"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      Start Analysis
                    </Link>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
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
                        {recent.map((item) => {
                          const scoreStyle = getScoreColor(item.MatchPercentage);
                          return (
                            <tr
                              key={item.AnalysisId}
                              className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                            >
                              <td className="py-3 px-3 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                                {formatShortDate(item.CreatedAt)}
                              </td>
                              <td className="py-3 px-3 text-slate-800 dark:text-slate-200 font-bold whitespace-nowrap max-w-[200px] truncate">
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
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}
        </main>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Analysis Record"
        message="Are you sure you want to delete this analysis? It will be permanently removed from your dashboard and history."
        confirmText="Yes, Delete"
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteModalOpen(false)}
      />
    </div>
  );
}
