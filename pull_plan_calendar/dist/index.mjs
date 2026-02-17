var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};

// src/components/ui/SegmentedControl.tsx
import { jsx } from "react/jsx-runtime";
var SegmentedControl = ({
  value,
  onChange,
  options,
  className
}) => {
  return /* @__PURE__ */ jsx("div", { "data-slot": "segmented-control", role: "tablist", className, children: options.map((option) => /* @__PURE__ */ jsx(
    "button",
    {
      type: "button",
      role: "tab",
      "aria-selected": value === option.value,
      "data-slot": "segmented-control-option",
      "data-value": option.value,
      onClick: () => onChange(option.value),
      children: option.label
    },
    option.value
  )) });
};

// src/components/Calendar.tsx
import { DndContext } from "@dnd-kit/core";
import dayjs9 from "dayjs";
import { useState as useState7 } from "react";

// src/components/ui/Button.tsx
import { jsx as jsx2 } from "react/jsx-runtime";
var Button = (_a) => {
  var _b = _a, {
    type = "button",
    children,
    className
  } = _b, rest = __objRest(_b, [
    "type",
    "children",
    "className"
  ]);
  const htmlType = type === "text" || type === "link" || type === "primary" ? "button" : type;
  return /* @__PURE__ */ jsx2(
    "button",
    __spreadProps(__spreadValues({
      type: htmlType,
      "data-slot": "button",
      "data-variant": type,
      className
    }, rest), {
      children
    })
  );
};

// src/components/ui/Title.tsx
import { jsx as jsx3 } from "react/jsx-runtime";
var TAG = { 1: "h1", 2: "h2", 3: "h3", 4: "h4", 5: "h5" };
var Title = ({ level = 4, children, className }) => {
  const Comp = TAG[level];
  return /* @__PURE__ */ jsx3(Comp, { "data-slot": "title", "data-level": level, className, children });
};

// src/components/ui/Tooltip.tsx
import { jsx as jsx4 } from "react/jsx-runtime";
var Tooltip = ({ title, children, className }) => {
  return /* @__PURE__ */ jsx4("div", { "data-slot": "tooltip", className, title, children });
};

// src/components/DayView.tsx
import dayjs3 from "dayjs";
import { useCallback, useMemo, useState as useState2 } from "react";

// src/components/tasks/CreateTaskModal.tsx
import dayjs from "dayjs";
import { useState } from "react";
import { jsx as jsx5, jsxs } from "react/jsx-runtime";
function CreateTaskModal({
  isOpen,
  onClose,
  areaId,
  onSubmit,
  className
}) {
  const [taskName, setTaskName] = useState("");
  const [startDate, setStartDate] = useState(dayjs());
  const [endDate, setEndDate] = useState(dayjs().add(1, "day"));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (onSubmit) {
        await onSubmit({ name: taskName, startDate, endDate });
      } else {
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
      setTaskName("");
      setStartDate(dayjs());
      setEndDate(dayjs().add(1, "day"));
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleCancel = () => {
    setTaskName("");
    setStartDate(dayjs());
    setEndDate(dayjs().add(1, "day"));
    onClose();
  };
  if (!isOpen) return null;
  return /* @__PURE__ */ jsxs("div", { "data-slot": "create-task-modal", role: "dialog", "aria-modal": "true", "aria-labelledby": "create-task-title", className, children: [
    /* @__PURE__ */ jsx5("div", { "data-slot": "create-task-modal-backdrop", onClick: handleCancel, "aria-hidden": true }),
    /* @__PURE__ */ jsxs("div", { "data-slot": "create-task-modal-content", children: [
      /* @__PURE__ */ jsxs("div", { "data-slot": "create-task-modal-header", children: [
        /* @__PURE__ */ jsx5("h2", { id: "create-task-title", "data-slot": "create-task-modal-title", children: "Create New Task" }),
        /* @__PURE__ */ jsx5("button", { type: "button", onClick: handleCancel, "aria-label": "Close", children: "\xD7" })
      ] }),
      /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, "data-slot": "create-task-form", children: [
        /* @__PURE__ */ jsxs("div", { "data-slot": "create-task-fields", children: [
          /* @__PURE__ */ jsx5("label", { htmlFor: "taskName", children: "Task Name" }),
          /* @__PURE__ */ jsx5(
            "input",
            {
              id: "taskName",
              type: "text",
              value: taskName,
              onChange: (e) => setTaskName(e.target.value),
              required: true,
              placeholder: "Enter task name",
              "data-slot": "create-task-name"
            }
          ),
          /* @__PURE__ */ jsx5("label", { htmlFor: "startDate", children: "Start Date" }),
          /* @__PURE__ */ jsx5(
            "input",
            {
              id: "startDate",
              type: "date",
              value: startDate.format("YYYY-MM-DD"),
              onChange: (e) => setStartDate(dayjs(e.target.value)),
              required: true,
              "data-slot": "create-task-start"
            }
          ),
          /* @__PURE__ */ jsx5("label", { htmlFor: "endDate", children: "End Date" }),
          /* @__PURE__ */ jsx5(
            "input",
            {
              id: "endDate",
              type: "date",
              value: endDate.format("YYYY-MM-DD"),
              onChange: (e) => setEndDate(dayjs(e.target.value)),
              required: true,
              min: startDate.format("YYYY-MM-DD"),
              "data-slot": "create-task-end"
            }
          ),
          areaId && /* @__PURE__ */ jsxs("div", { "data-slot": "create-task-area", children: [
            "Area ID: ",
            areaId
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { "data-slot": "create-task-actions", children: [
          /* @__PURE__ */ jsx5("button", { type: "button", onClick: handleCancel, children: "Cancel" }),
          /* @__PURE__ */ jsx5("button", { type: "submit", disabled: isSubmitting || !taskName, children: isSubmitting ? "Creating..." : "Create Task" })
        ] })
      ] })
    ] })
  ] });
}

// src/components/tasks/TaskModal.tsx
import dayjs2 from "dayjs";
import { jsx as jsx6, jsxs as jsxs2 } from "react/jsx-runtime";
function TaskModal({
  task,
  isOpen,
  onClose,
  className
}) {
  if (!isOpen) return null;
  return /* @__PURE__ */ jsxs2("div", { "data-slot": "task-modal", role: "dialog", "aria-modal": "true", "aria-labelledby": "task-modal-title", className, children: [
    /* @__PURE__ */ jsx6("div", { "data-slot": "task-modal-backdrop", onClick: onClose, "aria-hidden": true }),
    /* @__PURE__ */ jsxs2("div", { "data-slot": "task-modal-content", children: [
      /* @__PURE__ */ jsxs2("div", { "data-slot": "task-modal-header", children: [
        /* @__PURE__ */ jsx6("h2", { id: "task-modal-title", "data-slot": "task-modal-title", children: "Task Details" }),
        /* @__PURE__ */ jsx6("button", { type: "button", onClick: onClose, "aria-label": "Close", children: "\xD7" })
      ] }),
      /* @__PURE__ */ jsxs2("div", { "data-slot": "task-modal-body", children: [
        /* @__PURE__ */ jsx6("p", { "data-slot": "task-name", children: task.name }),
        /* @__PURE__ */ jsxs2("p", { "data-slot": "task-start", children: [
          "Start: ",
          dayjs2(task.startDate).format("MMM D, YYYY")
        ] }),
        /* @__PURE__ */ jsxs2("p", { "data-slot": "task-end", children: [
          "End: ",
          dayjs2(task.endDate).format("MMM D, YYYY")
        ] })
      ] }),
      /* @__PURE__ */ jsx6("div", { "data-slot": "task-modal-actions", children: /* @__PURE__ */ jsx6("button", { type: "button", onClick: onClose, children: "Close" }) })
    ] })
  ] });
}

// src/components/DayView.tsx
import { jsx as jsx7, jsxs as jsxs3 } from "react/jsx-runtime";
function DayView({
  startDate,
  setStartDate,
  scheduledEvents,
  unscheduledEvents,
  setScheduledEvents,
  setUnscheduledEvents,
  view,
  onEventMove,
  onEventResize,
  onEventCreate,
  onEventClick,
  onDateClick,
  readOnly = false,
  updateTask = async () => {
  },
  mapFromEvent,
  className,
  style
}) {
  const [isTaskOpen, setIsTaskOpen] = useState2(false);
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState2(false);
  const [selectedEvent, setSelectedEvent] = useState2(null);
  const openTask = () => setIsTaskOpen(true);
  const closeTask = () => {
    setIsTaskOpen(false);
    setSelectedEvent(null);
  };
  const openCreateTask = async () => {
    if (onDateClick) {
      try {
        await onDateClick(startDate, view);
      } catch (e) {
        return;
      }
    }
    setIsCreateTaskOpen(true);
  };
  const closeCreateTask = () => setIsCreateTaskOpen(false);
  const dayTitle = useMemo(
    () => startDate.format("dddd, MMM D, YYYY"),
    [startDate]
  );
  const hours = useMemo(() => Array.from({ length: 24 }, (_, i) => i), []);
  const HOUR_ROW_HEIGHT = 48;
  const eventsForDay = useMemo(() => {
    const dayStart = startDate.startOf("day");
    const dayEnd = startDate.endOf("day");
    return scheduledEvents.filter((event) => {
      const eventStart = dayjs3(event.start).startOf("day");
      const eventEnd = dayjs3(event.end).endOf("day");
      return (eventStart.isSame(dayStart) || eventStart.isBefore(dayEnd)) && (eventEnd.isSame(dayEnd) || eventEnd.isAfter(dayStart));
    });
  }, [scheduledEvents, startDate]);
  const handleOpenEvent = async (event) => {
    if (onEventClick) {
      try {
        await onEventClick(event);
      } catch (e) {
        return;
      }
    }
    setSelectedEvent(event);
    openTask();
  };
  const handlePreviousDay = () => {
    setStartDate(startDate.subtract(1, "day"));
  };
  const handleNextDay = () => {
    setStartDate(startDate.add(1, "day"));
  };
  const handleUnassignedEventDrop = useCallback(
    (event) => {
      const oldStart = dayjs3(event.start);
      const oldEnd = dayjs3(event.end);
      const newStart = startDate.startOf("day");
      const newEnd = startDate.add(1, "days").startOf("day");
      const updatedEvent = __spreadProps(__spreadValues({}, event), {
        start: newStart,
        end: newEnd
      });
      const prevScheduled = [...scheduledEvents];
      const prevUnscheduled = [...unscheduledEvents];
      setScheduledEvents((prev) => [...prev, updatedEvent]);
      setUnscheduledEvents((prev) => prev.filter((ev) => ev.id !== event.id));
      if (onEventMove) {
        (async () => {
          try {
            await onEventMove({
              id: event.id,
              start: newStart,
              end: newEnd,
              oldStart,
              oldEnd,
              view
            });
          } catch (e) {
            setScheduledEvents(prevScheduled);
            setUnscheduledEvents(prevUnscheduled);
          }
        })();
      }
    },
    [startDate, scheduledEvents, setScheduledEvents, setUnscheduledEvents, onEventMove, view]
  );
  const handleCreateSubmit = useCallback(
    async (data) => {
      const id = `event-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const newEvent = {
        id,
        title: data.name,
        start: data.startDate,
        end: data.endDate
      };
      const prevScheduled = [...scheduledEvents];
      setScheduledEvents((prev) => [...prev, newEvent]);
      closeCreateTask();
      if (onEventCreate) {
        try {
          await onEventCreate({
            id: newEvent.id,
            title: newEvent.title,
            start: dayjs3(newEvent.start),
            end: dayjs3(newEvent.end)
          });
        } catch (e) {
          setScheduledEvents(prevScheduled);
        }
      }
    },
    [scheduledEvents, setScheduledEvents, onEventCreate]
  );
  return /* @__PURE__ */ jsxs3("div", { "data-slot": "day-view", className, style, children: [
    /* @__PURE__ */ jsxs3("div", { "data-slot": "day-view-nav", children: [
      /* @__PURE__ */ jsx7(Button, { type: "button", onClick: handlePreviousDay, "aria-label": "Previous day", children: "\u2190" }),
      /* @__PURE__ */ jsx7(Title, { level: 4, children: dayTitle }),
      /* @__PURE__ */ jsx7(Button, { type: "button", onClick: handleNextDay, "aria-label": "Next day", children: "\u2192" })
    ] }),
    /* @__PURE__ */ jsxs3(
      "div",
      {
        "data-slot": "day-view-grid",
        style: {
          display: "grid",
          gridTemplateColumns: "4rem 1fr",
          gridTemplateRows: `repeat(24, ${HOUR_ROW_HEIGHT}px)`
        },
        children: [
          hours.map((hour) => /* @__PURE__ */ jsx7(
            "div",
            {
              "data-slot": "day-hour",
              "data-hour": hour,
              style: { gridRow: hour + 1, minHeight: HOUR_ROW_HEIGHT },
              children: hour === 0 ? "12 AM" : hour < 12 ? `${hour} AM` : hour === 12 ? "12 PM" : `${hour - 12} PM`
            },
            hour
          )),
          /* @__PURE__ */ jsx7(
            "div",
            {
              "data-slot": "day-events",
              style: { gridColumn: 2, gridRow: "1 / -1", minHeight: 24 * HOUR_ROW_HEIGHT },
              children: eventsForDay.length === 0 ? /* @__PURE__ */ jsx7("p", { "data-slot": "day-no-events", children: "No events scheduled" }) : eventsForDay.map((event) => {
                var _a;
                return /* @__PURE__ */ jsxs3(
                  "div",
                  {
                    "data-slot": "event",
                    "data-event-id": event.id,
                    "data-color": (_a = event.color) != null ? _a : void 0,
                    children: [
                      /* @__PURE__ */ jsx7("span", { children: event.title }),
                      /* @__PURE__ */ jsx7(
                        Button,
                        {
                          type: "button",
                          onMouseDown: (e) => e.stopPropagation(),
                          onClick: (e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            handleOpenEvent(event);
                          },
                          "aria-label": `View ${event.title}`,
                          children: "View"
                        }
                      )
                    ]
                  },
                  event.id
                );
              })
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxs3("div", { "data-slot": "unscheduled-list", children: [
      /* @__PURE__ */ jsx7("h3", { "data-slot": "unscheduled-title", children: "Unscheduled events" }),
      !readOnly && /* @__PURE__ */ jsx7(Tooltip, { title: "Add new event", children: /* @__PURE__ */ jsx7(Button, { type: "button", onClick: openCreateTask, "aria-label": "Add event", children: "+" }) }),
      /* @__PURE__ */ jsx7(
        CreateTaskModal,
        {
          isOpen: isCreateTaskOpen,
          onClose: closeCreateTask,
          onSubmit: handleCreateSubmit
        }
      ),
      /* @__PURE__ */ jsx7("div", { "data-slot": "unscheduled-items", children: unscheduledEvents.map((event) => {
        var _a;
        return /* @__PURE__ */ jsx7(
          "div",
          {
            "data-slot": "unscheduled-event",
            "data-event-id": event.id,
            "data-color": (_a = event.color) != null ? _a : void 0,
            draggable: !readOnly,
            onDragEnd: () => {
              if (!readOnly) handleUnassignedEventDrop(event);
            },
            onDoubleClick: () => handleOpenEvent(event),
            children: event.title
          },
          event.id
        );
      }) }),
      unscheduledEvents.length > 0 && !readOnly && /* @__PURE__ */ jsx7("p", { "data-slot": "unscheduled-hint", children: "Drag an event onto the day above to schedule it, or double-click to view." })
    ] }),
    selectedEvent && mapFromEvent && /* @__PURE__ */ jsx7(
      TaskModal,
      {
        task: mapFromEvent(selectedEvent),
        isOpen: isTaskOpen,
        onClose: closeTask,
        updateTask
      }
    )
  ] });
}

// src/utils/calendarHelpers.ts
import dayjs4 from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import minMax from "dayjs/plugin/minMax";
dayjs4.extend(isBetween);
dayjs4.extend(minMax);
var generateCalendarWeeks = (year) => {
  const startDate = dayjs4(`${year}-01-01`);
  const weeks = [];
  let currentWeek = [];
  let currentDate = startDate.clone();
  while (currentDate.year() === year) {
    currentWeek.push(currentDate.clone());
    if (currentDate.day() === 6) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
    currentDate = currentDate.add(1, "day");
  }
  if (currentWeek.length) {
    weeks.push(currentWeek);
  }
  return weeks;
};
var getEventsForWeek = (week, events) => {
  return events.filter((event) => {
    const start = dayjs4(event.start);
    const end = dayjs4(event.end);
    return week.some((day) => day.isBetween(start, end, void 0, "[]"));
  });
};
var getEventsForYear = (week, events, year) => {
  return events.filter((event) => {
    const start = dayjs4(event.start);
    const end = dayjs4(event.end);
    return week.some((day) => day.isBetween(start, end, void 0, "[]")) && (start.year() === year || end.year() === year);
  });
};
var getTasksForWeek = (week, tasks) => {
  return tasks.filter((task) => {
    const start = dayjs4(task.startDate);
    const end = dayjs4(task.endDate);
    return week.some((day) => day.isBetween(start, end, void 0, "[]"));
  });
};
var getTasksForYear = (week, tasks, year) => {
  return tasks.filter((task) => {
    const start = dayjs4(task.startDate);
    const end = dayjs4(task.endDate);
    return week.some((day) => day.isBetween(start, end, void 0, "[]")) && (start.year() === year || end.year() === year);
  });
};

// src/components/MonthView.tsx
import dayjs6 from "dayjs";
import { useMemo as useMemo2, useState as useState4 } from "react";

// src/components/ui/Text.tsx
import { jsx as jsx8 } from "react/jsx-runtime";
var Text = ({ children, className }) => {
  return /* @__PURE__ */ jsx8("span", { "data-slot": "text", className, children });
};

// src/components/Week.tsx
import dayjs5 from "dayjs";
import { useState as useState3 } from "react";
import { jsx as jsx9, jsxs as jsxs4 } from "react/jsx-runtime";
function Week({
  days,
  events,
  onSelectDate,
  currentMonth,
  isMonthView,
  view = "week",
  readOnly = false,
  onEventClick,
  onDateClick,
  updateTask = async () => {
  },
  mapFromEvent
}) {
  const [isTaskOpen, setIsTaskOpen] = useState3(false);
  const [selectedEvent, setSelectedEvent] = useState3(null);
  const openTask = () => setIsTaskOpen(true);
  const closeTask = () => {
    setIsTaskOpen(false);
    setSelectedEvent(null);
  };
  const eventsForWeek = events.filter(
    (event) => days.some(
      (day) => dayjs5(day).isBetween(
        dayjs5(event.start),
        dayjs5(event.end),
        void 0,
        "[]"
      )
    )
  );
  const handleEventClick = async (event) => {
    if (onEventClick) {
      try {
        await onEventClick(event);
      } catch (e) {
        return;
      }
    }
    setSelectedEvent(event);
    openTask();
  };
  const handleDateClick = async (day) => {
    if (onDateClick) {
      try {
        await onDateClick(day, view);
      } catch (e) {
        return;
      }
    }
    onSelectDate(day);
  };
  return /* @__PURE__ */ jsxs4("div", { "data-slot": "week", "data-month-view": isMonthView ? "true" : void 0, children: [
    /* @__PURE__ */ jsxs4("div", { "data-slot": "week-days", style: { display: "grid", gridTemplateColumns: "repeat(7, 1fr)" }, children: [
      Array(days[0].day()).fill(null).map((_, index) => /* @__PURE__ */ jsx9("div", { "data-slot": "week-day-spacer" }, `empty-${index}`)),
      days.map((day, index) => {
        const isCurrentMonth = day.month() === currentMonth;
        if (isCurrentMonth) {
          return /* @__PURE__ */ jsxs4("div", { "data-slot": "week-day", "data-date": day.format("YYYY-MM-DD"), children: [
            /* @__PURE__ */ jsx9(Text, { children: day.format("D") }),
            !readOnly && /* @__PURE__ */ jsx9(Tooltip, { title: "Add event", children: /* @__PURE__ */ jsx9(
              Button,
              {
                type: "button",
                onClick: (e) => {
                  e.stopPropagation();
                  void handleDateClick(day);
                },
                "aria-label": "Add event",
                children: "+"
              }
            ) })
          ] }, index);
        }
        return /* @__PURE__ */ jsx9("div", { "data-slot": "week-day-spacer" }, `empty-${index}`);
      })
    ] }),
    /* @__PURE__ */ jsxs4("div", { "data-slot": "week-events", style: { display: "grid", gridTemplateColumns: "repeat(7, 1fr)" }, children: [
      eventsForWeek.slice(0, 3).map((event, eventIndex) => {
        var _a;
        const eventStart = dayjs5(event.start);
        const eventEnd = dayjs5(event.end);
        const weekStart = dayjs5(days[0]);
        const weekEnd = dayjs5(days[6]);
        const actualStart = dayjs5.max(eventStart, weekStart);
        const actualEnd = dayjs5.min(eventEnd, weekEnd);
        const startColumn = days.findIndex((d) => d.isSame(actualStart, "day"));
        const eventSpan = actualEnd.diff(actualStart, "days") + 1;
        const endColumn = startColumn + eventSpan - 1;
        return /* @__PURE__ */ jsx9(
          "div",
          {
            "data-slot": "event",
            "data-event-id": event.id,
            "data-color": (_a = event.color) != null ? _a : void 0,
            style: { gridColumn: `${startColumn + 1} / ${endColumn + 2}` },
            onClick: (e) => {
              e.stopPropagation();
              void handleEventClick(event);
            },
            children: event.title
          },
          eventIndex
        );
      }),
      eventsForWeek.length > 3 && /* @__PURE__ */ jsxs4("div", { "data-slot": "week-more", style: { gridColumn: isMonthView ? "7" : "6 / 8" }, children: [
        "+",
        eventsForWeek.length - 3,
        " events this week"
      ] })
    ] }),
    selectedEvent && mapFromEvent && /* @__PURE__ */ jsx9(
      TaskModal,
      {
        task: mapFromEvent(selectedEvent),
        isOpen: isTaskOpen,
        onClose: closeTask,
        updateTask
      }
    )
  ] });
}

// src/components/MonthView.tsx
import { jsx as jsx10, jsxs as jsxs5 } from "react/jsx-runtime";
function MonthView({
  events,
  setEvents,
  setStartDate,
  setZoomLevel,
  view,
  onEventClick,
  onDateClick,
  readOnly = false,
  updateTask = async () => {
  },
  mapFromEvent,
  className,
  style
}) {
  const [currentMonth, setCurrentMonth] = useState4(dayjs6().month());
  const [selectedDate, setSelectedDate] = useState4(null);
  const [isModalOpen, setIsModalOpen] = useState4(false);
  const openModalWithDate = (date) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  };
  const generateCalendarData = () => {
    const year = dayjs6().year();
    const startDate = dayjs6(`${year}-01-01`);
    const weeks = [];
    let currentWeek = [];
    let currentDate = startDate.clone();
    while (currentDate.year() === year) {
      currentWeek.push(currentDate.clone());
      if (currentDate.day() === 6) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
      currentDate = currentDate.add(1, "day");
    }
    if (currentWeek.length) {
      weeks.push(currentWeek);
    }
    return weeks;
  };
  const calendarData = useMemo2(() => generateCalendarData(), []);
  const getEventsForWeekInMonth = (week) => getEventsForWeek(week, events);
  const handlePreviousMonth = () => {
    setCurrentMonth((prev) => (prev - 1 + 12) % 12);
  };
  const handleNextMonth = () => {
    setCurrentMonth((prev) => (prev + 1) % 12);
  };
  return /* @__PURE__ */ jsxs5("div", { "data-slot": "month-view", className, style, children: [
    /* @__PURE__ */ jsxs5("div", { "data-slot": "month-view-nav", children: [
      /* @__PURE__ */ jsx10(Button, { type: "button", onClick: handlePreviousMonth, "aria-label": "Previous month", children: "\u2190" }),
      /* @__PURE__ */ jsx10(Title, { level: 4, children: dayjs6(`${dayjs6().year()}-${currentMonth + 1}-01`).format("MMMM") }),
      /* @__PURE__ */ jsx10(Button, { type: "button", onClick: handleNextMonth, "aria-label": "Next month", children: "\u2192" })
    ] }),
    /* @__PURE__ */ jsxs5("div", { "data-slot": "month-view-body", children: [
      /* @__PURE__ */ jsx10("div", { "data-slot": "month-view-weekdays", children: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => /* @__PURE__ */ jsx10("div", { "data-slot": "month-weekday", children: day }, day)) }),
      /* @__PURE__ */ jsx10("div", { "data-slot": "month-view-weeks", children: calendarData.filter((week) => week.some((day) => day.month() === currentMonth)).map((week, weekIndex) => /* @__PURE__ */ jsxs5("div", { "data-slot": "month-week", children: [
        /* @__PURE__ */ jsx10(
          "button",
          {
            type: "button",
            "data-slot": "month-week-go-week",
            onClick: () => {
              setStartDate(week[0]);
              setZoomLevel("week");
              openModalWithDate(week[0]);
            },
            "aria-label": "Go to week",
            children: "\u2192"
          }
        ),
        /* @__PURE__ */ jsx10(
          Week,
          {
            days: week,
            events: getEventsForWeekInMonth(week),
            onSelectDate: openModalWithDate,
            currentMonth,
            isMonthView: true,
            view,
            readOnly,
            onEventClick,
            onDateClick,
            updateTask,
            mapFromEvent
          }
        )
      ] }, weekIndex)) })
    ] }),
    /* @__PURE__ */ jsx10(CreateTaskModal, { isOpen: isModalOpen, onClose: () => setIsModalOpen(false) })
  ] });
}

// src/components/WeekView.tsx
import dayjs7 from "dayjs";
import { useCallback as useCallback2, useMemo as useMemo3, useRef, useState as useState5 } from "react";
import { Responsive } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import { jsx as jsx11, jsxs as jsxs6 } from "react/jsx-runtime";
function WeekView({
  startDate,
  scheduledEvents,
  unscheduledEvents,
  setScheduledEvents,
  setUnscheduledEvents,
  getWeekDaysWithDates,
  setStartDate,
  view,
  onEventMove,
  onEventResize,
  onEventCreate,
  onEventClick,
  onDateClick,
  readOnly = false,
  updateTask = async () => {
  },
  mapFromEvent,
  className,
  style
}) {
  const [isTaskOpen, setIsTaskOpen] = useState5(false);
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState5(false);
  const [selectedEvent, setSelectedEvent] = useState5(null);
  const containerRef = useRef(null);
  const openTask = () => setIsTaskOpen(true);
  const closeTask = () => {
    setIsTaskOpen(false);
    setSelectedEvent(null);
  };
  const openCreateTask = async () => {
    if (onDateClick) {
      try {
        await onDateClick(startDate, view);
      } catch (e) {
        return;
      }
    }
    setIsCreateTaskOpen(true);
  };
  const closeCreateTask = () => setIsCreateTaskOpen(false);
  const handleOpenEvent = async (event) => {
    if (onEventClick) {
      try {
        await onEventClick(event);
      } catch (e) {
        return;
      }
    }
    setSelectedEvent(event);
    openTask();
  };
  const getEventGridData = useCallback2(
    (event) => {
      const eventStart = dayjs7(event.start);
      const eventEnd = dayjs7(event.end);
      const weekStart = startDate;
      const weekEnd = startDate.add(6, "days");
      const actualStart = eventStart.isBefore(weekStart) ? weekStart : eventStart;
      const actualEnd = eventEnd.isAfter(weekEnd) ? weekEnd : eventEnd;
      const startColumn = actualStart.diff(weekStart, "days");
      const eventSpan = actualEnd.diff(actualStart, "days") + 1;
      if (eventSpan <= 0) return null;
      return {
        i: `event-${event.id}`,
        x: startColumn,
        y: 1,
        w: Math.min(eventSpan, 7 - startColumn),
        h: 1
      };
    },
    [startDate]
  );
  const eventLayouts = useMemo3(() => {
    return scheduledEvents.map(getEventGridData).filter(
      (gridData) => gridData !== null
    );
  }, [scheduledEvents, startDate, getEventGridData]);
  const layouts = useMemo3(() => {
    return {
      lg: [
        ...getWeekDaysWithDates().map(({ dayIndex }) => ({
          i: `day-${dayIndex}`,
          x: dayIndex,
          y: 0,
          w: 1,
          h: 1,
          static: true
        })),
        ...eventLayouts
      ]
    };
  }, [eventLayouts, getWeekDaysWithDates]);
  const weekTitle = useMemo3(() => {
    const endDate = startDate.add(6, "days");
    return `${startDate.format("MMM D")} - ${endDate.format("MMM D, YYYY")}`;
  }, [startDate]);
  const handlePreviousWeek = () => {
    const newDate = startDate.subtract(1, "week");
    setStartDate(newDate);
  };
  const handleNextWeek = () => {
    const newDate = startDate.add(1, "week");
    setStartDate(newDate);
  };
  const handleDrag = useCallback2(
    (_layout, _oldItem, newItem, _placeholder, _e, element) => {
      if (!newItem || !element || !containerRef.current) return;
      const containerRect = containerRef.current.getBoundingClientRect();
      const taskRect = element.getBoundingClientRect();
      const leftEdge = containerRect.left;
      const rightEdge = containerRect.right;
      if (taskRect.left < leftEdge) {
        newItem.x = 6;
      }
      if (taskRect.right > rightEdge) {
        newItem.x = 0;
      }
    },
    []
  );
  const handleDragStop = useCallback2(
    (layout, _oldItem, newItem, _placeholder, _e, element) => {
      if (!newItem || !element) return;
      const event = scheduledEvents.find((ev) => `event-${ev.id}` === newItem.i);
      if (!event) return;
      let newStart = startDate.clone().add(newItem.x, "days");
      const originalDuration = dayjs7(event.end).diff(dayjs7(event.start), "days");
      if (containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const elRect = element.getBoundingClientRect();
        const leftEdge = containerRect.left;
        const rightEdge = containerRect.right;
        if (elRect.left < leftEdge) {
          newStart = newStart.subtract(originalDuration + 1, "days");
          handlePreviousWeek();
        }
        if (elRect.right > rightEdge) {
          newStart = newStart.add(originalDuration + 1, "days");
          handleNextWeek();
        }
      }
      const newEnd = newStart.add(originalDuration, "days");
      const oldStart = dayjs7(event.start);
      const oldEnd = dayjs7(event.end);
      if (oldStart.isSame(newStart, "day") && oldEnd.isSame(newEnd, "day")) return;
      const updatedEvent = __spreadProps(__spreadValues({}, event), { start: newStart, end: newEnd });
      const prevScheduled = [...scheduledEvents];
      const prevUnscheduled = [...unscheduledEvents];
      const newScheduled = prevScheduled.map((ev) => ev.id === event.id ? updatedEvent : ev);
      setScheduledEvents(newScheduled);
      setUnscheduledEvents((prev) => prev.filter((ev) => ev.id !== event.id));
      if (onEventMove) {
        (async () => {
          try {
            await onEventMove({
              id: event.id,
              start: newStart,
              end: newEnd,
              oldStart,
              oldEnd,
              view
            });
          } catch (e) {
            setScheduledEvents(prevScheduled);
            setUnscheduledEvents(prevUnscheduled);
          }
        })();
      }
    },
    [startDate, scheduledEvents, setScheduledEvents, setUnscheduledEvents, onEventMove, view]
  );
  const handleResizeStop = useCallback2(
    (layout) => {
      const event = scheduledEvents.find((ev) => {
        const layoutItem2 = layout.find((item) => item.i === `event-${ev.id}`);
        return layoutItem2 != null;
      });
      if (!event) return;
      const layoutItem = layout.find((item) => item.i === `event-${event.id}`);
      if (!layoutItem) return;
      const oldStart = dayjs7(event.start);
      const oldEnd = dayjs7(event.end);
      const newStart = startDate.clone().add(layoutItem.x, "days");
      const newEnd = startDate.clone().add(layoutItem.x + layoutItem.w - 1, "days");
      const updatedEvent = __spreadProps(__spreadValues({}, event), { start: newStart, end: newEnd });
      const prevScheduled = [...scheduledEvents];
      setScheduledEvents(
        (prev) => prev.map((ev) => ev.id === event.id ? updatedEvent : ev)
      );
      if (onEventResize) {
        (async () => {
          try {
            await onEventResize({
              id: event.id,
              start: newStart,
              end: newEnd,
              oldStart,
              oldEnd,
              view
            });
          } catch (e) {
            setScheduledEvents(prevScheduled);
          }
        })();
      }
    },
    [startDate, scheduledEvents, setScheduledEvents, onEventResize, view]
  );
  const handleUnassignedEventDrop = useCallback2(
    (event, dayIndex) => {
      const oldStart = dayjs7(event.start);
      const oldEnd = dayjs7(event.end);
      const newStart = startDate.clone().add(dayIndex, "days");
      const newEnd = newStart.clone().add(1, "days");
      const updatedEvent = __spreadProps(__spreadValues({}, event), {
        start: newStart,
        end: newEnd
      });
      const prevScheduled = [...scheduledEvents];
      const prevUnscheduled = [...unscheduledEvents];
      setScheduledEvents((prev) => [...prev, updatedEvent]);
      setUnscheduledEvents((prev) => prev.filter((ev) => ev.id !== event.id));
      if (onEventMove) {
        (async () => {
          try {
            await onEventMove({
              id: event.id,
              start: newStart,
              end: newEnd,
              oldStart,
              oldEnd,
              view
            });
          } catch (e) {
            setScheduledEvents(prevScheduled);
            setUnscheduledEvents(prevUnscheduled);
          }
        })();
      }
    },
    [startDate, scheduledEvents, setScheduledEvents, setUnscheduledEvents, onEventMove, view]
  );
  const handleCreateSubmit = useCallback2(
    async (data) => {
      const id = `event-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const newEvent = {
        id,
        title: data.name,
        start: data.startDate,
        end: data.endDate
      };
      const prevScheduled = [...scheduledEvents];
      setScheduledEvents((prev) => [...prev, newEvent]);
      closeCreateTask();
      if (onEventCreate) {
        try {
          await onEventCreate({
            id: newEvent.id,
            title: newEvent.title,
            start: dayjs7(newEvent.start),
            end: dayjs7(newEvent.end)
          });
        } catch (e) {
          setScheduledEvents(prevScheduled);
        }
      }
    },
    [scheduledEvents, setScheduledEvents, onEventCreate]
  );
  return /* @__PURE__ */ jsxs6("div", { "data-slot": "week-view", className, style, children: [
    /* @__PURE__ */ jsxs6("div", { "data-slot": "week-view-nav", children: [
      /* @__PURE__ */ jsx11(Button, { type: "button", onClick: handlePreviousWeek, "aria-label": "Previous week", children: "\u2190" }),
      /* @__PURE__ */ jsx11(Title, { level: 4, children: weekTitle }),
      /* @__PURE__ */ jsx11(Button, { type: "button", onClick: handleNextWeek, "aria-label": "Next week", children: "\u2192" })
    ] }),
    /* @__PURE__ */ jsx11("div", { "data-slot": "week-view-grid", ref: containerRef, children: /* @__PURE__ */ jsxs6(
      Responsive,
      {
        layouts: { lg: layouts.lg },
        cols: { lg: 7, md: 7, sm: 7, xs: 7, xxs: 7 },
        rowHeight: 50,
        width: 1200,
        dragConfig: { enabled: !readOnly },
        resizeConfig: { enabled: !readOnly },
        onDragStop: handleDragStop,
        onDrag: handleDrag,
        onResizeStop: handleResizeStop,
        children: [
          getWeekDaysWithDates().map(({ dayIndex, date }) => /* @__PURE__ */ jsxs6(
            "div",
            {
              "data-slot": "week-day-cell",
              "data-day-index": dayIndex,
              "data-date": date,
              "data-grid": {
                i: `day-${dayIndex}`,
                x: dayIndex,
                y: 0,
                w: 1,
                h: 1.5,
                static: true
              },
              children: [
                /* @__PURE__ */ jsx11("span", { children: dayjs7(date).format("ddd") }),
                /* @__PURE__ */ jsx11("span", { children: dayjs7(date).format("D") })
              ]
            },
            `day-${dayIndex}`
          )),
          scheduledEvents.map((event) => {
            var _a;
            const gridData = getEventGridData(event);
            if (!gridData) return null;
            return /* @__PURE__ */ jsxs6(
              "div",
              {
                "data-grid": gridData,
                "data-slot": "event",
                "data-event-id": event.id,
                "data-color": (_a = event.color) != null ? _a : void 0,
                children: [
                  event.title,
                  /* @__PURE__ */ jsx11(
                    Button,
                    {
                      type: "button",
                      onMouseDown: (e) => e.stopPropagation(),
                      onClick: (e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        handleOpenEvent(event);
                      },
                      "aria-label": `View ${event.title}`,
                      children: "View"
                    }
                  )
                ]
              },
              gridData.i
            );
          })
        ]
      }
    ) }),
    /* @__PURE__ */ jsxs6("div", { "data-slot": "unscheduled-list", children: [
      /* @__PURE__ */ jsx11("h3", { "data-slot": "unscheduled-title", children: "Unscheduled events" }),
      !readOnly && /* @__PURE__ */ jsx11(Tooltip, { title: "Add new event", children: /* @__PURE__ */ jsx11(Button, { type: "button", onClick: openCreateTask, "aria-label": "Add event", children: "+" }) }),
      /* @__PURE__ */ jsx11(
        CreateTaskModal,
        {
          isOpen: isCreateTaskOpen,
          onClose: closeCreateTask,
          onSubmit: handleCreateSubmit
        }
      ),
      /* @__PURE__ */ jsx11("div", { "data-slot": "unscheduled-items", children: unscheduledEvents.map((event) => {
        var _a;
        return /* @__PURE__ */ jsx11(
          "div",
          {
            "data-slot": "unscheduled-event",
            "data-event-id": event.id,
            "data-color": (_a = event.color) != null ? _a : void 0,
            draggable: !readOnly,
            onDragEnd: (e) => {
              const calendar = containerRef.current;
              if (calendar) {
                const calendarRect = calendar.getBoundingClientRect();
                const dropX = e.clientX - calendarRect.left;
                const columnWidth = calendarRect.width / 7;
                const columnIndex = Math.floor(dropX / columnWidth);
                const boundedIndex = Math.max(0, Math.min(6, columnIndex));
                handleUnassignedEventDrop(event, boundedIndex);
              }
            },
            onDoubleClick: () => handleOpenEvent(event),
            children: event.title
          },
          event.id
        );
      }) })
    ] }),
    selectedEvent && mapFromEvent && /* @__PURE__ */ jsx11(
      TaskModal,
      {
        task: mapFromEvent(selectedEvent),
        isOpen: isTaskOpen,
        onClose: closeTask,
        updateTask
      }
    )
  ] });
}

// src/components/YearView.tsx
import dayjs8 from "dayjs";
import { useMemo as useMemo4, useState as useState6 } from "react";
import { jsx as jsx12, jsxs as jsxs7 } from "react/jsx-runtime";
function YearView({
  events,
  setEvents,
  setStartDate,
  setZoomLevel,
  view,
  onEventClick,
  onDateClick,
  readOnly = false,
  updateTask = async () => {
  },
  mapFromEvent,
  className,
  style
}) {
  const [selectedDate, setSelectedDate] = useState6(null);
  const [isModalOpen, setIsModalOpen] = useState6(false);
  const [currentYear, setCurrentYear] = useState6(dayjs8().year());
  const openModalWithDate = (date) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  };
  const generateCalendarData = () => {
    const year = dayjs8().year();
    const startDate = dayjs8(`${year}-01-01`);
    const weeks = [];
    let currentWeek = [];
    let currentDate = startDate.clone();
    while (currentDate.year() === year) {
      currentWeek.push(currentDate.clone());
      if (currentDate.day() === 6) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
      currentDate = currentDate.add(1, "day");
    }
    if (currentWeek.length) {
      weeks.push(currentWeek);
    }
    return weeks;
  };
  const calendarData = useMemo4(() => generateCalendarData(), []);
  const getEventsForWeekInYear = (week) => getEventsForYear(week, events, currentYear);
  const handlePreviousYear = () => {
    setCurrentYear((prev) => prev - 1);
  };
  const handleNextYear = () => {
    setCurrentYear((prev) => prev + 1);
  };
  return /* @__PURE__ */ jsxs7("div", { "data-slot": "year-view", className, style, children: [
    /* @__PURE__ */ jsxs7("div", { "data-slot": "year-view-nav", children: [
      /* @__PURE__ */ jsx12(Button, { type: "button", onClick: handlePreviousYear, "aria-label": "Previous year", children: "\u2190" }),
      /* @__PURE__ */ jsx12(Title, { level: 4, children: currentYear }),
      /* @__PURE__ */ jsx12(Button, { type: "button", onClick: handleNextYear, "aria-label": "Next year", children: "\u2192" })
    ] }),
    /* @__PURE__ */ jsx12("div", { "data-slot": "year-view-months", children: [...Array(12)].map((_, monthIndex) => /* @__PURE__ */ jsxs7("div", { "data-slot": "year-month", children: [
      /* @__PURE__ */ jsx12(Title, { level: 4, children: dayjs8(`${currentYear}-${monthIndex + 1}-01`).format("MMMM") }),
      /* @__PURE__ */ jsx12("div", { "data-slot": "year-month-weekdays", children: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => /* @__PURE__ */ jsx12("div", { "data-slot": "year-weekday", children: day }, day)) }),
      /* @__PURE__ */ jsx12("div", { "data-slot": "year-month-weeks", children: calendarData.filter((week) => week.some((day) => day.month() === monthIndex)).map((week, weekIndex) => /* @__PURE__ */ jsxs7("div", { "data-slot": "year-week", children: [
        /* @__PURE__ */ jsx12(
          "button",
          {
            type: "button",
            "data-slot": "year-week-go",
            onClick: () => {
              setStartDate(week[0]);
              setZoomLevel("week");
              openModalWithDate(week[0]);
            },
            "aria-label": "Go to week",
            children: "\u2192"
          }
        ),
        /* @__PURE__ */ jsx12(
          Week,
          {
            days: week,
            events: getEventsForWeekInYear(week),
            onSelectDate: openModalWithDate,
            currentMonth: monthIndex,
            view,
            readOnly,
            onEventClick,
            onDateClick,
            updateTask,
            mapFromEvent
          }
        )
      ] }, weekIndex)) })
    ] }, monthIndex)) }),
    /* @__PURE__ */ jsx12(CreateTaskModal, { isOpen: isModalOpen, onClose: () => setIsModalOpen(false) })
  ] });
}

// src/components/Calendar.tsx
import { jsx as jsx13, jsxs as jsxs8 } from "react/jsx-runtime";
var ALL_VIEWS = ["day", "week", "month", "year"];
var VIEW_LABELS = {
  day: "Daily",
  week: "Weekly",
  month: "Monthly",
  year: "Yearly"
};
function Calendar({
  events,
  onEventsChange,
  onEventChange,
  date,
  onDateChange,
  view,
  onViewChange,
  defaultEvents,
  defaultDate,
  defaultView,
  showSwitcher = true,
  views = ALL_VIEWS,
  initialScheduledEvents = [],
  initialUnscheduledEvents = [],
  onEventMove,
  onEventResize,
  onEventCreate,
  onEventClick,
  onDateClick,
  readOnly = false,
  mapFromEvent,
  className,
  style
}) {
  var _a;
  const [zoomLevel, setZoomLevel] = useState7(
    () => views.length > 0 ? views[0] : "week"
  );
  const effectiveZoom = views.includes(zoomLevel) ? zoomLevel : (_a = views[0]) != null ? _a : "week";
  const [scheduledEvents, setScheduledEvents] = useState7(
    initialScheduledEvents
  );
  const [unscheduledEvents, setUnscheduledEvents] = useState7(
    initialUnscheduledEvents
  );
  const [startDate, setStartDate] = useState7(dayjs9().startOf("week"));
  const getWeekDaysWithDates = () => {
    return Array.from({ length: 7 }).map((_, index) => {
      const date2 = startDate.clone().add(index, "days");
      return { dayIndex: index, date: date2.format("YYYY-MM-DD") };
    });
  };
  const handleDragEnd = async (event) => {
    var _a2;
    const { active, over } = event;
    if (!over) return;
    const draggedEvent = scheduledEvents.find((ev) => ev.id === active.id);
    if (!draggedEvent) return;
    const dropDateIndex = (_a2 = over.data.current) == null ? void 0 : _a2.index;
    if (dropDateIndex === void 0) return;
    const oldStart = dayjs9(draggedEvent.start);
    const oldEnd = dayjs9(draggedEvent.end);
    const newStart = startDate.clone().add(dropDateIndex, "days");
    const newEnd = newStart.clone().add(1, "days");
    const prevScheduled = [...scheduledEvents];
    const prevUnscheduled = [...unscheduledEvents];
    setScheduledEvents((prev) => [
      ...prev.filter((ev) => ev.id !== draggedEvent.id),
      __spreadProps(__spreadValues({}, draggedEvent), {
        start: dayjs9(newStart.format("YYYY-MM-DD")),
        end: dayjs9(newEnd.format("YYYY-MM-DD"))
      })
    ]);
    setUnscheduledEvents((prev) => prev.filter((ev) => ev.id !== draggedEvent.id));
    try {
      if (onEventMove) {
        await onEventMove({
          id: draggedEvent.id,
          start: newStart,
          end: newEnd,
          oldStart,
          oldEnd,
          view: effectiveZoom
        });
      }
    } catch (e) {
      setScheduledEvents(prevScheduled);
      setUnscheduledEvents(prevUnscheduled);
    }
  };
  const zoomLevelView = {
    day: /* @__PURE__ */ jsx13(
      DayView,
      {
        startDate: startDate.startOf("day"),
        setStartDate,
        scheduledEvents,
        unscheduledEvents,
        setScheduledEvents,
        setUnscheduledEvents,
        onEventMove,
        onEventResize,
        onEventCreate,
        onEventClick,
        onDateClick,
        view: "day",
        readOnly,
        mapFromEvent
      }
    ),
    week: /* @__PURE__ */ jsx13(
      WeekView,
      {
        startDate,
        setStartDate,
        scheduledEvents,
        unscheduledEvents,
        setScheduledEvents,
        setUnscheduledEvents,
        getWeekDaysWithDates,
        onEventMove,
        onEventResize,
        onEventCreate,
        onEventClick,
        onDateClick,
        view: "week",
        readOnly,
        mapFromEvent
      }
    ),
    month: /* @__PURE__ */ jsx13(
      MonthView,
      {
        setStartDate,
        events: scheduledEvents,
        setEvents: setScheduledEvents,
        setZoomLevel,
        onEventClick,
        onDateClick,
        view: "month",
        readOnly,
        mapFromEvent
      }
    ),
    year: /* @__PURE__ */ jsx13(
      YearView,
      {
        setStartDate,
        events: scheduledEvents,
        setEvents: setScheduledEvents,
        setZoomLevel,
        onEventClick,
        onDateClick,
        view: "year",
        readOnly,
        mapFromEvent
      }
    )
  };
  return /* @__PURE__ */ jsx13(DndContext, { onDragEnd: handleDragEnd, children: /* @__PURE__ */ jsxs8("div", { "data-slot": "calendar-root", className, style, children: [
    showSwitcher && views.length > 0 && /* @__PURE__ */ jsx13("div", { "data-slot": "calendar-view-switcher", children: /* @__PURE__ */ jsx13(
      SegmentedControl,
      {
        value: effectiveZoom,
        options: views.map((v) => ({ label: VIEW_LABELS[v], value: v })),
        onChange: (value) => setZoomLevel(value)
      }
    ) }),
    /* @__PURE__ */ jsx13("div", { "data-slot": "calendar-content", "data-view": effectiveZoom, children: zoomLevelView[effectiveZoom] })
  ] }) });
}

// src/types/task.ts
var ProgressStatus = /* @__PURE__ */ ((ProgressStatus2) => {
  ProgressStatus2["NOT_STARTED"] = "NOT_STARTED";
  ProgressStatus2["IN_PROGRESS"] = "IN_PROGRESS";
  ProgressStatus2["COMPLETED"] = "COMPLETED";
  ProgressStatus2["BLOCKED"] = "BLOCKED";
  return ProgressStatus2;
})(ProgressStatus || {});
var UserRole = /* @__PURE__ */ ((UserRole2) => {
  UserRole2["ADMIN"] = "ADMIN";
  UserRole2["WORKER"] = "WORKER";
  UserRole2["MANAGER"] = "MANAGER";
  return UserRole2;
})(UserRole || {});

// src/utils/taskColors.ts
var getTaskColorHex = (status) => {
  const colorMap = {
    ["NOT_STARTED" /* NOT_STARTED */]: "#94a3b8",
    ["IN_PROGRESS" /* IN_PROGRESS */]: "#3b82f6",
    ["COMPLETED" /* COMPLETED */]: "#10b981",
    ["BLOCKED" /* BLOCKED */]: "#ef4444"
  };
  return status ? colorMap[status] : void 0;
};
var DEFAULT_TASK_COLOR = "#b1724b";

// src/utils/eventMappers.ts
function mapTaskToEvent(task) {
  const _a = task, { id, name, startDate, endDate, progressStatus, employees } = _a, rest = __objRest(_a, ["id", "name", "startDate", "endDate", "progressStatus", "employees"]);
  return {
    id,
    title: name,
    start: startDate,
    end: endDate,
    color: getTaskColorHex(progressStatus),
    meta: __spreadValues({
      progressStatus,
      employees
    }, rest)
  };
}
function mapEventToTask(event) {
  var _a;
  const meta = (_a = event.meta) != null ? _a : {};
  const _b = meta, { progressStatus, employees } = _b, restMeta = __objRest(_b, ["progressStatus", "employees"]);
  return __spreadValues({
    id: event.id,
    name: event.title,
    startDate: event.start,
    endDate: event.end,
    progressStatus,
    employees: Array.isArray(employees) ? employees : []
  }, restMeta);
}

// src/components/ui/Card.tsx
import { jsx as jsx14 } from "react/jsx-runtime";
var Card = ({ children, className }) => {
  return /* @__PURE__ */ jsx14("div", { "data-slot": "card", className, children });
};

// src/components/ui/Tabs.tsx
import { jsx as jsx15, jsxs as jsxs9 } from "react/jsx-runtime";
var Tabs = ({
  activeKey,
  onChange,
  className,
  items
}) => {
  var _a;
  return /* @__PURE__ */ jsxs9("div", { "data-slot": "tabs", className, children: [
    /* @__PURE__ */ jsx15("div", { "data-slot": "tabs-list", children: items.map((item) => /* @__PURE__ */ jsx15(
      "button",
      {
        type: "button",
        role: "tab",
        "aria-selected": activeKey === item.key,
        "data-slot": "tabs-trigger",
        "data-value": item.key,
        onClick: () => onChange(item.key),
        children: item.label
      },
      item.key
    )) }),
    /* @__PURE__ */ jsx15("div", { "data-slot": "tabs-content", children: (_a = items.find((item) => item.key === activeKey)) == null ? void 0 : _a.children })
  ] });
};

// src/demo/CalendarContainer.tsx
import { useState as useState8 } from "react";
import { jsx as jsx16 } from "react/jsx-runtime";
var ALL_VIEWS2 = ["day", "week", "month", "year"];
function CalendarContainer({
  showSwitcher,
  showTabs = true,
  views = ALL_VIEWS2,
  areas = [],
  initialScheduledEvents = [],
  initialUnscheduledEvents = [],
  onEventMove,
  onEventResize,
  onEventCreate,
  onEventClick,
  onDateClick,
  readOnly = false,
  mapFromEvent
}) {
  const effectiveAreas = areas.length > 0 ? areas : [{ id: "", name: "Calendar" }];
  const [activeTab, setActiveTab] = useState8(
    () => {
      var _a, _b;
      return (_b = (_a = effectiveAreas[0]) == null ? void 0 : _a.id) != null ? _b : "";
    }
  );
  if (!showTabs || effectiveAreas.length <= 1) {
    return /* @__PURE__ */ jsx16("div", { "data-slot": "calendar-container", children: /* @__PURE__ */ jsx16(Card, { children: /* @__PURE__ */ jsx16(
      Calendar,
      {
        showSwitcher,
        views,
        initialScheduledEvents,
        initialUnscheduledEvents,
        onEventMove,
        onEventResize,
        onEventCreate,
        onEventClick,
        onDateClick,
        readOnly,
        mapFromEvent
      }
    ) }) });
  }
  return /* @__PURE__ */ jsx16("div", { "data-slot": "calendar-container", "data-tabs": true, children: /* @__PURE__ */ jsx16(
    Tabs,
    {
      activeKey: activeTab,
      onChange: setActiveTab,
      items: effectiveAreas.map((area) => ({
        key: area.id,
        label: /* @__PURE__ */ jsx16("span", { "data-slot": "tab-label", "data-area-id": area.id, children: area.name }),
        children: /* @__PURE__ */ jsx16(Card, { children: /* @__PURE__ */ jsx16(
          Calendar,
          {
            showSwitcher,
            views,
            initialScheduledEvents,
            initialUnscheduledEvents,
            onEventMove,
            onEventResize,
            onEventCreate,
            onEventClick,
            onDateClick,
            readOnly,
            mapFromEvent
          }
        ) })
      }))
    }
  ) });
}
export {
  Calendar,
  CalendarContainer,
  CreateTaskModal,
  DEFAULT_TASK_COLOR,
  DayView,
  MonthView,
  ProgressStatus,
  TaskModal,
  UserRole,
  Week,
  WeekView,
  YearView,
  generateCalendarWeeks,
  getEventsForWeek,
  getEventsForYear,
  getTaskColorHex,
  getTasksForWeek,
  getTasksForYear,
  mapEventToTask,
  mapTaskToEvent
};
