import React from "react";

export interface TooltipProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export const Tooltip = ({ title, children, className }: TooltipProps) => {
  return (
    <div data-slot="tooltip" className={className} title={title}>
      {children}
    </div>
  );
};
