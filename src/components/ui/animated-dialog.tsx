import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from './utils';

interface AnimatedDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
}

export function AnimatedDialog({ open, onOpenChange, children, className }: AnimatedDialogProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm"
            onClick={() => onOpenChange(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={cn(
              "fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto",
              className
            )}
          >
            <button
              onClick={() => onOpenChange(false)}
              className="absolute right-4 top-4 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 z-10"
            >
              <X className="h-4 w-4 text-gray-500" />
            </button>
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export function AnimatedDialogHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("p-6 pb-4", className)}>
      {children}
    </div>
  );
}

export function AnimatedDialogContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("px-6 pb-6", className)}>
      {children}
    </div>
  );
}

export function AnimatedDialogTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <h2 className={cn("text-2xl font-bold text-gray-800 mb-2", className)}>
      {children}
    </h2>
  );
}

export function AnimatedDialogDescription({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn("text-gray-600", className)}>
      {children}
    </p>
  );
}