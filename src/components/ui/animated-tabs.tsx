import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from './utils';

interface Tab {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface AnimatedTabsProps {
  tabs: Tab[];
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

export function AnimatedTabs({ tabs, value, onValueChange, children, className }: AnimatedTabsProps) {
  return (
    <div className={cn("w-full", className)}>
      <div className="relative">
        <div className="flex bg-gray-100 rounded-2xl p-1 mb-6">
          {tabs.map((tab) => (
            <motion.button
              key={tab.value}
              className={cn(
                "relative flex-1 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 flex items-center justify-center gap-2",
                value === tab.value
                  ? "text-blue-700"
                  : "text-gray-600 hover:text-gray-800"
              )}
              onClick={() => onValueChange(tab.value)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {value === tab.value && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-white rounded-xl shadow-md"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                {tab.icon}
                {tab.label}
              </span>
            </motion.button>
          ))}
        </div>
      </div>
      
      <motion.div
        key={value}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
    </div>
  );
}