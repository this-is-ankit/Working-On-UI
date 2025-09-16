import React from 'react';
import { motion } from 'framer-motion';
import { cn } from './utils';

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  delay?: number;
}

export function AnimatedCard({ children, className, hover = true, delay = 0 }: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.6, 
        delay,
        type: "spring",
        stiffness: 100
      }}
      whileHover={hover ? { 
        y: -8, 
        scale: 1.02,
        boxShadow: "0 20px 40px rgba(0,0,0,0.1)"
      } : {}}
      className={cn(
        "bg-white rounded-2xl border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden",
        className
      )}
    >
      {children}
    </motion.div>
  );
}

export function AnimatedCardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("p-6 pb-4", className)}>
      {children}
    </div>
  );
}

export function AnimatedCardContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("px-6 pb-6", className)}>
      {children}
    </div>
  );
}

export function AnimatedCardTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <h3 className={cn("text-xl font-bold text-gray-800 mb-2", className)}>
      {children}
    </h3>
  );
}

export function AnimatedCardDescription({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn("text-gray-600 leading-relaxed", className)}>
      {children}
    </p>
  );
}