import React from 'react';
import { motion } from 'framer-motion';
import { Check, AlertCircle } from 'lucide-react';
import { getImportanceBadge } from '../utils/formatters';

export default function KeywordBadge({
  keyword,
  category,
  importance,
  isMatched = true,
  onClick
}) {
  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.02 }}
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all shadow-sm ${
        isMatched
          ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
          : 'bg-amber-50/80 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200'
      }`}
      onClick={onClick}
    >
      <span className="flex-shrink-0">
        {isMatched ? (
          <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
        ) : (
          <AlertCircle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
        )}
      </span>

      <span className="font-semibold">{keyword}</span>

      {category && (
        <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-white/70 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border border-slate-200/50 dark:border-slate-700/50">
          {category}
        </span>
      )}

      {importance && (
        <span
          className={`text-[10px] px-1.5 py-0.5 rounded-md border font-semibold ${getImportanceBadge(
            importance
          )}`}
        >
          {importance}
        </span>
      )}
    </motion.div>
  );
}
