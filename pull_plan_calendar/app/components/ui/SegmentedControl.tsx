import React from "react";
import { CalendarViewMode } from "@/app/types/calendar";

export interface SegmentedControlProps {
  value: CalendarViewMode;
  onChange: (value: CalendarViewMode) => void;
  options: Array<{
    label: React.ReactNode;
    value: CalendarViewMode;
  }>;
  className?: string;
}

export const SegmentedControl = ({
  value,
  onChange,
  options,
  className = "",
}: SegmentedControlProps) => {
  return (
    <div
      className={`inline-flex rounded-full border border-gray-200 bg-gray-100 p-1 shadow-sm ${className}`}
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`px-4 py-1.5 text-sm font-medium transition-all duration-200 ${
            value === option.value
              ? "rounded-full bg-white text-gray-900 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};
