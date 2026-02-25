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
          mapFromEvent={mapEventToTask}
        />
      </main>
    </div>
  );
}
