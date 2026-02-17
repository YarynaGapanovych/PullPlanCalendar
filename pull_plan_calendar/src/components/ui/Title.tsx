import React from "react";

export interface TitleProps {
  level?: 1 | 2 | 3 | 4 | 5;
  children: React.ReactNode;
  className?: string;
}

const TAG = { 1: "h1", 2: "h2", 3: "h3", 4: "h4", 5: "h5" } as const;

export const Title = ({ level = 4, children, className }: TitleProps) => {
  const Comp = TAG[level];
  return (
    <Comp data-slot="title" data-level={level} className={className}>
      {children}
    </Comp>
  );
};
