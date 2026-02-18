# pull-plan-calendar

React calendar with **day**, **week**, **month**, and **year** views. Supports task/event scheduling, drag-and-drop in the week view (move and resize events), optional task modals, and controlled or uncontrolled usage.

---

## Install

```bash
pnpm add pull-plan-calendar
# or
npm install pull-plan-calendar
# or
yarn add pull-plan-calendar
```

**Peer dependencies** (install if you don’t have them):

```bash
pnpm add react react-dom @dnd-kit/core dayjs
```

**Styles** — import the library CSS once in your app (e.g. in your root layout or `_app.tsx`):

```ts
import "pull-plan-calendar/dist/calendar.css";
```

---

## Usage

```tsx
import { Calendar } from "pull-plan-calendar";
import "pull-plan-calendar/dist/calendar.css";

export default function App() {
  return (
    <Calendar
      defaultView="week"
      defaultEvents={[
        {
          id: "1",
          title: "Meeting",
          start: "2025-02-18T10:00:00",
          end: "2025-02-18T11:00:00",
        },
      ]}
      onEventMove={async (payload) => {
        console.log("Moved", payload);
      }}
      onEventResize={async (payload) => {
        console.log("Resized", payload);
      }}
    />
  );
}
```

Use **controlled** mode with `events`, `date`, `view`, and `onEventsChange` / `onDateChange` / `onViewChange`. Use **uncontrolled** mode with `defaultEvents`, `defaultDate`, `defaultView`. Set `readOnly={true}` to disable drag, resize, and create.

---

## Notes

- **Views:** The main `<Calendar />` switches between day, week, month, and year. You can also use `<DayView />`, `<WeekView />`, `<MonthView />`, `<YearView />` directly with the same props pattern.
- **Week view:** Events can be dragged horizontally and resized (left/right handles). Dragging past the week edges moves to the previous/next week. Overlapping events are laid out in separate rows.
- **Types:** The package is written in TypeScript and exports types (e.g. `CalendarEvent`, `CalendarProps`, `WeekViewProps`). Use them for props and callbacks.
- **Task modals:** Pass `mapFromEvent` to map a calendar event to your task shape and show `<TaskModal />` on click. Use `CreateTaskModal` and the `+` button in the week view for creating events.
- **Helpers:** Exports like `mapTaskToEvent`, `mapEventToTask`, `getEventsForWeek`, `getTaskColorHex` help wire the calendar to your own data and colors.
