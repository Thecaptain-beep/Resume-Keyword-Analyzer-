import React from 'react';

export default function SkeletonCard({ rows = 3, className = '' }) {
  return (
    <div className={`p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm animate-pulse ${className}`}>
      <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded-md w-1/3 mb-4"></div>
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, idx) => (
          <div
            key={idx}
            className="h-4 bg-slate-200/80 dark:bg-slate-800/80 rounded"
            style={{ width: `${85 - idx * 15}%` }}
          />
        ))}
      </div>
    </div>
  );
}
