import React from "react";

export interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card = ({ children, className = "" }: CardProps) => {
  return (
    <div className={`bg-white border border-gray-200 rounded-lg ${className}`}>
      {children}
    </div>
  );
};
