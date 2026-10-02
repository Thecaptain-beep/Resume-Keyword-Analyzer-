import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function StatCard({
  title,
  value,
  suffix = '',
  decimals = 0,
  icon: Icon,
  colorScheme = 'blue',
  subtitle
}) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const target = Number(value) || 0;
    const duration = 800; // ms
    const stepTime = 16;
    const totalSteps = duration / stepTime;
    const stepValue = (target - start) / totalSteps;

    let current = start;
    let stepCount = 0;

    const timer = setInterval(() => {
      stepCount++;
      current += stepValue;
      if (stepCount >= totalSteps) {
        setDisplayValue(target);
        clearInterval(timer);
      } else {
        setDisplayValue(current);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [value]);

  const colorStyles = {
    blue: {
      bg: 'from-blue-500/10 to-brand-500/5',
      iconBg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
      border: 'hover:border-blue-500/30'
    },
    emerald: {
      bg: 'from-emerald-500/10 to-teal-500/5',
      iconBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
      border: 'hover:border-emerald-500/30'
    },
    amber: {
      bg: 'from-amber-500/10 to-yellow-500/5',
      iconBg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
      border: 'hover:border-amber-500/30'
    },
    purple: {
      bg: 'from-purple-500/10 to-indigo-500/5',
      iconBg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
      border: 'hover:border-purple-500/30'
    }
  };

  const scheme = colorStyles[colorScheme] || colorStyles.blue;

  return (
    <motion.div
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={`relative overflow-hidden p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md shadow-sm hover:shadow-md transition-all ${scheme.border}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold tracking-wider uppercase text-slate-500 dark:text-slate-400">
            {title}
          </p>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {displayValue.toFixed(decimals)}
            </span>
            {suffix && (
              <span className="text-xl font-bold text-slate-500 dark:text-slate-400">
                {suffix}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {subtitle}
            </p>
          )}
        </div>

        {Icon && (
          <div className={`p-3 rounded-xl ${scheme.iconBg}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
    </motion.div>
  );
}
