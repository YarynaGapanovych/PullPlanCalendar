"use client";

import Calendar from "@/app/components/Calendar";
import { Card } from "@/app/components/ui/Card";
import { Tabs } from "@/app/components/ui/Tabs";
import { MOCK_AREAS } from "@/app/mocks/areas";
import { CalendarViewMode } from "@/app/types/calendar";
import { Area } from "@/app/types/task";
import { useState } from "react";

const ALL_VIEWS: CalendarViewMode[] = ["day", "week", "month", "year"];

interface CalendarViewProps {
  showSwitcher?: boolean;
  showTabs?: boolean;
  /** Which view modes to show (Daily, Weekly, Monthly, Yearly). Default: all. */
  views?: CalendarViewMode[];
}

export default function CalendarContainer({
  showSwitcher,
  showTabs = true,
  views = ALL_VIEWS,
}: CalendarViewProps) {
  const areas = MOCK_AREAS;
  const [activeTab, setActiveTab] = useState<string>(() => areas[0]?.id ?? "");
  const areaId = (activeTab || areas[0]?.id) ?? "";

  if (!showTabs) {
    return (
      <div className="py-4">
        <Card className="relative px-4 bg-white border rounded-lg">
          <Calendar
            showSwitcher={showSwitcher}
            areaId={areaId}
            views={views}
          />
        </Card>
      </div>
    );
  }

  return (
    <div className="py-4">
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        className="p-2"
        items={areas.map((area: Area) => ({
          key: area.id,
          label: (
            <div
              className={`px-4 py-2 rounded-t-lg transition ${
                activeTab === area.id
                  ? "bg-white shadow-md"
                  : "hover:bg-gray-100"
              }`}
            >
              {area.name}
            </div>
          ),
          children: (
            <Card className="relative px-4 bg-white border rounded-lg">
              <Calendar
                showSwitcher={showSwitcher}
                areaId={activeTab}
                views={views}
              />
            </Card>
          ),
        }))}
      />
    </div>
  );
}
