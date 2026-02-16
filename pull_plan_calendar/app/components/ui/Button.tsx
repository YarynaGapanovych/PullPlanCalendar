import React from "react";

export interface ButtonProps {
  type?: "text" | "primary" | "link" | "button" | "submit";
  size?: "small" | "middle" | "large";
  shape?: "circle" | "round" | "default";
  onClick?: (e: React.MouseEvent) => void;
  onMouseDown?: (e: React.MouseEvent) => void;
  children: React.ReactNode;
  className?: string;
}

export const Button = ({
  type = "button",
  size = "middle",
  shape = "default",
  onClick,
  onMouseDown,
  children,
  className = "",
}: ButtonProps) => {
  const sizeClasses = {
    small: "px-2 py-1 text-xs",
    middle: "px-3 py-1.5 text-sm",
    large: "px-4 py-2 text-base",
  };

  const shapeClasses = {
    circle: "rounded-full",
    round: "rounded-full",
    default: "rounded",
  };

  const typeClasses = {
    text: "bg-transparent border-none text-gray-700 hover:text-gray-900",
    primary: "bg-blue-600 text-white hover:bg-blue-700 border border-blue-600",
    link: "bg-transparent border-none text-blue-600 hover:text-blue-700",
    button:
      "bg-gray-200 text-gray-900 hover:bg-gray-300 border border-gray-300",
    submit: "bg-blue-600 text-white hover:bg-blue-700 border border-blue-600",
  };

  return (
    <button
      type={
        type === "text" || type === "link" || type === "primary"
          ? "button"
          : type
      }
      onClick={onClick}
      onMouseDown={onMouseDown}
      className={`inline-flex items-center justify-center ${sizeClasses[size]} ${shapeClasses[shape]} ${typeClasses[type]} focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${className}`}
    >
      {children}
    </button>
  );
};
