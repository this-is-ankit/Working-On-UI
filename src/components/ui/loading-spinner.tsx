import React from "react";
import { motion } from "framer-motion";

// ✅ Add this if you don’t already have a cn utility
function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  color?: "blue" | "green" | "white";
}

export function LoadingSpinner({
  size = "md",
  color = "blue",
}: LoadingSpinnerProps) {
  const sizes = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  const colors = {
    blue: "border-blue-600",
    green: "border-green-600",
    white: "border-white",
  };

  return (
    <motion.div
      className={cn(
        "border-2 border-t-transparent rounded-full",
        sizes[size],
        colors[color]
      )}
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: "linear",
      }}
    />
  );
}
