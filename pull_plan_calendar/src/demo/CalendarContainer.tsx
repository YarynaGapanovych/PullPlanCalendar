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
import type { CreateTaskModalProps } from "../components/tasks/CreateTaskModal";
import type { TaskModalProps } from "../components/tasks/TaskModal";
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
  /** Initial scheduled events (uncontrolled). */
  defaultScheduledEvents?: CalendarEvent[];
  /** Initial unscheduled events (uncontrolled). */
  defaultUnscheduledEvents?: CalendarEvent[];
  onEventMove?: (payload: CalendarEventMovePayload) => Promise<void>;
  onEventResize?: (payload: CalendarEventResizePayload) => Promise<void>;
  onEventCreate?: (payload: CalendarEventCreatePayload) => Promise<void>;
  onEventClick?: (event: CalendarEvent) => Promise<void>;
  onDateClick?: (date: Dayjs, view: CalendarViewMode) => Promise<void>;
  readOnly?: boolean;
  /** Optional: map event → task for TaskModal (e.g. mapEventToTask). */
  mapFromEvent?: (event: CalendarEvent) => Task;
  /** Custom "add event" button (day view); receives onClick. If not set, default "+" is used. */
  AddEventButton?: React.ComponentType<{ onClick: () => void }>;
  /** Custom create-event modal (day view). If not set, default CreateTaskModal is used. */
  CreateEventModal?: React.ComponentType<CreateTaskModalProps>;
  /** Custom button to open event details (day view). Receives event and onOpen. */
  EventActionButton?: React.ComponentType<{
    event: CalendarEvent;
    onOpen: () => void;
  }>;
  /** Custom modal for viewing event details (day view). If not set, default TaskModal is used. */
  EventDetailModal?: React.ComponentType<TaskModalProps>;
  /** Content for day view "previous day" nav button. Default: ← */
  previousDayButtonContent?: React.ReactNode;
  /** Content for day view "next day" nav button. Default: → */
  nextDayButtonContent?: React.ReactNode;
  /** Content for week view "previous week" nav button. Default: ← */
  previousWeekButtonContent?: React.ReactNode;
  /** Content for week view "next week" nav button. Default: → */
  nextWeekButtonContent?: React.ReactNode;
  /** Content for month view "previous month" nav button. Default: ← */
  previousMonthButtonContent?: React.ReactNode;
  /** Content for month view "next month" nav button. Default: → */
  nextMonthButtonContent?: React.ReactNode;
  /** Content for year view "previous year" nav button. Default: ← */
  previousYearButtonContent?: React.ReactNode;
  /** Content for year view "next year" nav button. Default: → */
  nextYearButtonContent?: React.ReactNode;
  /** Class name for the view switcher (SegmentedControl container). */
  viewSwitcherClassName?: string;
  /** Class name for each view switcher option button. */
  viewSwitcherButtonClassName?: string;
}

export default function CalendarContainer({
  showSwitcher,
  showTabs = true,
  views = ALL_VIEWS,
  areas = [],
  defaultScheduledEvents = [],
  defaultUnscheduledEvents = [],
  onEventMove,
  onEventResize,
  onEventCreate,
  onEventClick,
  onDateClick,
  readOnly = false,
  mapFromEvent,
  AddEventButton,
  CreateEventModal,
  EventActionButton,
  EventDetailModal,
  previousDayButtonContent,
  nextDayButtonContent,
  previousWeekButtonContent,
  nextWeekButtonContent,
  previousMonthButtonContent,
  nextMonthButtonContent,
  previousYearButtonContent,
  nextYearButtonContent,
  viewSwitcherClassName,
  viewSwitcherButtonClassName,
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
            defaultScheduledEvents={defaultScheduledEvents}
            defaultUnscheduledEvents={defaultUnscheduledEvents}
            onEventMove={onEventMove}
            onEventResize={onEventResize}
            onEventCreate={onEventCreate}
            onEventClick={onEventClick}
            onDateClick={onDateClick}
            readOnly={readOnly}
            mapFromEvent={mapFromEvent}
            AddEventButton={AddEventButton}
            CreateEventModal={CreateEventModal}
            EventActionButton={EventActionButton}
            EventDetailModal={EventDetailModal}
            previousDayButtonContent={previousDayButtonContent}
            nextDayButtonContent={nextDayButtonContent}
            previousWeekButtonContent={previousWeekButtonContent}
            nextWeekButtonContent={nextWeekButtonContent}
            previousMonthButtonContent={previousMonthButtonContent}
            nextMonthButtonContent={nextMonthButtonContent}
            previousYearButtonContent={previousYearButtonContent}
            nextYearButtonContent={nextYearButtonContent}
            viewSwitcherClassName={viewSwitcherClassName}
            viewSwitcherButtonClassName={viewSwitcherButtonClassName}
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
                defaultScheduledEvents={defaultScheduledEvents}
                defaultUnscheduledEvents={defaultUnscheduledEvents}
                onEventMove={onEventMove}
                onEventResize={onEventResize}
                onEventCreate={onEventCreate}
                onEventClick={onEventClick}
                onDateClick={onDateClick}
                readOnly={readOnly}
                mapFromEvent={mapFromEvent}
                AddEventButton={AddEventButton}
                CreateEventModal={CreateEventModal}
                EventActionButton={EventActionButton}
                EventDetailModal={EventDetailModal}
                previousDayButtonContent={previousDayButtonContent}
                nextDayButtonContent={nextDayButtonContent}
                previousWeekButtonContent={previousWeekButtonContent}
                nextWeekButtonContent={nextWeekButtonContent}
                previousMonthButtonContent={previousMonthButtonContent}
                nextMonthButtonContent={nextMonthButtonContent}
                previousYearButtonContent={previousYearButtonContent}
                nextYearButtonContent={nextYearButtonContent}
                viewSwitcherClassName={viewSwitcherClassName}
                viewSwitcherButtonClassName={viewSwitcherButtonClassName}
              />
            </Card>
          ),
        }))}
      />
    </div>
  );
}
