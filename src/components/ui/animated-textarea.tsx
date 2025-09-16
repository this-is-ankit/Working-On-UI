import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from './utils';

interface AnimatedTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function AnimatedTextarea({ label, error, className, ...props }: AnimatedTextareaProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    setIsFocused(false);
    setHasValue(e.target.value.length > 0);
    props.onBlur?.(e);
  };

  return (
    <div className="relative">
      <motion.div
        className="relative"
        whileFocus={{ scale: 1.01 }}
        transition={{ duration: 0.2 }}
      >
        <textarea
          {...props}
          className={cn(
            "w-full px-4 py-3 text-gray-700 bg-white border-2 border-gray-200 rounded-xl transition-all duration-300 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 focus:outline-none placeholder-transparent peer resize-none min-h-[100px]",
            error && "border-red-300 focus:border-red-400 focus:ring-red-100",
            className
          )}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder=" "
        />
        {label && (
          <motion.label
            className={cn(
              "absolute left-4 transition-all duration-300 pointer-events-none",
              isFocused || hasValue || props.value
                ? "top-2 text-xs text-blue-600 font-medium"
                : "top-3 text-base text-gray-500"
            )}
            animate={{
              y: isFocused || hasValue || props.value ? -8 : 0,
              scale: isFocused || hasValue || props.value ? 0.85 : 1,
            }}
            transition={{ duration: 0.2 }}
          >
            {label}
          </motion.label>
        )}
        <motion.div
          className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-green-500"
          initial={{ width: 0 }}
          animate={{ width: isFocused ? "100%" : 0 }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-sm text-red-600"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}