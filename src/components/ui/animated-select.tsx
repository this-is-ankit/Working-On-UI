import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from './utils';

interface Option {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface AnimatedSelectProps {
  options: Option[];
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  className?: string;
}

export function AnimatedSelect({ 
  options, 
  value, 
  onValueChange, 
  placeholder = "Select an option",
  label,
  className 
}: AnimatedSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className="relative">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <motion.div
        className={cn(
          "relative w-full cursor-pointer",
          className
        )}
        whileTap={{ scale: 0.98 }}
      >
        <motion.div
          className="w-full px-4 py-3 text-left bg-white border-2 border-gray-200 rounded-xl transition-all duration-300 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 shadow-sm hover:shadow-md"
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ y: -1 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {selectedOption?.icon}
              <span className={cn(
                "text-base",
                selectedOption ? "text-gray-900" : "text-gray-500"
              )}>
                {selectedOption?.label || placeholder}
              </span>
            </div>
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="h-5 w-5 text-gray-400" />
            </motion.div>
          </div>
        </motion.div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden"
            >
              <div className="py-2">
                {options.map((option, index) => (
                  <motion.div
                    key={option.value}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={cn(
                      "px-4 py-3 cursor-pointer transition-colors duration-200 flex items-center gap-2",
                      "hover:bg-blue-50 hover:text-blue-700",
                      value === option.value && "bg-blue-100 text-blue-800 font-medium"
                    )}
                    onClick={() => {
                      onValueChange(option.value);
                      setIsOpen(false);
                    }}
                  >
                    {option.icon}
                    <span>{option.label}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}