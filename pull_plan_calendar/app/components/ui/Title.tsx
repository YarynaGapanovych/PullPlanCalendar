import React from "react";

export interface TitleProps {
  level?: 1 | 2 | 3 | 4 | 5;
  children: React.ReactNode;
  className?: string;
}

export const Title = ({ level = 4, children, className = "" }: TitleProps) => {
  const sizeClasses = {
    1: "text-4xl",
    2: "text-3xl",
    3: "text-2xl",
    4: "text-xl",
    5: "text-lg",
  };

  return (
    <h4
      className={`font-semibold text-gray-900 ${sizeClasses[level]} ${className}`}
    >
      {children}
    </h4>
  );
};
