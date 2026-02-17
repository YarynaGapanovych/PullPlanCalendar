import React from "react";

export interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card = ({ children, className }: CardProps) => {
  return (
    <div data-slot="card" className={className}>
      {children}
    </div>
  );
};
