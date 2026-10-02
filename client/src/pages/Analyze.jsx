import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { analysisService } from '../services/analysisService';
import Sidebar from '../components/Sidebar';
import ThemeToggle from '../components/ThemeToggle';
import {
  FileText,
  Briefcase,
  Sparkles,
  RotateCcw,
  BookOpen,
  CheckCircle2,
  Clock,
  Loader2,
  AlertCircle,
  Menu,
  UploadCloud,
  FileUp,
  X,
  FileCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

export default function Analyze() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [jobTitle, setJobTitle] = useState('Full Stack Developer');
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // PDF file upload state
  const [isUploadingPdf, setIsUploadingPdf] = useState(false);
  const [uploadedPdfInfo, setUploadedPdfInfo] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  // Analysis progress stages
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const stepsList = [
    'Reading and tokenizing resume text',
    'Extracting technical and professional keywords',
    'Comparing against job requirements & multi-word patterns',
    'Calculating keyword match percentage',
    'Preparing actionable recommendations & saving to database'
  ];

  const handlePdfFile = async (file) => {
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
      toast.error('Please upload a valid PDF document (.pdf).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size exceeds the 10MB limit.');
      return;
    }

    try {
      setIsUploadingPdf(true);
      const res = await analysisService.uploadPdfResume(file);
      if (res.success && res.text) {
        setResumeText(res.text);
        setUploadedPdfInfo({
          fileName: res.fileName,
          fileSize: res.fileSize,
          numPages: res.numPages
        });
        toast.success(`Extracted resume text from "${res.fileName}" (${res.numPages} ${res.numPages === 1 ? 'page' : 'pages'})!`);
      }
    } catch (err) {
      console.error('PDF upload error:', err);
      const msg = err.response?.data?.message || 'Failed to extract text from PDF. Please ensure it contains selectable text.';
      toast.error(msg);
    } finally {
      setIsUploadingPdf(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handlePdfFile(e.dataTransfer.files[0]);
    }
  };

  const handleRemovePdf = () => {
    setUploadedPdfInfo(null);
    setResumeText('');
    toast.success('Resume cleared.');
  };

  const handleUseExample = () => {
    setJobTitle('Full Stack Developer');
    setResumeText(
      'Software developer with experience in Python, JavaScript, React, Node.js, SQL, Git, Power BI and Machine Learning. Developed web applications and data analytics dashboards.'
    );
    setJobDescription(
      'We are looking for a Full Stack Developer with experience in JavaScript, React, Node.js, SQL, AWS, Docker, Git and REST APIs. Knowledge of Machine Learning and Python is a plus.'
    );
    toast.success('Sample resume and job description loaded!');
  };

  const handleClearResume = () => setResumeText('');
  const handleClearJob = () => setJobDescription('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (resumeText.trim().length < 50) {
      toast.error('Resume text must be at least 50 characters.');
      return;
    }
    if (jobDescription.trim().length < 50) {
      toast.error('Job description must be at least 50 characters.');
      return;
    }
    if (resumeText.length > 100000 || jobDescription.length > 100000) {
      toast.error('Input exceeds maximum limit of 100,000 characters.');
      return;
    }

    try {
      setIsAnalyzing(true);
      setCurrentStep(0);

      // Logical stages progression
      const interval = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev < stepsList.length - 1) return prev + 1;
          return prev;
        });
      }, 450);

      const res = await analysisService.createAnalysis({
        jobTitle,
        resumeText,
        jobDescription
      });

      clearInterval(interval);
      setCurrentStep(stepsList.length);

      // Brief pause to reveal completed state
      setTimeout(() => {
        toast.success('Analysis completed successfully!');
        navigate(`/results/${res.analysisId}`);
      }, 400);
    } catch (err) {
      console.error('Analysis execution error:', err);
      const msg = err.response?.data?.message || 'Unable to analyze resume. Please try again.';
      toast.error(msg);
      setIsAnalyzing(false);
    }
  };

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

      {/* Main Analysis Canvas */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header */}
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
                Analyze Resume
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Compare your credentials with the job description keywords.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button
              type="button"
              onClick={handleUseExample}
              disabled={isAnalyzing}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/50 border border-brand-200 dark:border-brand-800/60 rounded-xl hover:bg-brand-100 dark:hover:bg-brand-900/40 transition disabled:opacity-50"
            >
              <BookOpen className="w-3.5 h-3.5" />
              Use Example
            </button>
          </div>
        </header>

        <main className="p-4 sm:p-8 max-w-7xl w-full mx-auto space-y-6">
          {/* Job Title Bar */}
          <div className="p-4 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md shadow-sm">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Target Job Title (Optional)
            </label>
            <div className="relative">
              <Briefcase className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="e.g. Senior Full Stack Engineer"
                disabled={isAnalyzing}
                maxLength={200}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-800/70 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition"
              />
            </div>
          </div>

          {/* Split Layout: Resume & Job Description */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* LEFT: Resume Text Area */}
              <div className="flex flex-col p-5 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md shadow-sm relative group focus-within:ring-2 focus-within:ring-brand-500/30 focus-within:border-brand-500 transition">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/60 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        Resume Content
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        Paste your full CV or skills experience
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleClearResume}
                    disabled={isAnalyzing || !resumeText}
                    className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition disabled:opacity-30"
                    title="Clear content"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Hidden File Input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => e.target.files?.[0] && handlePdfFile(e.target.files[0])}
                  accept=".pdf,application/pdf"
                  className="hidden"
                />

                {/* PDF Upload Dropzone / Parsed Card */}
                {uploadedPdfInfo ? (
                  <div className="mb-3 p-3 rounded-xl bg-brand-50/80 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-800 flex items-center justify-between shadow-xs">
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <div className="p-1.5 rounded-lg bg-brand-600 text-white flex-shrink-0">
                        <FileCheck className="w-4 h-4" />
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {uploadedPdfInfo.fileName}
                        </p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400">
                          {(uploadedPdfInfo.fileSize / 1024).toFixed(0)} KB • {uploadedPdfInfo.numPages} {uploadedPdfInfo.numPages === 1 ? 'page' : 'pages'} extracted • Editable below
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemovePdf}
                      className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition flex-shrink-0"
                      title="Remove uploaded PDF"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`mb-3 p-3 rounded-xl border-2 border-dashed transition-all cursor-pointer text-center flex flex-col items-center justify-center gap-1 ${
                      isDragging
                        ? 'border-brand-500 bg-brand-50/80 dark:bg-brand-950/50 scale-[1.01]'
                        : 'border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 hover:border-brand-400 hover:bg-brand-50/30 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    {isUploadingPdf ? (
                      <div className="flex items-center gap-2 py-1 text-xs font-semibold text-brand-600 dark:text-brand-400">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Extracting text from PDF resume...</span>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-200">
                          <UploadCloud className="w-4 h-4 text-brand-500" />
                          <span>Upload PDF Resume or Drag & Drop</span>
                        </div>
                        <p className="text-[10px] text-slate-400">
                          Standard .pdf documents up to 10MB • Text parses automatically
                        </p>
                      </>
                    )}
                  </div>
                )}

                <textarea
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Paste your resume text here (minimum 50 characters) or upload a PDF above...&#10;&#10;e.g., Software developer experienced in Python, JavaScript, React, Node.js, SQL, Docker, and Machine Learning..."
                  rows={uploadedPdfInfo ? 10 : 12}
                  disabled={isAnalyzing}
                  className="w-full p-3 text-sm bg-transparent border-0 resize-y focus:outline-none text-slate-800 dark:text-slate-100 placeholder:text-slate-400 leading-relaxed font-sans"
                />

                <div className="pt-3 mt-auto border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-[11px]">
                  <span
                    className={`font-semibold ${
                      resumeText.length >= 50
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-slate-400'
                    }`}
                  >
                    {resumeText.length >= 50 ? '✓ Ready for analysis' : 'Min 50 characters required'}
                  </span>
                  <span className="text-slate-400 font-mono">
                    {resumeText.length.toLocaleString()} / 100,000 characters
                  </span>
                </div>
              </div>

              {/* RIGHT: Job Description Text Area */}
              <div className="flex flex-col p-5 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md shadow-sm relative group focus-within:ring-2 focus-within:ring-cyan-500/30 focus-within:border-cyan-500 transition">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/60 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400">
                      <Briefcase className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        Job Description
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        Paste the target position requirements
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleClearJob}
                    disabled={isAnalyzing || !jobDescription}
                    className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition disabled:opacity-30"
                    title="Clear content"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>

                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste target job requirements here (minimum 50 characters)...&#10;&#10;e.g., We are looking for a Full Stack Engineer with proficiency in JavaScript, React, Node.js, SQL, AWS, Docker, and REST APIs..."
                  rows={14}
                  disabled={isAnalyzing}
                  className="w-full p-3 text-sm bg-transparent border-0 resize-y focus:outline-none text-slate-800 dark:text-slate-100 placeholder:text-slate-400 leading-relaxed font-sans"
                />

                <div className="pt-3 mt-auto border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-[11px]">
                  <span
                    className={`font-semibold ${
                      jobDescription.length >= 50
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-slate-400'
                    }`}
                  >
                    {jobDescription.length >= 50 ? '✓ Ready for analysis' : 'Min 50 characters required'}
                  </span>
                  <span className="text-slate-400 font-mono">
                    {jobDescription.length.toLocaleString()} / 100,000 characters
                  </span>
                </div>
              </div>
            </div>

            {/* Progress Animation UI if analyzing */}
            <AnimatePresence>
              {isAnalyzing && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-6 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-brand-500/30 backdrop-blur-md shadow-xl"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <Loader2 className="w-5 h-5 text-brand-500 animate-spin" />
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      Analyzing Resume Keywords & Skills...
                    </h4>
                  </div>

                  <div className="space-y-2.5">
                    {stepsList.map((st, idx) => {
                      const isDone = idx < currentStep;
                      const isCurrent = idx === currentStep;

                      return (
                        <div
                          key={idx}
                          className={`flex items-center gap-3 text-xs transition-colors ${
                            isDone
                              ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                              : isCurrent
                              ? 'text-brand-600 dark:text-brand-400 font-bold animate-pulse'
                              : 'text-slate-400 font-normal'
                          }`}
                        >
                          <span className="w-4 flex-shrink-0 text-center">
                            {isDone ? (
                              '✓'
                            ) : isCurrent ? (
                              '→'
                            ) : (
                              '○'
                            )}
                          </span>
                          <span>{st}</span>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Analyze Action Button */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-brand-500 flex-shrink-0" />
                Keyword matching normalizes technology names, acronyms, and multi-word phrases.
              </p>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={
                  isAnalyzing ||
                  resumeText.trim().length < 50 ||
                  jobDescription.trim().length < 50
                }
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 text-base font-bold text-white bg-gradient-to-r from-brand-600 via-brand-500 to-cyan-600 hover:from-brand-500 hover:to-cyan-500 rounded-2xl shadow-xl shadow-brand-500/25 hover:shadow-brand-500/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 text-amber-300" />
                    <span>Analyze Resume</span>
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
