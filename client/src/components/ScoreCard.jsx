import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getScoreColor } from '../utils/formatters';

export default function ScoreCard({ score = 0, tier = '', subtitle = '' }) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const numericScore = Math.min(100, Math.max(0, Number(score) || 0));
  const style = getScoreColor(numericScore);

  // SVG Gauge calculations
  const size = 200;
  const strokeWidth = 14;
  const center = size / 2;
  const radius = center - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * animatedScore) / 100;

  useEffect(() => {
    let start = 0;
    const duration = 1000;
    const stepTime = 16;
    const totalSteps = duration / stepTime;
    const stepValue = (numericScore - start) / totalSteps;

    let current = start;
    let stepCount = 0;

    const timer = setInterval(() => {
      stepCount++;
      current += stepValue;
      if (stepCount >= totalSteps) {
        setAnimatedScore(numericScore);
        clearInterval(timer);
      } else {
        setAnimatedScore(current);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [numericScore]);

  return (
    <div className={`p-8 rounded-3xl border ${style.border} ${style.bg} backdrop-blur-md text-center flex flex-col items-center justify-center transition-all duration-500 shadow-sm`}>
      <div className="relative flex items-center justify-center">
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle track */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-slate-200/60 dark:text-slate-800"
          />
          {/* Animated score circle */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className={`${style.ring} transition-all duration-300 ease-out`}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex items-baseline"
          >
            <span className={`text-5xl font-black tracking-tight ${style.text}`}>
              {animatedScore.toFixed(1)}
            </span>
            <span className={`text-2xl font-bold ml-0.5 ${style.text}`}>%</span>
          </motion.div>
          <span className="text-xs uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400 mt-1">
            Match Score
          </span>
        </div>
      </div>

      {tier && (
        <div className="mt-5">
          <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border shadow-sm ${style.badge}`}>
            {tier}
          </span>
        </div>
      )}

      {subtitle && (
        <p className="mt-3 text-xs text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}
