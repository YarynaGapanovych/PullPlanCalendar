"use client";

import {
  CalendarContainer,
  mapTaskToEvent,
  mapEventToTask,
} from "src";
import { getMockScheduledTasks, getMockUnscheduledTasks } from "@/app/mocks/tasks";
import { MOCK_AREAS } from "@/app/mocks/areas";

export default function Home() {
  return (
    <div>
      <main className="w-full max-w-7xl mx-auto mt-12">
        <CalendarContainer
          showSwitcher={true}
          showTabs={true}
          areas={MOCK_AREAS}
          initialScheduledEvents={getMockScheduledTasks().map(mapTaskToEvent)}
          initialUnscheduledEvents={getMockUnscheduledTasks().map(mapTaskToEvent)}
          mapFromEvent={mapEventToTask}
        />
      </main>
    </div>
  );
}
