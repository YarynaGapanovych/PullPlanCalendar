"use client";

import { MOCK_AREAS } from "@/app/mocks/areas";
import {
  getMockScheduledTasks,
  getMockUnscheduledTasks,
} from "@/app/mocks/tasks";
import { CalendarContainer, mapEventToTask, mapTaskToEvent } from "src";

export default function Home() {
  return (
    <div>
      <main className="w-full max-w-7xl mx-auto mt-12">
        <CalendarContainer
          showSwitcher={true}
          showTabs={true}
          views={["week", "year", "day", "month"]}
          areas={MOCK_AREAS}
          defaultScheduledEvents={getMockScheduledTasks().map(mapTaskToEvent)}
          defaultUnscheduledEvents={getMockUnscheduledTasks().map(
            mapTaskToEvent,
          )}
          onEventMove={async () => {}}
          onEventResize={async () => {}}
          onEventCreate={async () => {}}
          onEventClick={async () => {}}
          onDateClick={async () => {}}
          readOnly={false}
          mapFromEvent={mapEventToTask}
          previousDayButtonContent="←"
          nextDayButtonContent="→"
          previousWeekButtonContent="←"
          nextWeekButtonContent="→"
          previousMonthButtonContent="←"
          nextMonthButtonContent="→"
          previousYearButtonContent="←"
          nextYearButtonContent="→"
          viewSwitcherClassName=""
          viewSwitcherButtonClassName=""
          // Optional custom components (uncomment and pass your components):
          // AddEventButton={CustomAddEventButton}
          // CreateEventModal={CustomCreateEventModal}
          // EventActionButton={CustomEventActionButton}
          // EventDetailModal={CustomEventDetailModal}
        />
      </main>
    </div>
  );
}
