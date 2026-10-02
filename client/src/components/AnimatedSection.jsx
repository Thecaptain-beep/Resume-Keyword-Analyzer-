import React from 'react';
import { motion } from 'framer-motion';
import { fadeUp } from '../utils/animations';

export default function AnimatedSection({
  children,
  className = '',
  variants = fadeUp,
  delay = 0,
  viewportOnce = true
}) {
  return (
    <motion.div
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: viewportOnce, margin: '-40px' }}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
