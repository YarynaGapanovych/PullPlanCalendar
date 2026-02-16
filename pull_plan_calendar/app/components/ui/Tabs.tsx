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
  className = "",
  items,
}: TabsProps) => {
  return (
    <div className={className}>
      <div className="mb-0">
        <div className="flex gap-1">
          {items.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => onChange(item.key)}
              className={`px-4 py-2 rounded-t-lg transition ${
                activeKey === item.key
                  ? "bg-white shadow-md border-t border-l border-r border-gray-200"
                  : "hover:bg-gray-100"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-0">
        {items.find((item) => item.key === activeKey)?.children}
      </div>
    </div>
  );
};
