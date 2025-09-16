import React from "react";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react"; // ✅ Correct fix
import { cn } from "./utils";

interface StatsCardProps {
  title: string;
  value: number;
  unit?: string;
  description: string;
  icon: LucideIcon; // ✅ Correct usage of type
  color: "blue" | "green" | "purple" | "teal" | "orange";
  delay?: number;
}

const colorVariants = {
  blue: {
    bg: "from-blue-50 to-blue-100",
    icon: "text-blue-600",
    value: "text-blue-700",
    description: "text-blue-600",
  },
  green: {
    bg: "from-green-50 to-green-100",
    icon: "text-green-600",
    value: "text-green-700",
    description: "text-green-600",
  },
  purple: {
    bg: "from-purple-50 to-purple-100",
    icon: "text-purple-600",
    value: "text-purple-700",
    description: "text-purple-600",
  },
  teal: {
    bg: "from-teal-50 to-teal-100",
    icon: "text-teal-600",
    value: "text-teal-700",
    description: "text-teal-600",
  },
  orange: {
    bg: "from-orange-50 to-orange-100",
    icon: "text-orange-600",
    value: "text-orange-700",
    description: "text-orange-600",
  },
};

export function StatsCard({
  title,
  value,
  unit,
  description,
  icon: Icon,
  color,
  delay = 0,
}: StatsCardProps) {
  const colors = colorVariants[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.6,
        delay,
        type: "spring",
        stiffness: 100,
      }}
      whileHover={{
        y: -5,
        scale: 1.02,
        boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
      }}
      className={cn(
        "bg-gradient-to-br rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/50",
        colors.bg
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-700">{title}</h3>
        <motion.div
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.6 }}
        >
          <Icon className={cn("h-6 w-6", colors.icon)} />
        </motion.div>
      </div>

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: delay + 0.3, duration: 0.5, type: "spring" }}
        className={cn("text-3xl font-bold mb-2", colors.value)}
      >
        {value.toLocaleString()}
        {unit && ` ${unit}`}
      </motion.div>

      <p className={cn("text-sm", colors.description)}>{description}</p>
    </motion.div>
  );
}
