import React from 'react';
import { motion } from 'framer-motion';
import { cn } from './utils';

interface AnimatedBadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  className?: string;
}

export function AnimatedBadge({ children, variant = 'default', className }: AnimatedBadgeProps) {
  const variants = {
    default: "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-blue-300",
    success: "bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-green-300",
    warning: "bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border-yellow-300",
    error: "bg-gradient-to-r from-red-100 to-red-200 text-red-800 border-red-300",
    info: "bg-gradient-to-r from-teal-100 to-teal-200 text-teal-800 border-teal-300"
  };

  return (
    <motion.span
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border shadow-sm",
        variants[variant],
        className
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.span>
  );
}