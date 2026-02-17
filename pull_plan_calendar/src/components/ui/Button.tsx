import React from "react";

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "type"> {
  type?: "button" | "submit" | "reset" | "text" | "primary" | "link";
  size?: "small" | "middle" | "large";
  shape?: "circle" | "round" | "default";
  children: React.ReactNode;
}

export const Button = ({
  type = "button",
  children,
  className,
  ...rest
}: ButtonProps) => {
  const htmlType =
    type === "text" || type === "link" || type === "primary" ? "button" : type;
  return (
    <button
      type={htmlType}
      data-slot="button"
      data-variant={type}
      className={className}
      {...rest}
    >
      {children}
    </button>
  );
};
