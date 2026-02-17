import React from "react";

export interface TextProps {
  children: React.ReactNode;
  className?: string;
}

export const Text = ({ children, className }: TextProps) => {
  return (
    <span data-slot="text" className={className}>
      {children}
    </span>
  );
};
