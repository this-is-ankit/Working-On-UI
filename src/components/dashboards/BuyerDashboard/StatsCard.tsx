import React from "react";
import { StatsCard as BaseStatsCard } from "../../ui/stats-card";
import type { LucideIcon } from "lucide-react"; // ✅ fixed

interface StatsCardProps {
  title: string;
  value: number;
  unit: string;
  description: string;
  icon: LucideIcon; // ✅ correct typing
  color: "green" | "blue" | "purple" | "teal";
}

const colorClasses = {
  green: {
    bg: "from-green-50 to-green-100",
    text: "text-green-600",
    value: "text-green-700",
  },
  blue: {
    bg: "",
    text: "text-blue-600",
    value: "text-blue-700",
  },
  purple: {
    bg: "",
    text: "text-purple-600",
    value: "text-purple-700",
  },
  teal: {
    bg: "",
    text: "text-teal-600",
    value: "text-teal-700",
  },
};

export function StatsCard({
  title,
  value,
  unit,
  description,
  icon: Icon,
  color,
}: StatsCardProps) {
  return (
    <BaseStatsCard
      title={title}
      value={value}
      unit={unit}
      description={description}
      icon={Icon}
      color={color}
    />
  );
}
