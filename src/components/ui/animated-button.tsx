import React from 'react';
import { motion } from 'framer-motion';
import { cn } from './utils';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost';
type Size = 'sm' | 'default' | 'lg';

/**
 * Use the exact prop type of motion.button so spreading ...props
 * doesn't produce TypeScript errors.
 */
type MotionButtonProps = React.ComponentProps<typeof motion.button>;

export interface AnimatedButtonProps extends Omit<MotionButtonProps, 'ref'> {
  variant?: Variant;
  size?: Size;
  children: React.ReactNode;
}

export function AnimatedButton({
  variant = 'primary',
  size = 'default',
  className,
  children,
  ...props
}: AnimatedButtonProps) {
  const baseClasses =
    "relative overflow-hidden font-medium transition-all duration-300 rounded-xl border-2 focus:outline-none focus:ring-4 focus:ring-opacity-50";

  const variants = {
    primary:
      "bg-gradient-to-r from-blue-500 to-green-500 text-white border-transparent hover:from-blue-600 hover:to-green-600 focus:ring-blue-300 shadow-lg hover:shadow-xl",
    secondary:
      "bg-white text-blue-600 border-blue-200 hover:bg-blue-50 hover:border-blue-300 focus:ring-blue-300 shadow-md hover:shadow-lg",
    outline:
      "bg-transparent text-blue-600 border-blue-300 hover:bg-blue-50 hover:border-blue-400 focus:ring-blue-300",
    ghost:
      "bg-transparent text-gray-600 border-transparent hover:bg-gray-100 focus:ring-gray-300",
  } as const;

  const sizes = {
    sm: "px-4 py-2 text-sm",
    default: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  } as const;

  return (
    <motion.button
      className={cn(baseClasses, variants[variant], sizes[size], className)}
      whileHover={{
        scale: 1.05,
        y: -2,
      }}
      whileTap={{ scale: 0.95 }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 17,
      }}
      {...props}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0"
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        aria-hidden
      />
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </motion.button>
  );
}
