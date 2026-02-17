"use client";

import Calendar from "../components/Calendar";
import { Card } from "../components/ui/Card";
import { Tabs } from "../components/ui/Tabs";
import type {
  CalendarViewMode,
  CalendarEvent,
  CalendarEventMovePayload,
  CalendarEventResizePayload,
  CalendarEventCreatePayload,
} from "../types/calendar";
import type { Area, Task } from "../types/task";
import type { Dayjs } from "dayjs";
import { useState } from "react";

const ALL_VIEWS: CalendarViewMode[] = ["day", "week", "month", "year"];

/**
 * Optional demo/helper: tabbed wrapper that renders one Calendar per "area".
 * Calendar itself is area-agnostic; use this only for demos or app-specific tab UIs.
 */
export interface CalendarContainerProps {
  showSwitcher?: boolean;
  showTabs?: boolean;
  views?: CalendarViewMode[];
  /** Areas to show as tabs. When empty and showTabs is true, a single calendar is shown without tabs. */
  areas?: Area[];
  /** Initial scheduled events. */
  initialScheduledEvents?: CalendarEvent[];
  /** Initial unscheduled events. */
  initialUnscheduledEvents?: CalendarEvent[];
  onEventMove?: (payload: CalendarEventMovePayload) => Promise<void>;
  onEventResize?: (payload: CalendarEventResizePayload) => Promise<void>;
  onEventCreate?: (payload: CalendarEventCreatePayload) => Promise<void>;
  onEventClick?: (event: CalendarEvent) => Promise<void>;
  onDateClick?: (date: Dayjs, view: CalendarViewMode) => Promise<void>;
  readOnly?: boolean;
  /** Optional: map event → task for TaskModal (e.g. mapEventToTask). */
  mapFromEvent?: (event: CalendarEvent) => Task;
}

export default function CalendarContainer({
  showSwitcher,
  showTabs = true,
  views = ALL_VIEWS,
  areas = [],
  initialScheduledEvents = [],
  initialUnscheduledEvents = [],
  onEventMove,
  onEventResize,
  onEventCreate,
  onEventClick,
  onDateClick,
  readOnly = false,
  mapFromEvent,
}: CalendarContainerProps) {
  const effectiveAreas =
    areas.length > 0 ? areas : [{ id: "", name: "Calendar" } as Area];
  const [activeTab, setActiveTab] = useState<string>(
    () => effectiveAreas[0]?.id ?? "",
  );

  if (!showTabs || effectiveAreas.length <= 1) {
    return (
      <div data-slot="calendar-container">
        <Card>
          <Calendar
            showSwitcher={showSwitcher}
            views={views}
            initialScheduledEvents={initialScheduledEvents}
            initialUnscheduledEvents={initialUnscheduledEvents}
            onEventMove={onEventMove}
            onEventResize={onEventResize}
            onEventCreate={onEventCreate}
            onEventClick={onEventClick}
            onDateClick={onDateClick}
            readOnly={readOnly}
            mapFromEvent={mapFromEvent}
          />
        </Card>
      </div>
    );
  }

  return (
    <div data-slot="calendar-container" data-tabs>
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={effectiveAreas.map((area: Area) => ({
          key: area.id,
          label: <span data-slot="tab-label" data-area-id={area.id}>{area.name}</span>,
          children: (
            <Card>
              <Calendar
                showSwitcher={showSwitcher}
                views={views}
                initialScheduledEvents={initialScheduledEvents}
                initialUnscheduledEvents={initialUnscheduledEvents}
                onEventMove={onEventMove}
                onEventResize={onEventResize}
                onEventCreate={onEventCreate}
                onEventClick={onEventClick}
                onDateClick={onDateClick}
                readOnly={readOnly}
                mapFromEvent={mapFromEvent}
              />
            </Card>
          ),
        }))}
      />
    </div>
  );
}
