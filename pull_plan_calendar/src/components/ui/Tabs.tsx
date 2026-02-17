import React from "react";

export interface TabsProps {
  activeKey: string;
  onChange: (key: string) => void;
  className?: string;
  items: Array<{
    key: string;
    label: React.ReactNode;
    children: React.ReactNode;
  }>;
}

export const Tabs = ({
  activeKey,
  onChange,
  className,
  items,
}: TabsProps) => {
  return (
    <div data-slot="tabs" className={className}>
      <div data-slot="tabs-list">
        {items.map((item) => (
          <button
            key={item.key}
            type="button"
            role="tab"
            aria-selected={activeKey === item.key}
            data-slot="tabs-trigger"
            data-value={item.key}
            onClick={() => onChange(item.key)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div data-slot="tabs-content">
        {items.find((item) => item.key === activeKey)?.children}
      </div>
    </div>
  );
};
