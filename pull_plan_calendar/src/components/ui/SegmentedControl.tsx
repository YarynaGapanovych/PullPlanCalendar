import React from "react";
import type { CalendarViewMode } from "../../types/calendar";

export interface SegmentedControlProps {
  value: CalendarViewMode;
  onChange: (value: CalendarViewMode) => void;
  options: Array<{
    label: React.ReactNode;
    value: CalendarViewMode;
    className?: string;
  }>;
  className?: string;
  /** Applied to every option button. */
  buttonClassName?: string;
}

export const SegmentedControl = ({
  value,
  onChange,
  options,
  className,
  buttonClassName,
}: SegmentedControlProps) => {
  return (
    <div data-slot="segmented-control" role="tablist" className={className}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          role="tab"
          aria-selected={value === option.value}
          data-slot="segmented-control-option"
          data-value={option.value}
          className={[buttonClassName, option.className]
            .filter(Boolean)
            .join(" ")}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};
