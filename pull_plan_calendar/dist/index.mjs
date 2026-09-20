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
  className,
  buttonClassName
}) => {
  return /* @__PURE__ */ jsx("div", { "data-slot": "segmented-control", role: "tablist", className, children: options.map((option) => /* @__PURE__ */ jsx(
    "button",
    {
      type: "button",
      role: "tab",
      "aria-selected": value === option.value,
      "data-slot": "segmented-control-option",
      "data-value": option.value,
      className: [buttonClassName, option.className].filter(Boolean).join(" "),
      onClick: () => onChange(option.value),
      children: option.label
    },
    option.value
  )) });
};

// src/components/Calendar.tsx
import { DndContext as DndContext2 } from "@dnd-kit/core";
import dayjs13 from "dayjs";
import { useCallback as useCallback6, useEffect as useEffect5, useState as useState8 } from "react";

// src/hooks/useCalendarDragEnd.ts
import { useCallback } from "react";
import dayjs from "dayjs";
function useCalendarDragEnd(startDate, scheduledEvents, unscheduledEvents, setScheduledEvents, setUnscheduledEvents, onEventMove, view) {
  return useCallback(
    async (event) => {
      var _a;
      const { active, over } = event;
      if (!over) return;
      const draggedEvent = scheduledEvents.find((ev) => ev.id === active.id);
      if (!draggedEvent) return;
      const dropDateIndex = (_a = over.data.current) == null ? void 0 : _a.index;
      if (dropDateIndex === void 0) return;
      const oldStart = dayjs(draggedEvent.start);
      const oldEnd = dayjs(draggedEvent.end);
      const newStart = startDate.clone().add(dropDateIndex, "days");
      const newEnd = newStart.clone().add(1, "days");
      const prevScheduled = [...scheduledEvents];
      const prevUnscheduled = [...unscheduledEvents];
      setScheduledEvents((prev) => [
        ...prev.filter((ev) => ev.id !== draggedEvent.id),
        __spreadProps(__spreadValues({}, draggedEvent), {
          start: dayjs(newStart.format("YYYY-MM-DD")),
          end: dayjs(newEnd.format("YYYY-MM-DD"))
        })
      ]);
      setUnscheduledEvents(
        (prev) => prev.filter((ev) => ev.id !== draggedEvent.id)
      );
      try {
        if (onEventMove) {
          await onEventMove({
            id: draggedEvent.id,
            start: newStart,
            end: newEnd,
            oldStart,
            oldEnd,
            view
          });
        }
      } catch (e) {
        setScheduledEvents(prevScheduled);
        setUnscheduledEvents(prevUnscheduled);
      }
    },
    [
      startDate,
      scheduledEvents,
      unscheduledEvents,
      setScheduledEvents,
      setUnscheduledEvents,
      onEventMove,
      view
    ]
  );
}

// src/hooks/useCalendarViews.ts
import { useCallback as useCallback2, useState } from "react";
var ALL_VIEWS = ["day", "week", "month", "year"];
function useCalendarViews(views, options) {
  var _a, _b;
  const orderedViews = ALL_VIEWS.filter((v) => views.includes(v));
  const fallback = (options == null ? void 0 : options.defaultView) && orderedViews.includes(options.defaultView) ? options.defaultView : (_a = orderedViews[0]) != null ? _a : "week";
  const isControlled = (options == null ? void 0 : options.view) !== void 0;
  const [internalZoom, setInternalZoom] = useState(fallback);
  const zoomLevel = isControlled ? options.view : internalZoom;
  const effectiveZoom = orderedViews.includes(zoomLevel) ? zoomLevel : (_b = orderedViews[0]) != null ? _b : "week";
  const setZoomLevel = useCallback2(
    (next) => {
      var _a2;
      if (!isControlled) {
        setInternalZoom(next);
      }
      (_a2 = options == null ? void 0 : options.onViewChange) == null ? void 0 : _a2.call(options, next);
    },
    [isControlled, options == null ? void 0 : options.onViewChange]
  );
  return { orderedViews, setZoomLevel, effectiveZoom };
}

// src/utils/calendarHelpers.ts
import dayjs2 from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import minMax from "dayjs/plugin/minMax";
import updateLocale from "dayjs/plugin/updateLocale";
dayjs2.extend(isBetween);
dayjs2.extend(minMax);
dayjs2.extend(updateLocale);
var WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
function applyWeekStartsOn(weekStartsOn) {
  dayjs2.updateLocale("en", { weekStart: weekStartsOn });
}
function getWeekdayLabels(weekStartsOn = 0) {
  return [
    ...WEEKDAY_LABELS.slice(weekStartsOn),
    ...WEEKDAY_LABELS.slice(0, weekStartsOn)
  ];
}
function getLeadingEmptyCount(firstDay, weekStartsOn = 0) {
  return (firstDay.day() - weekStartsOn + 7) % 7;
}
var generateCalendarWeeks = (year, weekStartsOn = 0) => {
  const weekEndsOn = (weekStartsOn + 6) % 7;
  const startDate = dayjs2(`${year}-01-01`);
  const weeks = [];
  let currentWeek = [];
  let currentDate = startDate.clone();
  while (currentDate.year() === year) {
    currentWeek.push(currentDate.clone());
    if (currentDate.day() === weekEndsOn) {
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
var getEventsForDay = (day, events) => {
  const dayStart = day.startOf("day");
  const dayEnd = day.endOf("day");
  return events.filter((event) => {
    const start = dayjs2(event.start);
    const end = dayjs2(event.end);
    return (start.isSame(dayStart) || start.isBefore(dayEnd)) && (end.isSame(dayEnd) || end.isAfter(dayStart));
  });
};
var getEventsForWeek = (week, events) => {
  return events.filter((event) => {
    const start = dayjs2(event.start);
    const end = dayjs2(event.end);
    return week.some((day) => day.isBetween(start, end, void 0, "[]"));
  });
};
var getEventsForYear = (week, events, year) => {
  return events.filter((event) => {
    const start = dayjs2(event.start);
    const end = dayjs2(event.end);
    return week.some((day) => day.isBetween(start, end, void 0, "[]")) && (start.year() === year || end.year() === year);
  });
};
var getTasksForWeek = (week, tasks) => {
  return tasks.filter((task) => {
    const start = dayjs2(task.startDate);
    const end = dayjs2(task.endDate);
    return week.some((day) => day.isBetween(start, end, void 0, "[]"));
  });
};
var getTasksForYear = (week, tasks, year) => {
  return tasks.filter((task) => {
    const start = dayjs2(task.startDate);
    const end = dayjs2(task.endDate);
    return week.some((day) => day.isBetween(start, end, void 0, "[]")) && (start.year() === year || end.year() === year);
  });
};

// src/components/DayView.tsx
import dayjs7 from "dayjs";
import { useCallback as useCallback4, useEffect as useEffect2, useMemo, useRef, useState as useState3 } from "react";

// src/hooks/useCreateEventSubmit.ts
import dayjs3 from "dayjs";
import { useCallback as useCallback3 } from "react";
function useCreateEventSubmit(scheduledEvents, setScheduledEvents, onEventCreate, onClose, unscheduledEvents, setUnscheduledEvents) {
  return useCallback3(
    async (data) => {
      const id = `event-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const hasDates = data.startDate != null && data.endDate != null;
      const newEvent = {
        id,
        title: data.name,
        start: hasDates ? data.startDate : null,
        end: hasDates ? data.endDate : null
      };
      if (!hasDates) {
        if (!setUnscheduledEvents) return;
        const prevUnscheduled = [...unscheduledEvents != null ? unscheduledEvents : []];
        setUnscheduledEvents((prev) => [...prev, newEvent]);
        onClose();
        if (onEventCreate) {
          try {
            await onEventCreate({
              id: newEvent.id,
              title: newEvent.title,
              start: null,
              end: null
            });
          } catch (e) {
            setUnscheduledEvents(prevUnscheduled);
          }
        }
        return;
      }
      const prevScheduled = [...scheduledEvents];
      setScheduledEvents((prev) => [...prev, newEvent]);
      onClose();
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
    [
      scheduledEvents,
      setScheduledEvents,
      unscheduledEvents,
      setUnscheduledEvents,
      onEventCreate,
      onClose
    ]
  );
}

// src/utils/eventDisplay.ts
import dayjs4 from "dayjs";
function isAllDayLikeEvent(event) {
  const start = dayjs4(event.start);
  const end = dayjs4(event.end);
  if (!start.isValid() || !end.isValid()) return false;
  const spansAtLeastOneDay = end.diff(start, "day", true) >= 1;
  const startsAtMidnight = start.isSame(start.startOf("day"));
  const endsAtMidnight = end.isSame(end.startOf("day"));
  return spansAtLeastOneDay && startsAtMidnight && endsAtMidnight;
}
function formatEventTimeLabel(event) {
  if (isAllDayLikeEvent(event)) return "";
  const start = dayjs4(event.start);
  const end = dayjs4(event.end);
  if (!start.isValid() || !end.isValid()) return "";
  const fmt = "h:mm A";
  if (start.isSame(end, "day")) {
    return `${start.format(fmt)} \u2013 ${end.format(fmt)}`;
  }
  return `${start.format("MMM D h:mm A")} \u2013 ${end.format("MMM D h:mm A")}`;
}
function getEventChipStyle(event, extra) {
  var _a;
  return __spreadValues({
    backgroundColor: (_a = event.color) != null ? _a : "var(--event-bg, #e0e7ff)",
    border: "1px solid var(--event-border, #c7d2fe)"
  }, extra);
}

// src/utils/timeGrid.ts
import dayjs5 from "dayjs";
function parseHHMM(value) {
  const match = /^(\d{1,2}):(\d{2})$/.exec(value.trim());
  if (!match) return null;
  const hour = Number(match[1]);
  const minute = Number(match[2]);
  if (!Number.isFinite(hour) || !Number.isFinite(minute) || hour < 0 || hour > 23 || minute < 0 || minute > 59) {
    return null;
  }
  return { hour, minute };
}
function hhmmToMinutes(value, fallback) {
  const parsed = parseHHMM(value);
  if (!parsed) return fallback;
  return parsed.hour * 60 + parsed.minute;
}
function snapMinutes(minutes, step = 15) {
  if (!Number.isFinite(minutes)) return 0;
  return Math.max(0, Math.round(minutes / step) * step);
}
function getVisibleHourRange(workdayStart, workdayEnd, showFullDay) {
  if (showFullDay) {
    return { startHour: 0, endHour: 24 };
  }
  const startMin = hhmmToMinutes(workdayStart, 9 * 60);
  const endMin = hhmmToMinutes(workdayEnd, 17 * 60);
  const startHour = Math.max(0, Math.floor(startMin / 60) - 1);
  const endHour = Math.min(24, Math.ceil(endMin / 60) + 1);
  if (endHour <= startHour) {
    return { startHour: 0, endHour: 24 };
  }
  return { startHour, endHour };
}
function formatHourLabel(hour) {
  if (hour === 0) return "12 AM";
  if (hour < 12) return `${hour} AM`;
  if (hour === 12) return "12 PM";
  return `${hour - 12} PM`;
}
function toDatetimeLocalValue(value) {
  if (!value || !value.isValid()) return "";
  return value.format("YYYY-MM-DDTHH:mm");
}
function fromDatetimeLocalValue(value) {
  if (!value) return null;
  const parsed = dayjs5(value);
  return parsed.isValid() ? parsed : null;
}

// src/components/tasks/CreateTaskModal.tsx
import { useEffect, useState as useState2 } from "react";
import { jsx as jsx2, jsxs } from "react/jsx-runtime";
function CreateTaskModal({
  isOpen,
  onClose,
  areaId,
  onSubmit,
  initialStartDate,
  initialEndDate,
  className
}) {
  const [taskName, setTaskName] = useState2("");
  const [startDate, setStartDate] = useState2(
    () => initialStartDate != null ? initialStartDate : null
  );
  const [endDate, setEndDate] = useState2(
    () => initialEndDate != null ? initialEndDate : null
  );
  const [isSubmitting, setIsSubmitting] = useState2(false);
  const datesSeeded = initialStartDate != null || initialEndDate != null;
  const datesPartial = startDate != null && endDate == null || startDate == null && endDate != null;
  useEffect(() => {
    if (!isOpen) return;
    setTaskName("");
    setStartDate(initialStartDate != null ? initialStartDate : null);
    setEndDate(initialEndDate != null ? initialEndDate : null);
  }, [isOpen]);
  const resetFields = () => {
    setTaskName("");
    setStartDate(null);
    setEndDate(null);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (datesPartial) return;
    setIsSubmitting(true);
    try {
      if (onSubmit) {
        await onSubmit({ name: taskName, startDate, endDate });
      } else {
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
      resetFields();
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleCancel = () => {
    resetFields();
    onClose();
  };
  if (!isOpen) return null;
  return /* @__PURE__ */ jsxs(
    "div",
    {
      "data-slot": "create-task-modal",
      role: "dialog",
      "aria-modal": "true",
      "aria-labelledby": "create-task-title",
      className,
      children: [
        /* @__PURE__ */ jsx2(
          "div",
          {
            "data-slot": "create-task-modal-backdrop",
            onClick: handleCancel,
            "aria-hidden": true
          }
        ),
        /* @__PURE__ */ jsxs("div", { "data-slot": "create-task-modal-content", children: [
          /* @__PURE__ */ jsxs("div", { "data-slot": "create-task-modal-header", children: [
            /* @__PURE__ */ jsx2("h2", { id: "create-task-title", "data-slot": "create-task-modal-title", children: "Create New Event" }),
            /* @__PURE__ */ jsx2("button", { type: "button", onClick: handleCancel, "aria-label": "Close", children: "\xD7" })
          ] }),
          /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, "data-slot": "create-task-form", children: [
            /* @__PURE__ */ jsxs("div", { "data-slot": "create-task-fields", children: [
              /* @__PURE__ */ jsx2("label", { htmlFor: "taskName", children: "Event Name" }),
              /* @__PURE__ */ jsx2(
                "input",
                {
                  id: "taskName",
                  type: "text",
                  value: taskName,
                  onChange: (e) => setTaskName(e.target.value),
                  required: true,
                  placeholder: "Enter event name",
                  "data-slot": "create-task-name"
                }
              ),
              /* @__PURE__ */ jsx2("label", { htmlFor: "startDate", children: "Start" }),
              /* @__PURE__ */ jsx2(
                "input",
                {
                  id: "startDate",
                  type: "datetime-local",
                  value: toDatetimeLocalValue(startDate),
                  onChange: (e) => setStartDate(fromDatetimeLocalValue(e.target.value)),
                  required: datesSeeded,
                  "data-slot": "create-task-start"
                }
              ),
              /* @__PURE__ */ jsx2("label", { htmlFor: "endDate", children: "End" }),
              /* @__PURE__ */ jsx2(
                "input",
                {
                  id: "endDate",
                  type: "datetime-local",
                  value: toDatetimeLocalValue(endDate),
                  onChange: (e) => setEndDate(fromDatetimeLocalValue(e.target.value)),
                  required: datesSeeded,
                  min: toDatetimeLocalValue(startDate) || void 0,
                  "data-slot": "create-task-end"
                }
              ),
              areaId && /* @__PURE__ */ jsxs("div", { "data-slot": "create-task-area", children: [
                "Area ID: ",
                areaId
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { "data-slot": "create-task-actions", children: [
              /* @__PURE__ */ jsx2("button", { type: "button", onClick: handleCancel, children: "Cancel" }),
              /* @__PURE__ */ jsx2(
                "button",
                {
                  type: "submit",
                  disabled: isSubmitting || !taskName || datesPartial,
                  children: isSubmitting ? "Creating..." : "Create Event"
                }
              )
            ] })
          ] })
        ] })
      ]
    }
  );
}

// src/components/tasks/TaskModal.tsx
import dayjs6 from "dayjs";
import { jsx as jsx3, jsxs as jsxs2 } from "react/jsx-runtime";
function formatTaskDate(value) {
  if (value == null || value === "") return null;
  const parsed = dayjs6(value);
  return parsed.isValid() ? parsed.format("MMM D, YYYY") : null;
}
function TaskModal({
  task,
  isOpen,
  onClose,
  className
}) {
  if (!isOpen) return null;
  const startLabel = formatTaskDate(task.startDate);
  const endLabel = formatTaskDate(task.endDate);
  return /* @__PURE__ */ jsxs2("div", { "data-slot": "task-modal", role: "dialog", "aria-modal": "true", "aria-labelledby": "task-modal-title", className, children: [
    /* @__PURE__ */ jsx3("div", { "data-slot": "task-modal-backdrop", onClick: onClose, "aria-hidden": true }),
    /* @__PURE__ */ jsxs2("div", { "data-slot": "task-modal-content", children: [
      /* @__PURE__ */ jsxs2("div", { "data-slot": "task-modal-header", children: [
        /* @__PURE__ */ jsx3("h2", { id: "task-modal-title", "data-slot": "task-modal-title", children: "Event Details" }),
        /* @__PURE__ */ jsx3("button", { type: "button", onClick: onClose, "aria-label": "Close", children: "\xD7" })
      ] }),
      /* @__PURE__ */ jsxs2("div", { "data-slot": "task-modal-body", children: [
        /* @__PURE__ */ jsx3("p", { "data-slot": "task-name", children: task.name }),
        startLabel ? /* @__PURE__ */ jsxs2("p", { "data-slot": "task-start", children: [
          "Start: ",
          startLabel
        ] }) : null,
        endLabel ? /* @__PURE__ */ jsxs2("p", { "data-slot": "task-end", children: [
          "End: ",
          endLabel
        ] }) : null
      ] }),
      /* @__PURE__ */ jsx3("div", { "data-slot": "task-modal-actions", children: /* @__PURE__ */ jsx3("button", { type: "button", onClick: onClose, children: "Close" }) })
    ] })
  ] });
}

// src/components/ui/Button.tsx
import { jsx as jsx4 } from "react/jsx-runtime";
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
  return /* @__PURE__ */ jsx4(
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

// src/components/EventActionButtonSlot.tsx
import { jsx as jsx5 } from "react/jsx-runtime";
function EventActionButtonSlot({
  event,
  onOpen,
  EventActionButton
}) {
  if (EventActionButton) {
    return /* @__PURE__ */ jsx5(EventActionButton, { event, onOpen });
  }
  return /* @__PURE__ */ jsx5(
    Button,
    {
      type: "button",
      onMouseDown: (e) => e.stopPropagation(),
      onClick: (e) => {
        e.stopPropagation();
        e.preventDefault();
        onOpen();
      },
      "aria-label": `View ${event.title}`,
      children: "View"
    }
  );
}

// src/components/ui/Title.tsx
import { jsx as jsx6 } from "react/jsx-runtime";
var TAG = { 1: "h1", 2: "h2", 3: "h3", 4: "h4", 5: "h5" };
var Title = ({ level = 4, children, className }) => {
  const Comp = TAG[level];
  return /* @__PURE__ */ jsx6(Comp, { "data-slot": "title", "data-level": level, className, children });
};

// src/components/ui/Tooltip.tsx
import { jsx as jsx7 } from "react/jsx-runtime";
var Tooltip = ({ title, children, className }) => {
  return /* @__PURE__ */ jsx7("div", { "data-slot": "tooltip", className, title, children });
};

// src/components/DayView.tsx
import { jsx as jsx8, jsxs as jsxs3 } from "react/jsx-runtime";
var MIN_EVENT_HEIGHT_PX = 24;
var HOUR_ROW_HEIGHT = 48;
function isFullDayEvent(event, dayStart, dayEnd) {
  const start = dayjs7(event.start);
  const end = dayjs7(event.end);
  return (start.isBefore(dayStart) || start.isSame(dayStart)) && (end.isAfter(dayEnd) || end.isSame(dayEnd));
}
function getEventDayPosition(event, windowStart, windowEnd, hourRowHeight) {
  const start = dayjs7(event.start);
  const end = dayjs7(event.end);
  const visualStart = start.isBefore(windowStart) ? windowStart : start;
  const visualEnd = end.isAfter(windowEnd) ? windowEnd : end;
  if (!visualStart.isBefore(visualEnd) && !visualStart.isSame(visualEnd))
    return null;
  const topPx = visualStart.diff(windowStart, "minute") * (hourRowHeight / 60);
  const heightPx = Math.max(
    MIN_EVENT_HEIGHT_PX,
    visualEnd.diff(visualStart, "minute") * (hourRowHeight / 60)
  );
  return { topPx, heightPx };
}
function DayView({
  startDate,
  setStartDate,
  scheduledEvents,
  unscheduledEvents,
  setScheduledEvents,
  setUnscheduledEvents,
  onEventMove,
  onEventCreate,
  onEventClick,
  onDateClick,
  readOnly = false,
  updateTask = async () => {
  },
  mapFromEvent,
  AddEventButton,
  CreateEventModal,
  EventActionButton,
  EventDetailModal,
  previousDayButtonContent = "\u2190",
  nextDayButtonContent = "\u2192",
  todayButtonContent = "Today",
  todayButtonClassName,
  todayButtonStyle,
  labels,
  defaultDurationMinutes = 60,
  workdayStart = "09:00",
  workdayEnd = "17:00",
  showFullDay = false,
  className,
  style
}) {
  var _a, _b;
  const [isTaskOpen, setIsTaskOpen] = useState3(false);
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState3(false);
  const [selectedEvent, setSelectedEvent] = useState3(
    null
  );
  const [createSeedStart, setCreateSeedStart] = useState3(null);
  const [createSeedEnd, setCreateSeedEnd] = useState3(null);
  const gridScrollRef = useRef(null);
  const dayEventsRef = useRef(null);
  const openTask = () => setIsTaskOpen(true);
  const closeTask = () => {
    setIsTaskOpen(false);
    setSelectedEvent(null);
  };
  const closeCreateTask = () => {
    setIsCreateTaskOpen(false);
    setCreateSeedStart(null);
    setCreateSeedEnd(null);
  };
  const openUnscheduledCreate = () => {
    setCreateSeedStart(null);
    setCreateSeedEnd(null);
    setIsCreateTaskOpen(true);
  };
  const openCreateTask = async (at) => {
    const start = at != null ? at : startDate.hour(9).minute(0).second(0).millisecond(0);
    const end = start.add(defaultDurationMinutes, "minute");
    if (onDateClick) {
      try {
        await onDateClick(start, "day");
      } catch (e) {
        return;
      }
    }
    setCreateSeedStart(start);
    setCreateSeedEnd(end);
    setIsCreateTaskOpen(true);
  };
  const dayTitle = useMemo(
    () => startDate.format("dddd, MMM D, YYYY"),
    [startDate]
  );
  const { startHour, endHour } = useMemo(
    () => getVisibleHourRange(workdayStart, workdayEnd, showFullDay),
    [workdayStart, workdayEnd, showFullDay]
  );
  const hours = useMemo(
    () => Array.from({ length: endHour - startHour }, (_, i) => startHour + i),
    [startHour, endHour]
  );
  const hourCount = hours.length;
  const dayStart = useMemo(() => startDate.startOf("day"), [startDate]);
  const dayEnd = useMemo(() => startDate.endOf("day"), [startDate]);
  const windowStart = useMemo(
    () => dayStart.add(startHour, "hour"),
    [dayStart, startHour]
  );
  const windowEnd = useMemo(
    () => dayStart.add(endHour, "hour"),
    [dayStart, endHour]
  );
  const workdayStartMin = hhmmToMinutes(workdayStart, 9 * 60);
  const workdayEndMin = hhmmToMinutes(workdayEnd, 17 * 60);
  const [now, setNow] = useState3(() => dayjs7());
  const isViewingToday = startDate.isSame(now, "day");
  useEffect2(() => {
    if (!isViewingToday) return;
    const t = setInterval(() => setNow(dayjs7()), 6e4);
    return () => clearInterval(t);
  }, [isViewingToday]);
  useEffect2(() => {
    if (!isViewingToday || !gridScrollRef.current) return;
    const current = dayjs7();
    if (current.isBefore(windowStart) || !current.isBefore(windowEnd)) return;
    const top = current.diff(windowStart, "minute") * (HOUR_ROW_HEIGHT / 60) - HOUR_ROW_HEIGHT * 2;
    gridScrollRef.current.scrollTop = Math.max(0, top);
  }, [isViewingToday, startDate, windowStart, windowEnd]);
  const eventsForDay = useMemo(() => {
    return scheduledEvents.filter((event) => {
      const eventStart = dayjs7(event.start);
      const eventEnd = dayjs7(event.end);
      return (eventStart.isSame(dayStart) || eventStart.isBefore(dayEnd)) && (eventEnd.isSame(dayEnd) || eventEnd.isAfter(dayStart));
    });
  }, [scheduledEvents, dayStart, dayEnd]);
  const { fullDayEvents, timedEvents } = useMemo(() => {
    const full = [];
    const timed = [];
    for (const event of eventsForDay) {
      if (isFullDayEvent(event, dayStart, dayEnd)) full.push(event);
      else timed.push(event);
    }
    return { fullDayEvents: full, timedEvents: timed };
  }, [eventsForDay, dayStart, dayEnd]);
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
  const handleToday = () => {
    setStartDate(dayjs7());
  };
  const handleHourClick = (hour) => {
    if (readOnly) return;
    void openCreateTask(dayStart.hour(hour).minute(0).second(0).millisecond(0));
  };
  const handleEventsColumnClick = (e) => {
    var _a2, _b2;
    if (readOnly) return;
    if (e.target.closest('[data-slot="event"]')) return;
    const el = dayEventsRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const y = e.clientY - rect.top + ((_b2 = (_a2 = gridScrollRef.current) == null ? void 0 : _a2.scrollTop) != null ? _b2 : 0);
    const minutesFromWindow = snapMinutes(y / HOUR_ROW_HEIGHT * 60);
    const at = windowStart.add(minutesFromWindow, "minute");
    if (at.isBefore(windowStart) || !at.isBefore(windowEnd)) return;
    void openCreateTask(at);
  };
  const handleUnassignedEventDrop = useCallback4(
    (event, clientY) => {
      const oldStart = dayjs7(event.start);
      const oldEnd = dayjs7(event.end);
      let newStart = dayStart.add(workdayStartMin, "minute").second(0).millisecond(0);
      if (clientY != null && dayEventsRef.current && gridScrollRef.current) {
        const rect = dayEventsRef.current.getBoundingClientRect();
        if (clientY >= rect.top && clientY <= rect.bottom) {
          const y = clientY - rect.top + gridScrollRef.current.scrollTop;
          const minutesFromWindow = snapMinutes(y / HOUR_ROW_HEIGHT * 60);
          newStart = windowStart.add(minutesFromWindow, "minute");
          if (newStart.isBefore(windowStart)) newStart = windowStart.clone();
          const lastStart = windowEnd.subtract(
            defaultDurationMinutes,
            "minute"
          );
          if (newStart.isAfter(lastStart)) newStart = lastStart;
        }
      }
      const existingDuration = oldEnd.diff(oldStart, "minute");
      const durationMinutes = !isAllDayLikeEvent(event) && existingDuration > 0 ? existingDuration : defaultDurationMinutes;
      const newEnd = newStart.add(durationMinutes, "minute");
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
              view: "day"
            });
          } catch (e) {
            setScheduledEvents(prevScheduled);
            setUnscheduledEvents(prevUnscheduled);
          }
        })();
      }
    },
    [
      windowStart,
      windowEnd,
      dayStart,
      workdayStartMin,
      defaultDurationMinutes,
      scheduledEvents,
      unscheduledEvents,
      setScheduledEvents,
      setUnscheduledEvents,
      onEventMove
    ]
  );
  const handleCreateSubmit = useCreateEventSubmit(
    scheduledEvents,
    setScheduledEvents,
    onEventCreate,
    closeCreateTask,
    unscheduledEvents,
    setUnscheduledEvents
  );
  const showNowLine = isViewingToday && !now.isBefore(windowStart) && now.isBefore(windowEnd);
  return /* @__PURE__ */ jsxs3("div", { "data-slot": "day-view", className, style, children: [
    /* @__PURE__ */ jsxs3("div", { "data-slot": "day-view-nav", children: [
      /* @__PURE__ */ jsx8(
        Button,
        {
          type: "button",
          onClick: handlePreviousDay,
          "aria-label": "Previous day",
          children: previousDayButtonContent
        }
      ),
      /* @__PURE__ */ jsx8(Title, { level: 4, children: dayTitle }),
      /* @__PURE__ */ jsx8(
        Button,
        {
          type: "button",
          onClick: handleToday,
          "data-slot": "today-button",
          className: todayButtonClassName,
          style: todayButtonStyle,
          "aria-label": typeof todayButtonContent === "string" ? todayButtonContent : "Today",
          children: todayButtonContent
        }
      ),
      /* @__PURE__ */ jsx8(Button, { type: "button", onClick: handleNextDay, "aria-label": "Next day", children: nextDayButtonContent })
    ] }),
    fullDayEvents.length > 0 && /* @__PURE__ */ jsxs3("div", { "data-slot": "day-multiday", children: [
      /* @__PURE__ */ jsx8("h3", { "data-slot": "day-multiday-title", children: "All-day / multi-day" }),
      /* @__PURE__ */ jsx8("div", { "data-slot": "day-multiday-items", children: fullDayEvents.map((event) => {
        var _a2;
        return /* @__PURE__ */ jsxs3(
          "div",
          {
            "data-slot": "event",
            "data-event-id": event.id,
            "data-allday": true,
            "data-color": (_a2 = event.color) != null ? _a2 : void 0,
            style: getEventChipStyle(event),
            children: [
              /* @__PURE__ */ jsx8("span", { children: event.title }),
              /* @__PURE__ */ jsx8(
                EventActionButtonSlot,
                {
                  event,
                  onOpen: () => handleOpenEvent(event),
                  EventActionButton
                }
              )
            ]
          },
          event.id
        );
      }) })
    ] }),
    /* @__PURE__ */ jsxs3(
      "div",
      {
        ref: gridScrollRef,
        "data-slot": "day-view-grid",
        style: {
          display: "grid",
          gridTemplateColumns: "4rem 1fr",
          gridTemplateRows: `repeat(${hourCount}, ${HOUR_ROW_HEIGHT}px)`,
          maxHeight: Math.min(hourCount, 12) * HOUR_ROW_HEIGHT,
          overflowY: "auto"
        },
        children: [
          hours.map((hour, index) => {
            const minuteOfDay = hour * 60;
            const outsideWork = showFullDay && (minuteOfDay < workdayStartMin || minuteOfDay >= workdayEndMin);
            return /* @__PURE__ */ jsx8(
              "div",
              {
                "data-slot": outsideWork ? "day-hour-outside-workday" : "day-hour",
                "data-hour": hour,
                role: readOnly ? void 0 : "button",
                tabIndex: readOnly ? void 0 : 0,
                "aria-label": readOnly ? void 0 : `Create event at ${formatHourLabel(hour)}`,
                onClick: () => handleHourClick(hour),
                onKeyDown: (e) => {
                  if (readOnly) return;
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleHourClick(hour);
                  }
                },
                style: {
                  gridRow: index + 1,
                  minHeight: HOUR_ROW_HEIGHT,
                  cursor: readOnly ? "default" : "pointer"
                },
                children: formatHourLabel(hour)
              },
              hour
            );
          }),
          /* @__PURE__ */ jsxs3(
            "div",
            {
              ref: dayEventsRef,
              "data-slot": "day-events",
              onClick: handleEventsColumnClick,
              style: {
                gridColumn: 2,
                gridRow: "1 / -1",
                minHeight: hourCount * HOUR_ROW_HEIGHT,
                position: "relative",
                borderLeft: "1px solid #f3f4f6",
                cursor: readOnly ? "default" : "pointer"
              },
              children: [
                showNowLine && /* @__PURE__ */ jsx8(
                  "div",
                  {
                    "data-slot": "day-now-line",
                    "aria-hidden": true,
                    style: {
                      position: "absolute",
                      left: 0,
                      right: 0,
                      top: now.diff(windowStart, "minute") * (HOUR_ROW_HEIGHT / 60),
                      height: 0,
                      borderTop: "2px solid var(--now-line-color, #dc2626)",
                      pointerEvents: "none",
                      zIndex: 2
                    }
                  }
                ),
                timedEvents.length === 0 ? /* @__PURE__ */ jsx8(
                  "p",
                  {
                    "data-slot": "day-no-events",
                    style: {
                      position: "absolute",
                      top: "1rem",
                      left: "1rem",
                      right: "1rem",
                      textAlign: "center",
                      margin: 0,
                      pointerEvents: "none"
                    },
                    children: "No events scheduled"
                  }
                ) : timedEvents.map((event) => {
                  var _a2;
                  const pos = getEventDayPosition(
                    event,
                    windowStart,
                    windowEnd,
                    HOUR_ROW_HEIGHT
                  );
                  if (!pos) return null;
                  const timeLabel = formatEventTimeLabel(event);
                  return /* @__PURE__ */ jsxs3(
                    "div",
                    {
                      "data-slot": "event",
                      "data-event-id": event.id,
                      "data-color": (_a2 = event.color) != null ? _a2 : void 0,
                      style: getEventChipStyle(event, {
                        position: "absolute",
                        left: 4,
                        right: 4,
                        top: pos.topPx,
                        height: pos.heightPx,
                        boxSizing: "border-box",
                        padding: "2px 6px",
                        overflow: "hidden",
                        cursor: "pointer"
                      }),
                      children: [
                        /* @__PURE__ */ jsxs3("span", { children: [
                          timeLabel ? /* @__PURE__ */ jsxs3("span", { "data-slot": "event-time", children: [
                            timeLabel,
                            " "
                          ] }) : null,
                          event.title
                        ] }),
                        /* @__PURE__ */ jsx8(
                          EventActionButtonSlot,
                          {
                            event,
                            onOpen: () => handleOpenEvent(event),
                            EventActionButton
                          }
                        )
                      ]
                    },
                    event.id
                  );
                })
              ]
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxs3("div", { "data-slot": "unscheduled-list", children: [
      /* @__PURE__ */ jsx8("h3", { "data-slot": "unscheduled-title", children: (_a = labels == null ? void 0 : labels.unscheduledTitle) != null ? _a : "Unscheduled events" }),
      !readOnly && (AddEventButton ? /* @__PURE__ */ jsx8(AddEventButton, { onClick: openUnscheduledCreate }) : /* @__PURE__ */ jsx8(Tooltip, { title: "Add new event", children: /* @__PURE__ */ jsx8(
        Button,
        {
          type: "button",
          onClick: openUnscheduledCreate,
          "aria-label": "Add event",
          children: "+"
        }
      ) })),
      CreateEventModal ? /* @__PURE__ */ jsx8(
        CreateEventModal,
        {
          isOpen: isCreateTaskOpen,
          onClose: closeCreateTask,
          onSubmit: handleCreateSubmit,
          initialStartDate: createSeedStart,
          initialEndDate: createSeedEnd
        }
      ) : /* @__PURE__ */ jsx8(
        CreateTaskModal,
        {
          isOpen: isCreateTaskOpen,
          onClose: closeCreateTask,
          onSubmit: handleCreateSubmit,
          initialStartDate: createSeedStart,
          initialEndDate: createSeedEnd
        }
      ),
      /* @__PURE__ */ jsx8("div", { "data-slot": "unscheduled-items", children: unscheduledEvents.map((event) => {
        var _a2;
        return /* @__PURE__ */ jsx8(
          "div",
          {
            "data-slot": "unscheduled-event",
            "data-event-id": event.id,
            "data-color": (_a2 = event.color) != null ? _a2 : void 0,
            style: getEventChipStyle(event),
            draggable: !readOnly,
            onDragEnd: (e) => {
              if (!readOnly) handleUnassignedEventDrop(event, e.clientY);
            },
            onDoubleClick: () => handleOpenEvent(event),
            children: event.title
          },
          event.id
        );
      }) }),
      unscheduledEvents.length > 0 && !readOnly && /* @__PURE__ */ jsx8("p", { "data-slot": "unscheduled-hint", children: (_b = labels == null ? void 0 : labels.unscheduledHint) != null ? _b : "Drag an event onto a time above to schedule it, or double-click to view." })
    ] }),
    selectedEvent && (EventDetailModal ? /* @__PURE__ */ jsx8(
      EventDetailModal,
      {
        task: mapFromEvent ? mapFromEvent(selectedEvent) : {
          id: selectedEvent.id,
          name: selectedEvent.title,
          startDate: selectedEvent.start,
          endDate: selectedEvent.end,
          employees: []
        },
        isOpen: isTaskOpen,
        onClose: closeTask,
        updateTask
      }
    ) : mapFromEvent ? /* @__PURE__ */ jsx8(
      TaskModal,
      {
        task: mapFromEvent(selectedEvent),
        isOpen: isTaskOpen,
        onClose: closeTask,
        updateTask
      }
    ) : null)
  ] });
}

// src/components/MonthView.tsx
import dayjs9 from "dayjs";
import { useMemo as useMemo2, useState as useState5 } from "react";

// src/components/Week.tsx
import dayjs8 from "dayjs";
import { useEffect as useEffect3, useRef as useRef2, useState as useState4 } from "react";

// src/components/ui/Text.tsx
import { jsx as jsx9 } from "react/jsx-runtime";
var Text = ({ children, className }) => {
  return /* @__PURE__ */ jsx9("span", { "data-slot": "text", className, children });
};

// src/components/Week.tsx
import { jsx as jsx10, jsxs as jsxs4 } from "react/jsx-runtime";
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
  mapFromEvent,
  EventDetailModal,
  weekStartsOn = 0,
  maxEventsPerDay = 3
}) {
  const [isTaskOpen, setIsTaskOpen] = useState4(false);
  const [selectedEvent, setSelectedEvent] = useState4(
    null
  );
  const [moreDayKey, setMoreDayKey] = useState4(null);
  const morePopoverRef = useRef2(null);
  const usePerDayLayout = view === "month" || view === "year" || isMonthView;
  useEffect3(() => {
    if (!moreDayKey) return;
    const onDocClick = (e) => {
      if (morePopoverRef.current && !morePopoverRef.current.contains(e.target)) {
        setMoreDayKey(null);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [moreDayKey]);
  const openTask = () => setIsTaskOpen(true);
  const closeTask = () => {
    setIsTaskOpen(false);
    setSelectedEvent(null);
  };
  const handleEventClick = async (event) => {
    setMoreDayKey(null);
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
  const detailTask = selectedEvent ? mapFromEvent ? mapFromEvent(selectedEvent) : {
    id: selectedEvent.id,
    name: selectedEvent.title,
    startDate: selectedEvent.start,
    endDate: selectedEvent.end,
    employees: []
  } : null;
  const leadingEmpty = days.length ? getLeadingEmptyCount(days[0], weekStartsOn) : 0;
  const renderDayHeader = (day, index) => {
    const isCurrentMonth = day.month() === currentMonth;
    if (!isCurrentMonth) {
      return /* @__PURE__ */ jsx10("div", { "data-slot": "week-day-spacer" }, `empty-${index}`);
    }
    return /* @__PURE__ */ jsxs4(
      "div",
      {
        "data-slot": "week-day",
        "data-date": day.format("YYYY-MM-DD"),
        children: [
          /* @__PURE__ */ jsx10(Text, { children: day.format("D") }),
          !readOnly && /* @__PURE__ */ jsx10(Tooltip, { title: "Add event", children: /* @__PURE__ */ jsx10(
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
        ]
      },
      index
    );
  };
  const renderPerDayCell = (day, index) => {
    const isCurrentMonth = day.month() === currentMonth;
    if (!isCurrentMonth) {
      return /* @__PURE__ */ jsx10("div", { "data-slot": "week-day-spacer" }, `empty-cell-${index}`);
    }
    const dayKey = day.format("YYYY-MM-DD");
    const dayEvents = getEventsForDay(day, events);
    const visible = dayEvents.slice(0, maxEventsPerDay);
    const overflow = dayEvents.length - visible.length;
    const showMore = moreDayKey === dayKey;
    return /* @__PURE__ */ jsxs4(
      "div",
      {
        "data-slot": "week-day-cell",
        "data-date": dayKey,
        style: { position: "relative", minWidth: 0 },
        children: [
          /* @__PURE__ */ jsxs4("div", { "data-slot": "week-day", children: [
            /* @__PURE__ */ jsx10(Text, { children: day.format("D") }),
            !readOnly && /* @__PURE__ */ jsx10(Tooltip, { title: "Add event", children: /* @__PURE__ */ jsx10(
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
          ] }),
          /* @__PURE__ */ jsxs4("div", { "data-slot": "week-day-events", children: [
            visible.map((event) => {
              var _a;
              const timeLabel = formatEventTimeLabel(event);
              return /* @__PURE__ */ jsxs4(
                "div",
                {
                  "data-slot": "event",
                  "data-event-id": event.id,
                  "data-color": (_a = event.color) != null ? _a : void 0,
                  style: getEventChipStyle(event),
                  onClick: (e) => {
                    e.stopPropagation();
                    void handleEventClick(event);
                  },
                  children: [
                    timeLabel ? /* @__PURE__ */ jsxs4("span", { "data-slot": "event-time", children: [
                      timeLabel,
                      " "
                    ] }) : null,
                    event.title
                  ]
                },
                event.id
              );
            }),
            overflow > 0 && /* @__PURE__ */ jsxs4("div", { "data-slot": "day-more-wrap", ref: showMore ? morePopoverRef : void 0, children: [
              /* @__PURE__ */ jsxs4(
                "button",
                {
                  type: "button",
                  "data-slot": "day-more",
                  "aria-expanded": showMore,
                  "aria-label": `${overflow} more events`,
                  onClick: (e) => {
                    e.stopPropagation();
                    setMoreDayKey(showMore ? null : dayKey);
                  },
                  children: [
                    "+",
                    overflow,
                    " more"
                  ]
                }
              ),
              showMore && /* @__PURE__ */ jsx10("div", { "data-slot": "day-more-popover", role: "listbox", children: dayEvents.slice(maxEventsPerDay).map((event) => {
                const timeLabel = formatEventTimeLabel(event);
                return /* @__PURE__ */ jsxs4(
                  "button",
                  {
                    type: "button",
                    "data-slot": "day-more-item",
                    role: "option",
                    style: getEventChipStyle(event),
                    onClick: (e) => {
                      e.stopPropagation();
                      void handleEventClick(event);
                    },
                    children: [
                      timeLabel ? /* @__PURE__ */ jsxs4("span", { "data-slot": "event-time", children: [
                        timeLabel,
                        " "
                      ] }) : null,
                      event.title
                    ]
                  },
                  event.id
                );
              }) })
            ] })
          ] })
        ]
      },
      dayKey
    );
  };
  const eventsForWeek = events.filter(
    (event) => days.some(
      (day) => dayjs8(day).isBetween(
        dayjs8(event.start),
        dayjs8(event.end),
        void 0,
        "[]"
      )
    )
  );
  if (usePerDayLayout) {
    return /* @__PURE__ */ jsxs4("div", { "data-slot": "week", "data-month-view": isMonthView ? "true" : void 0, children: [
      /* @__PURE__ */ jsxs4(
        "div",
        {
          "data-slot": "week-days",
          style: { display: "grid", gridTemplateColumns: "repeat(7, 1fr)" },
          children: [
            Array.from({ length: leadingEmpty }).map((_, index) => /* @__PURE__ */ jsx10("div", { "data-slot": "week-day-spacer" }, `lead-${index}`)),
            days.map((day, index) => renderPerDayCell(day, index))
          ]
        }
      ),
      selectedEvent && detailTask && (EventDetailModal ? /* @__PURE__ */ jsx10(
        EventDetailModal,
        {
          task: detailTask,
          isOpen: isTaskOpen,
          onClose: closeTask,
          updateTask
        }
      ) : mapFromEvent ? /* @__PURE__ */ jsx10(
        TaskModal,
        {
          task: detailTask,
          isOpen: isTaskOpen,
          onClose: closeTask,
          updateTask
        }
      ) : null)
    ] });
  }
  return /* @__PURE__ */ jsxs4("div", { "data-slot": "week", "data-month-view": isMonthView ? "true" : void 0, children: [
    /* @__PURE__ */ jsxs4(
      "div",
      {
        "data-slot": "week-days",
        style: { display: "grid", gridTemplateColumns: "repeat(7, 1fr)" },
        children: [
          Array.from({ length: leadingEmpty }).map((_, index) => /* @__PURE__ */ jsx10("div", { "data-slot": "week-day-spacer" }, `lead-${index}`)),
          days.map((day, index) => renderDayHeader(day, index))
        ]
      }
    ),
    /* @__PURE__ */ jsx10(
      "div",
      {
        "data-slot": "week-events",
        style: { display: "grid", gridTemplateColumns: "repeat(7, 1fr)" },
        children: eventsForWeek.slice(0, maxEventsPerDay).map((event, eventIndex) => {
          var _a;
          const eventStart = dayjs8(event.start);
          const eventEnd = dayjs8(event.end);
          const weekStart = dayjs8(days[0]);
          const weekEnd = dayjs8(days[days.length - 1]);
          const actualStart = dayjs8.max(eventStart, weekStart);
          const actualEnd = dayjs8.min(eventEnd, weekEnd);
          const startColumn = days.findIndex(
            (d) => d.isSame(actualStart, "day")
          );
          if (startColumn < 0) return null;
          const eventSpan = Math.max(
            1,
            actualEnd.diff(actualStart, "days") + 1
          );
          const endColumn = startColumn + eventSpan - 1;
          const timeLabel = formatEventTimeLabel(event);
          return /* @__PURE__ */ jsxs4(
            "div",
            {
              "data-slot": "event",
              "data-event-id": event.id,
              "data-color": (_a = event.color) != null ? _a : void 0,
              style: __spreadValues({
                gridColumn: `${startColumn + 1} / ${endColumn + 2}`
              }, getEventChipStyle(event)),
              onClick: (e) => {
                e.stopPropagation();
                void handleEventClick(event);
              },
              children: [
                timeLabel ? /* @__PURE__ */ jsxs4("span", { "data-slot": "event-time", children: [
                  timeLabel,
                  " "
                ] }) : null,
                event.title
              ]
            },
            eventIndex
          );
        })
      }
    ),
    selectedEvent && detailTask && (EventDetailModal ? /* @__PURE__ */ jsx10(
      EventDetailModal,
      {
        task: detailTask,
        isOpen: isTaskOpen,
        onClose: closeTask,
        updateTask
      }
    ) : mapFromEvent ? /* @__PURE__ */ jsx10(
      TaskModal,
      {
        task: detailTask,
        isOpen: isTaskOpen,
        onClose: closeTask,
        updateTask
      }
    ) : null)
  ] });
}

// src/components/MonthView.tsx
import { jsx as jsx11, jsxs as jsxs5 } from "react/jsx-runtime";
function MonthView({
  events,
  setEvents,
  setStartDate,
  setZoomLevel,
  onEventClick,
  onDateClick,
  onEventCreate,
  readOnly = false,
  updateTask = async () => {
  },
  mapFromEvent,
  AddEventButton,
  CreateEventModal,
  EventDetailModal,
  previousMonthButtonContent = "\u2190",
  nextMonthButtonContent = "\u2192",
  weekStartsOn = 0,
  maxEventsPerDay = 3,
  className,
  style
}) {
  var _a;
  const [currentMonth, setCurrentMonth] = useState5(dayjs9().month());
  const [currentYear, setCurrentYear] = useState5(dayjs9().year());
  const [selectedDate, setSelectedDate] = useState5(null);
  const [isModalOpen, setIsModalOpen] = useState5(false);
  const openModalWithDate = (date) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDate(null);
  };
  const handleCreateSubmit = useCreateEventSubmit(
    events,
    setEvents,
    onEventCreate,
    closeModal
  );
  const calendarData = useMemo2(
    () => generateCalendarWeeks(currentYear, weekStartsOn),
    [currentYear, weekStartsOn]
  );
  const weekdayLabels = useMemo2(
    () => getWeekdayLabels(weekStartsOn),
    [weekStartsOn]
  );
  const getEventsForWeekInMonth = (week) => getEventsForWeek(week, events);
  const handlePreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };
  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };
  const createInitialStart = (_a = selectedDate == null ? void 0 : selectedDate.startOf("day")) != null ? _a : dayjs9().startOf("day");
  const createInitialEnd = createInitialStart.add(1, "day");
  const monthTitle = dayjs9(
    `${currentYear}-${currentMonth + 1}-01`
  ).format("MMMM YYYY");
  return /* @__PURE__ */ jsxs5("div", { "data-slot": "month-view", className, style, children: [
    /* @__PURE__ */ jsxs5("div", { "data-slot": "month-view-nav", children: [
      /* @__PURE__ */ jsx11(
        Button,
        {
          type: "button",
          onClick: handlePreviousMonth,
          "aria-label": "Previous month",
          children: previousMonthButtonContent
        }
      ),
      /* @__PURE__ */ jsx11(Title, { level: 4, children: monthTitle }),
      /* @__PURE__ */ jsx11(Button, { type: "button", onClick: handleNextMonth, "aria-label": "Next month", children: nextMonthButtonContent }),
      !readOnly && (AddEventButton ? /* @__PURE__ */ jsx11(AddEventButton, { onClick: () => openModalWithDate(dayjs9()) }) : /* @__PURE__ */ jsx11(Tooltip, { title: "Add new event", children: /* @__PURE__ */ jsx11(
        Button,
        {
          type: "button",
          onClick: () => openModalWithDate(dayjs9()),
          "aria-label": "Add event",
          children: "+"
        }
      ) }))
    ] }),
    /* @__PURE__ */ jsxs5("div", { "data-slot": "month-view-body", children: [
      /* @__PURE__ */ jsx11("div", { "data-slot": "month-view-weekdays", children: weekdayLabels.map((day) => /* @__PURE__ */ jsx11("div", { "data-slot": "month-weekday", children: day }, day)) }),
      /* @__PURE__ */ jsx11("div", { "data-slot": "month-view-weeks", children: calendarData.filter((week) => week.some((day) => day.month() === currentMonth)).map((week, weekIndex) => /* @__PURE__ */ jsxs5("div", { "data-slot": "month-week", children: [
        /* @__PURE__ */ jsx11(
          "button",
          {
            type: "button",
            "data-slot": "month-week-go-week",
            onClick: () => {
              setStartDate(week[0]);
              setZoomLevel("week");
            },
            "aria-label": "Go to week",
            children: "\u2192"
          }
        ),
        /* @__PURE__ */ jsx11(
          Week,
          {
            days: week,
            events: getEventsForWeekInMonth(week),
            onSelectDate: openModalWithDate,
            currentMonth,
            isMonthView: true,
            view: "month",
            readOnly,
            onEventClick,
            onDateClick,
            updateTask,
            mapFromEvent,
            EventDetailModal,
            weekStartsOn,
            maxEventsPerDay
          }
        )
      ] }, weekIndex)) })
    ] }),
    CreateEventModal ? /* @__PURE__ */ jsx11(
      CreateEventModal,
      {
        isOpen: isModalOpen,
        onClose: closeModal,
        onSubmit: handleCreateSubmit,
        initialStartDate: createInitialStart,
        initialEndDate: createInitialEnd
      }
    ) : /* @__PURE__ */ jsx11(
      CreateTaskModal,
      {
        isOpen: isModalOpen,
        onClose: closeModal,
        onSubmit: handleCreateSubmit,
        initialStartDate: createInitialStart,
        initialEndDate: createInitialEnd
      }
    )
  ] });
}

// src/components/WeekView.tsx
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import dayjs11 from "dayjs";
import { useCallback as useCallback5, useEffect as useEffect4, useMemo as useMemo4, useRef as useRef3, useState as useState6 } from "react";

// src/utils/weekViewLayout.ts
import dayjs10 from "dayjs";
function getEventPlacement(event, weekStart, containerWidth, resizeOverlay) {
  if (containerWidth <= 0) return null;
  const eventStart = dayjs10(event.start);
  const eventEnd = dayjs10(event.end);
  const weekEnd = weekStart.add(6, "days");
  const actualStart = eventStart.isBefore(weekStart) ? weekStart : eventStart;
  const actualEnd = eventEnd.isAfter(weekEnd) ? weekEnd : eventEnd;
  let startOffsetDays = actualStart.diff(weekStart, "days");
  let durationDays = actualEnd.diff(actualStart, "days") + 1;
  if (durationDays <= 0) return null;
  if (resizeOverlay) {
    startOffsetDays += resizeOverlay.leftDeltaDays;
    durationDays += resizeOverlay.rightDeltaDays;
    if (durationDays <= 0) return null;
  }
  const columnWidth = containerWidth / 7;
  const leftPx = startOffsetDays * columnWidth;
  const widthPx = durationDays * columnWidth;
  return {
    leftPx,
    widthPx,
    startOffsetDays,
    durationDays,
    columnWidth
  };
}
function pixelDeltaToDayDelta(deltaPx, columnWidth) {
  if (columnWidth <= 0) return 0;
  return Math.round(deltaPx / columnWidth);
}
function getOverlapRowAssignments(placements) {
  if (placements.length === 0) return { rowIndices: [], numRows: 0 };
  const n = placements.length;
  const indices = placements.map((_, i) => i);
  indices.sort((a, b) => {
    const pa = placements[a];
    const pb = placements[b];
    if (pa.startOffsetDays !== pb.startOffsetDays) return pa.startOffsetDays - pb.startOffsetDays;
    return pb.durationDays - pa.durationDays;
  });
  const rowEnd = [];
  const rowIndices = new Array(n);
  for (const idx of indices) {
    const start = placements[idx].startOffsetDays;
    const end = start + placements[idx].durationDays;
    let r = 0;
    while (r < rowEnd.length && rowEnd[r] > start) r++;
    if (r === rowEnd.length) rowEnd.push(0);
    rowIndices[idx] = r;
    rowEnd[r] = end;
  }
  const numRows = rowEnd.length;
  return { rowIndices, numRows };
}

// src/components/WeekEventCard.tsx
import { useDraggable } from "@dnd-kit/core";
import { useMemo as useMemo3 } from "react";
import { Fragment, jsx as jsx12, jsxs as jsxs6 } from "react/jsx-runtime";
var ROW_HEIGHT = 50;
function WeekEventCard({
  event,
  placement,
  rowIndex,
  readOnly,
  onOpen,
  dragDeltaX,
  onResizeStart,
  EventActionButton
}) {
  var _a;
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: event.id,
    disabled: readOnly
  });
  const style = useMemo3(
    () => {
      var _a2;
      return {
        position: "absolute",
        left: placement.leftPx,
        top: rowIndex * ROW_HEIGHT,
        width: placement.widthPx,
        height: ROW_HEIGHT,
        transform: dragDeltaX != null ? `translateX(${dragDeltaX}px)` : void 0,
        boxSizing: "border-box",
        backgroundColor: (_a2 = event.color) != null ? _a2 : "var(--event-bg, #e0e7ff)",
        border: "1px solid var(--event-border, #c7d2fe)",
        borderRadius: 4,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 4px",
        cursor: readOnly ? "default" : "grab",
        zIndex: isDragging ? 1 : 0
      };
    },
    [
      placement.leftPx,
      placement.widthPx,
      rowIndex,
      dragDeltaX,
      event.color,
      readOnly,
      isDragging
    ]
  );
  const timeLabel = formatEventTimeLabel(event);
  return /* @__PURE__ */ jsxs6(
    "div",
    __spreadProps(__spreadValues({
      ref: setNodeRef,
      "data-slot": "event",
      "data-event-id": event.id,
      "data-color": (_a = event.color) != null ? _a : void 0,
      style
    }, readOnly ? {} : __spreadValues(__spreadValues({}, attributes), listeners)), {
      children: [
        !readOnly && /* @__PURE__ */ jsxs6(Fragment, { children: [
          /* @__PURE__ */ jsx12(
            "div",
            {
              role: "button",
              tabIndex: 0,
              "aria-label": "Resize start",
              onPointerDown: (e) => {
                e.stopPropagation();
                onResizeStart(event.id, "left", e.clientX);
              },
              style: {
                position: "absolute",
                left: 0,
                top: 0,
                bottom: 0,
                width: 8,
                cursor: "ew-resize"
              }
            }
          ),
          /* @__PURE__ */ jsx12(
            "div",
            {
              role: "button",
              tabIndex: 0,
              "aria-label": "Resize end",
              onPointerDown: (e) => {
                e.stopPropagation();
                onResizeStart(event.id, "right", e.clientX);
              },
              style: {
                position: "absolute",
                right: 0,
                top: 0,
                bottom: 0,
                width: 8,
                cursor: "ew-resize"
              }
            }
          )
        ] }),
        /* @__PURE__ */ jsxs6(
          "span",
          {
            style: {
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              flex: 1
            },
            children: [
              timeLabel ? /* @__PURE__ */ jsxs6("span", { "data-slot": "event-time", children: [
                timeLabel,
                " "
              ] }) : null,
              event.title
            ]
          }
        ),
        /* @__PURE__ */ jsx12(
          EventActionButtonSlot,
          {
            event,
            onOpen,
            EventActionButton
          }
        )
      ]
    })
  );
}

// src/components/WeekView.tsx
import { jsx as jsx13, jsxs as jsxs7 } from "react/jsx-runtime";
var ROW_HEIGHT2 = 50;
function WeekView({
  startDate,
  scheduledEvents,
  unscheduledEvents,
  setScheduledEvents,
  setUnscheduledEvents,
  setStartDate,
  onEventMove,
  onEventResize,
  onEventCreate,
  onEventClick,
  readOnly = false,
  updateTask = async () => {
  },
  mapFromEvent,
  AddEventButton,
  CreateEventModal,
  EventActionButton,
  EventDetailModal,
  previousWeekButtonContent = "\u2190",
  nextWeekButtonContent = "\u2192",
  todayButtonContent = "Today",
  todayButtonClassName,
  todayButtonStyle,
  labels,
  className,
  style
}) {
  var _a, _b;
  const [isTaskOpen, setIsTaskOpen] = useState6(false);
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState6(false);
  const [selectedEvent, setSelectedEvent] = useState6(
    null
  );
  const containerRef = useRef3(null);
  const [containerWidth, setContainerWidth] = useState6(0);
  const [dragDelta, setDragDelta] = useState6(
    null
  );
  const [resizePreview, setResizePreview] = useState6(null);
  const [resizing, setResizing] = useState6(null);
  const resizePreviewRef = useRef3({ leftDeltaDays: 0, rightDeltaDays: 0 });
  const lastClampedDeltaRef = useRef3(null);
  useEffect4(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) setContainerWidth(entry.contentRect.width);
    });
    ro.observe(el);
    setContainerWidth(el.getBoundingClientRect().width);
    return () => ro.disconnect();
  }, []);
  const openTask = () => setIsTaskOpen(true);
  const closeTask = () => {
    setIsTaskOpen(false);
    setSelectedEvent(null);
  };
  const openCreateTask = () => {
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
  const weekTitle = useMemo4(() => {
    const endDate = startDate.add(6, "days");
    return `${startDate.format("MMM D")} - ${endDate.format("MMM D, YYYY")}`;
  }, [startDate]);
  const weekDaysWithDates = useMemo4(
    () => Array.from({ length: 7 }).map((_, index) => {
      const date = startDate.clone().add(index, "days");
      return { dayIndex: index, date: date.format("YYYY-MM-DD") };
    }),
    [startDate]
  );
  const handlePreviousWeek = useCallback5(() => {
    setStartDate(startDate.subtract(1, "week"));
  }, [startDate, setStartDate]);
  const handleNextWeek = useCallback5(() => {
    setStartDate(startDate.add(1, "week"));
  }, [startDate, setStartDate]);
  const handleToday = useCallback5(() => {
    setStartDate(dayjs11());
  }, [setStartDate]);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );
  const handleDragMove = useCallback5(
    (event) => {
      const id = String(event.active.id);
      const ev = scheduledEvents.find((e) => e.id === id);
      if (!ev || containerWidth <= 0) {
        setDragDelta({ id, x: event.delta.x });
        lastClampedDeltaRef.current = { id, x: event.delta.x };
        return;
      }
      const placement = getEventPlacement(ev, startDate, containerWidth);
      if (!placement) {
        setDragDelta({ id, x: event.delta.x });
        lastClampedDeltaRef.current = { id, x: event.delta.x };
        return;
      }
      const minDeltaX = -placement.leftPx;
      const maxDeltaX = containerWidth - (placement.leftPx + placement.widthPx);
      const clampedX = Math.max(minDeltaX, Math.min(maxDeltaX, event.delta.x));
      setDragDelta({ id, x: clampedX });
      lastClampedDeltaRef.current = { id, x: clampedX };
    },
    [scheduledEvents, startDate, containerWidth]
  );
  const handleDragEnd = useCallback5(
    (event) => {
      var _a2;
      const { active, delta } = event;
      const effectiveDeltaX = ((_a2 = lastClampedDeltaRef.current) == null ? void 0 : _a2.id) === active.id ? lastClampedDeltaRef.current.x : delta.x;
      setDragDelta(null);
      lastClampedDeltaRef.current = null;
      const ev = scheduledEvents.find((e) => e.id === active.id);
      if (!ev || !containerRef.current) return;
      const columnWidth = containerWidth / 7;
      if (columnWidth <= 0) return;
      const placement = getEventPlacement(ev, startDate, containerWidth);
      if (!placement) return;
      const durationDays = placement.durationDays;
      const finalLeftPx = placement.leftPx + effectiveDeltaX;
      const finalRightPx = placement.leftPx + placement.widthPx + effectiveDeltaX;
      let newWeekStart = startDate;
      let tentativeStartOffset;
      if (finalLeftPx <= 0) {
        handlePreviousWeek();
        newWeekStart = startDate.subtract(1, "week");
        tentativeStartOffset = Math.round(
          (finalLeftPx + containerWidth) / columnWidth
        );
        tentativeStartOffset = Math.max(
          0,
          Math.min(7 - durationDays, tentativeStartOffset)
        );
      } else if (finalRightPx >= containerWidth) {
        handleNextWeek();
        newWeekStart = startDate.add(1, "week");
        tentativeStartOffset = Math.round(
          (finalLeftPx - containerWidth) / columnWidth
        );
        tentativeStartOffset = Math.max(
          0,
          Math.min(7 - durationDays, tentativeStartOffset)
        );
      } else {
        const dayDelta = pixelDeltaToDayDelta(effectiveDeltaX, columnWidth);
        tentativeStartOffset = placement.startOffsetDays + dayDelta;
        tentativeStartOffset = Math.max(
          0,
          Math.min(7 - durationDays, tentativeStartOffset)
        );
      }
      const newStart = newWeekStart.clone().add(tentativeStartOffset, "days");
      const newEnd = newStart.clone().add(durationDays - 1, "days");
      const oldStart = dayjs11(ev.start);
      const oldEnd = dayjs11(ev.end);
      if (oldStart.isSame(newStart, "day") && oldEnd.isSame(newEnd, "day"))
        return;
      const updatedEvent = __spreadProps(__spreadValues({}, ev), {
        start: newStart,
        end: newEnd
      });
      const prevScheduled = [...scheduledEvents];
      const prevUnscheduled = [...unscheduledEvents];
      setScheduledEvents(
        (prev) => prev.map((e) => e.id === ev.id ? updatedEvent : e)
      );
      setUnscheduledEvents((prev) => prev.filter((e) => e.id !== ev.id));
      if (onEventMove) {
        (async () => {
          try {
            await onEventMove({
              id: ev.id,
              start: newStart,
              end: newEnd,
              oldStart,
              oldEnd,
              view: "week"
            });
          } catch (e) {
            setScheduledEvents(prevScheduled);
            setUnscheduledEvents(prevUnscheduled);
          }
        })();
      }
    },
    [
      scheduledEvents,
      unscheduledEvents,
      containerWidth,
      startDate,
      setScheduledEvents,
      setUnscheduledEvents,
      onEventMove,
      handlePreviousWeek,
      handleNextWeek
    ]
  );
  const onResizeStart = useCallback5(
    (eventId, handle, startX) => {
      if (readOnly) return;
      const evt = scheduledEvents.find((e) => e.id === eventId);
      if (!evt) return;
      const placement = getEventPlacement(evt, startDate, containerWidth);
      if (!placement) return;
      setResizing({
        eventId,
        handle,
        startX,
        startOffsetDays: placement.startOffsetDays,
        durationDays: placement.durationDays,
        columnWidth: placement.columnWidth
      });
      setResizePreview({
        eventId,
        leftDeltaDays: 0,
        rightDeltaDays: 0
      });
    },
    [readOnly, scheduledEvents, startDate, containerWidth]
  );
  useEffect4(() => {
    if (!resizing) return;
    const {
      eventId,
      handle,
      startX,
      startOffsetDays,
      durationDays,
      columnWidth
    } = resizing;
    const onMove = (e) => {
      const deltaX = e.clientX - startX;
      const dayDelta = pixelDeltaToDayDelta(deltaX, columnWidth);
      if (handle === "left") {
        const leftDeltaDays = Math.max(
          -startOffsetDays,
          Math.min(dayDelta, durationDays - 1)
        );
        resizePreviewRef.current = { leftDeltaDays, rightDeltaDays: 0 };
        setResizePreview({
          eventId,
          leftDeltaDays,
          rightDeltaDays: 0
        });
      } else {
        const rightDeltaDays = Math.max(
          1 - durationDays,
          Math.min(dayDelta, 7 - (startOffsetDays + durationDays))
        );
        resizePreviewRef.current = { leftDeltaDays: 0, rightDeltaDays };
        setResizePreview({
          eventId,
          leftDeltaDays: 0,
          rightDeltaDays
        });
      }
    };
    const onUp = () => {
      const current = resizePreviewRef.current;
      setResizing(null);
      setResizePreview(null);
      const evt = scheduledEvents.find((e) => e.id === eventId);
      if (!evt) return;
      const newStartOffsetDays = startOffsetDays + current.leftDeltaDays;
      const newDurationDays = handle === "left" ? durationDays - current.leftDeltaDays : durationDays + current.rightDeltaDays;
      if (newDurationDays < 1) return;
      const newStart = startDate.clone().add(newStartOffsetDays, "days");
      const newEnd = newStart.clone().add(newDurationDays - 1, "days");
      const oldStart = dayjs11(evt.start);
      const oldEnd = dayjs11(evt.end);
      const updatedEvent = __spreadProps(__spreadValues({}, evt), {
        start: newStart,
        end: newEnd
      });
      const prevScheduled = [...scheduledEvents];
      setScheduledEvents(
        (prev) => prev.map((e) => e.id === eventId ? updatedEvent : e)
      );
      if (onEventResize) {
        (async () => {
          try {
            await onEventResize({
              id: eventId,
              start: newStart,
              end: newEnd,
              oldStart,
              oldEnd,
              view: "week"
            });
          } catch (e) {
            setScheduledEvents(prevScheduled);
          }
        })();
      }
    };
    window.addEventListener("pointermove", onMove, { capture: true });
    window.addEventListener("pointerup", onUp, { capture: true });
    return () => {
      window.removeEventListener("pointermove", onMove, { capture: true });
      window.removeEventListener("pointerup", onUp, { capture: true });
    };
  }, [resizing, scheduledEvents, startDate, setScheduledEvents, onEventResize]);
  const handleUnassignedEventDrop = useCallback5(
    (event, dayIndex) => {
      const oldStart = dayjs11(event.start);
      const oldEnd = dayjs11(event.end);
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
              view: "week"
            });
          } catch (e) {
            setScheduledEvents(prevScheduled);
            setUnscheduledEvents(prevUnscheduled);
          }
        })();
      }
    },
    [
      startDate,
      scheduledEvents,
      unscheduledEvents,
      setScheduledEvents,
      setUnscheduledEvents,
      onEventMove
    ]
  );
  const handleCreateSubmit = useCreateEventSubmit(
    scheduledEvents,
    setScheduledEvents,
    onEventCreate,
    closeCreateTask,
    unscheduledEvents,
    setUnscheduledEvents
  );
  const gridStyle = useMemo4(
    () => ({
      display: "grid",
      gridTemplateColumns: "repeat(7, 1fr)",
      width: "100%"
    }),
    []
  );
  const eventsWithPlacementAndRow = useMemo4(() => {
    const withPlacement = scheduledEvents.map((event) => ({
      event,
      placement: getEventPlacement(
        event,
        startDate,
        containerWidth,
        (resizePreview == null ? void 0 : resizePreview.eventId) === event.id ? {
          leftDeltaDays: resizePreview.leftDeltaDays,
          rightDeltaDays: resizePreview.rightDeltaDays
        } : void 0
      )
    })).filter(
      (w) => w.placement != null
    );
    const { rowIndices, numRows } = getOverlapRowAssignments(
      withPlacement.map((w) => ({
        startOffsetDays: w.placement.startOffsetDays,
        durationDays: w.placement.durationDays
      }))
    );
    return { items: withPlacement, rowIndices, numRows };
  }, [scheduledEvents, startDate, containerWidth, resizePreview]);
  const eventsOverlayStyle = useMemo4(
    () => ({
      position: "relative",
      height: Math.max(
        ROW_HEIGHT2,
        eventsWithPlacementAndRow.numRows * ROW_HEIGHT2
      ),
      width: "100%"
    }),
    [eventsWithPlacementAndRow.numRows]
  );
  return /* @__PURE__ */ jsxs7("div", { "data-slot": "week-view", className, style, children: [
    /* @__PURE__ */ jsxs7("div", { "data-slot": "week-view-nav", children: [
      /* @__PURE__ */ jsx13(
        Button,
        {
          type: "button",
          onClick: handlePreviousWeek,
          "aria-label": "Previous week",
          children: previousWeekButtonContent
        }
      ),
      /* @__PURE__ */ jsx13(Title, { level: 4, children: weekTitle }),
      /* @__PURE__ */ jsx13(
        Button,
        {
          type: "button",
          onClick: handleToday,
          "data-slot": "today-button",
          className: todayButtonClassName,
          style: todayButtonStyle,
          "aria-label": typeof todayButtonContent === "string" ? todayButtonContent : "Today",
          children: todayButtonContent
        }
      ),
      /* @__PURE__ */ jsx13(Button, { type: "button", onClick: handleNextWeek, "aria-label": "Next week", children: nextWeekButtonContent })
    ] }),
    /* @__PURE__ */ jsxs7("div", { "data-slot": "week-view-grid", ref: containerRef, style: gridStyle, children: [
      weekDaysWithDates.map(({ dayIndex, date }) => /* @__PURE__ */ jsxs7(
        "div",
        {
          "data-slot": "week-day-cell",
          "data-day-index": dayIndex,
          "data-date": date,
          style: { padding: "4px", borderRight: "1px solid #e5e7eb" },
          children: [
            /* @__PURE__ */ jsx13("span", { children: dayjs11(date).format("ddd") }),
            /* @__PURE__ */ jsx13("span", { children: dayjs11(date).format("D") })
          ]
        },
        `day-${dayIndex}`
      )),
      /* @__PURE__ */ jsx13("div", { style: __spreadValues({ gridColumn: "1 / -1" }, eventsOverlayStyle), children: /* @__PURE__ */ jsx13(
        DndContext,
        {
          sensors,
          onDragMove: handleDragMove,
          onDragEnd: handleDragEnd,
          children: eventsWithPlacementAndRow.items.map(({ event }, i) => /* @__PURE__ */ jsx13(
            WeekEventCard,
            {
              event,
              placement: eventsWithPlacementAndRow.items[i].placement,
              rowIndex: eventsWithPlacementAndRow.rowIndices[i],
              readOnly,
              onOpen: () => handleOpenEvent(event),
              dragDeltaX: (dragDelta == null ? void 0 : dragDelta.id) === event.id ? dragDelta.x : null,
              onResizeStart,
              EventActionButton
            },
            event.id
          ))
        }
      ) })
    ] }),
    /* @__PURE__ */ jsxs7("div", { "data-slot": "unscheduled-list", children: [
      /* @__PURE__ */ jsx13("h3", { "data-slot": "unscheduled-title", children: (_a = labels == null ? void 0 : labels.unscheduledTitle) != null ? _a : "Unscheduled events" }),
      !readOnly && (AddEventButton ? /* @__PURE__ */ jsx13(AddEventButton, { onClick: openCreateTask }) : /* @__PURE__ */ jsx13(Tooltip, { title: "Add new event", children: /* @__PURE__ */ jsx13(
        Button,
        {
          type: "button",
          onClick: openCreateTask,
          "aria-label": "Add event",
          children: "+"
        }
      ) })),
      CreateEventModal ? /* @__PURE__ */ jsx13(
        CreateEventModal,
        {
          isOpen: isCreateTaskOpen,
          onClose: closeCreateTask,
          onSubmit: handleCreateSubmit,
          initialStartDate: null,
          initialEndDate: null
        }
      ) : /* @__PURE__ */ jsx13(
        CreateTaskModal,
        {
          isOpen: isCreateTaskOpen,
          onClose: closeCreateTask,
          onSubmit: handleCreateSubmit,
          initialStartDate: null,
          initialEndDate: null
        }
      ),
      /* @__PURE__ */ jsx13("div", { "data-slot": "unscheduled-items", children: unscheduledEvents.map((event) => {
        var _a2;
        return /* @__PURE__ */ jsx13(
          "div",
          {
            "data-slot": "unscheduled-event",
            "data-event-id": event.id,
            "data-color": (_a2 = event.color) != null ? _a2 : void 0,
            style: getEventChipStyle(event),
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
      }) }),
      unscheduledEvents.length > 0 && !readOnly && /* @__PURE__ */ jsx13("p", { "data-slot": "unscheduled-hint", children: (_b = labels == null ? void 0 : labels.unscheduledHint) != null ? _b : "Drag an event onto a day above to schedule it, or double-click to view." })
    ] }),
    selectedEvent && (EventDetailModal ? /* @__PURE__ */ jsx13(
      EventDetailModal,
      {
        task: mapFromEvent ? mapFromEvent(selectedEvent) : {
          id: selectedEvent.id,
          name: selectedEvent.title,
          startDate: selectedEvent.start,
          endDate: selectedEvent.end,
          employees: []
        },
        isOpen: isTaskOpen,
        onClose: closeTask,
        updateTask
      }
    ) : mapFromEvent ? /* @__PURE__ */ jsx13(
      TaskModal,
      {
        task: mapFromEvent(selectedEvent),
        isOpen: isTaskOpen,
        onClose: closeTask,
        updateTask
      }
    ) : null)
  ] });
}

// src/components/YearView.tsx
import dayjs12 from "dayjs";
import { useMemo as useMemo5, useState as useState7 } from "react";
import { jsx as jsx14, jsxs as jsxs8 } from "react/jsx-runtime";
function YearView({
  events,
  setEvents,
  setStartDate,
  setZoomLevel,
  onEventClick,
  onDateClick,
  onEventCreate,
  readOnly = false,
  updateTask = async () => {
  },
  mapFromEvent,
  AddEventButton,
  CreateEventModal,
  EventDetailModal,
  previousYearButtonContent = "\u2190",
  nextYearButtonContent = "\u2192",
  weekStartsOn = 0,
  maxEventsPerDay = 3,
  className,
  style
}) {
  var _a;
  const [selectedDate, setSelectedDate] = useState7(null);
  const [isModalOpen, setIsModalOpen] = useState7(false);
  const [currentYear, setCurrentYear] = useState7(dayjs12().year());
  const openModalWithDate = (date) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDate(null);
  };
  const handleCreateSubmit = useCreateEventSubmit(
    events,
    setEvents,
    onEventCreate,
    closeModal
  );
  const calendarData = useMemo5(
    () => generateCalendarWeeks(currentYear, weekStartsOn),
    [currentYear, weekStartsOn]
  );
  const weekdayLabels = useMemo5(
    () => getWeekdayLabels(weekStartsOn),
    [weekStartsOn]
  );
  const getEventsForWeekInYear = (week) => getEventsForYear(week, events, currentYear);
  const handlePreviousYear = () => {
    setCurrentYear((prev) => prev - 1);
  };
  const handleNextYear = () => {
    setCurrentYear((prev) => prev + 1);
  };
  const createInitialStart = (_a = selectedDate == null ? void 0 : selectedDate.startOf("day")) != null ? _a : dayjs12().startOf("day");
  const createInitialEnd = createInitialStart.add(1, "day");
  return /* @__PURE__ */ jsxs8("div", { "data-slot": "year-view", className, style, children: [
    /* @__PURE__ */ jsxs8("div", { "data-slot": "year-view-nav", children: [
      /* @__PURE__ */ jsx14(
        Button,
        {
          type: "button",
          onClick: handlePreviousYear,
          "aria-label": "Previous year",
          children: previousYearButtonContent
        }
      ),
      /* @__PURE__ */ jsx14(Title, { level: 4, children: currentYear }),
      /* @__PURE__ */ jsx14(Button, { type: "button", onClick: handleNextYear, "aria-label": "Next year", children: nextYearButtonContent }),
      !readOnly && (AddEventButton ? /* @__PURE__ */ jsx14(AddEventButton, { onClick: () => openModalWithDate(dayjs12()) }) : /* @__PURE__ */ jsx14(Tooltip, { title: "Add new event", children: /* @__PURE__ */ jsx14(
        Button,
        {
          type: "button",
          onClick: () => openModalWithDate(dayjs12()),
          "aria-label": "Add event",
          children: "+"
        }
      ) }))
    ] }),
    /* @__PURE__ */ jsx14("div", { "data-slot": "year-view-months", children: [...Array(12)].map((_, monthIndex) => /* @__PURE__ */ jsxs8("div", { "data-slot": "year-month", children: [
      /* @__PURE__ */ jsx14(Title, { level: 4, children: dayjs12(`${currentYear}-${monthIndex + 1}-01`).format("MMMM") }),
      /* @__PURE__ */ jsx14("div", { "data-slot": "year-month-weekdays", children: weekdayLabels.map((day) => /* @__PURE__ */ jsx14("div", { "data-slot": "year-weekday", children: day }, day)) }),
      /* @__PURE__ */ jsx14("div", { "data-slot": "year-month-weeks", children: calendarData.filter(
        (week) => week.some((day) => day.month() === monthIndex)
      ).map((week, weekIndex) => /* @__PURE__ */ jsxs8("div", { "data-slot": "year-week", children: [
        /* @__PURE__ */ jsx14(
          "button",
          {
            type: "button",
            "data-slot": "year-week-go",
            onClick: () => {
              setStartDate(week[0]);
              setZoomLevel("week");
            },
            "aria-label": "Go to week",
            children: "\u2192"
          }
        ),
        /* @__PURE__ */ jsx14(
          Week,
          {
            days: week,
            events: getEventsForWeekInYear(week),
            onSelectDate: openModalWithDate,
            currentMonth: monthIndex,
            view: "year",
            readOnly,
            onEventClick,
            onDateClick,
            updateTask,
            mapFromEvent,
            EventDetailModal,
            weekStartsOn,
            maxEventsPerDay
          }
        )
      ] }, weekIndex)) })
    ] }, monthIndex)) }),
    CreateEventModal ? /* @__PURE__ */ jsx14(
      CreateEventModal,
      {
        isOpen: isModalOpen,
        onClose: closeModal,
        onSubmit: handleCreateSubmit,
        initialStartDate: createInitialStart,
        initialEndDate: createInitialEnd
      }
    ) : /* @__PURE__ */ jsx14(
      CreateTaskModal,
      {
        isOpen: isModalOpen,
        onClose: closeModal,
        onSubmit: handleCreateSubmit,
        initialStartDate: createInitialStart,
        initialEndDate: createInitialEnd
      }
    )
  ] });
}

// src/components/Calendar.tsx
import { jsx as jsx15, jsxs as jsxs9 } from "react/jsx-runtime";
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
  defaultScheduledEvents,
  defaultUnscheduledEvents,
  defaultDate,
  defaultView,
  showSwitcher = true,
  views = ALL_VIEWS,
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
  todayButtonContent,
  todayButtonClassName,
  todayButtonStyle,
  labels,
  weekStartsOn = 0,
  maxEventsPerDay = 3,
  defaultDurationMinutes = 60,
  workdayStart = "09:00",
  workdayEnd = "17:00",
  showFullDay = false,
  className,
  style,
  viewSwitcherClassName,
  viewSwitcherButtonClassName
}) {
  const { orderedViews, setZoomLevel, effectiveZoom } = useCalendarViews(
    views,
    { view, defaultView, onViewChange }
  );
  useEffect5(() => {
    applyWeekStartsOn(weekStartsOn);
  }, [weekStartsOn]);
  const isEventsControlled = events !== void 0;
  const [internalScheduledEvents, setInternalScheduledEvents] = useState8(() => {
    var _a;
    return (_a = defaultScheduledEvents != null ? defaultScheduledEvents : defaultEvents) != null ? _a : [];
  });
  const scheduledEvents = isEventsControlled ? events : internalScheduledEvents;
  const [unscheduledEvents, setUnscheduledEvents] = useState8(
    () => defaultUnscheduledEvents != null ? defaultUnscheduledEvents : []
  );
  const isDateControlled = date !== void 0;
  const [internalStartDate, setInternalStartDate] = useState8(
    () => defaultDate != null ? defaultDate : dayjs13()
  );
  const startDate = isDateControlled ? date : internalStartDate;
  const setStartDate = useCallback6(
    (next) => {
      if (!isDateControlled) {
        setInternalStartDate(next);
      }
      onDateChange == null ? void 0 : onDateChange(next);
    },
    [isDateControlled, onDateChange]
  );
  const handleScheduledEventsChange = useCallback6(
    (updater) => {
      const prev = isEventsControlled ? events : internalScheduledEvents;
      const next = typeof updater === "function" ? updater(prev) : updater;
      if (!isEventsControlled) {
        setInternalScheduledEvents(next);
      }
      onEventsChange == null ? void 0 : onEventsChange(next);
      if (onEventChange && next.length === prev.length) {
        for (let i = 0; i < next.length; i++) {
          const before = prev.find((e) => e.id === next[i].id);
          const after = next[i];
          if (!before) continue;
          if (before.start !== after.start || before.end !== after.end || before.title !== after.title || before.color !== after.color || before.resourceId !== after.resourceId) {
            const patch = {};
            if (before.start !== after.start) patch.start = after.start;
            if (before.end !== after.end) patch.end = after.end;
            if (before.title !== after.title) patch.title = after.title;
            if (before.color !== after.color) patch.color = after.color;
            if (before.resourceId !== after.resourceId)
              patch.resourceId = after.resourceId;
            if (Object.keys(patch).length > 0) {
              onEventChange(after, patch);
            }
          }
        }
      }
    },
    [
      isEventsControlled,
      events,
      internalScheduledEvents,
      onEventsChange,
      onEventChange
    ]
  );
  const handleDragEnd = useCalendarDragEnd(
    startDate,
    scheduledEvents,
    unscheduledEvents,
    handleScheduledEventsChange,
    setUnscheduledEvents,
    onEventMove,
    effectiveZoom
  );
  const zoomLevelView = {
    day: /* @__PURE__ */ jsx15(
      DayView,
      {
        startDate: startDate.startOf("day"),
        setStartDate,
        scheduledEvents,
        unscheduledEvents,
        setScheduledEvents: handleScheduledEventsChange,
        setUnscheduledEvents,
        onEventMove,
        onEventResize,
        onEventCreate,
        onEventClick,
        onDateClick,
        readOnly,
        mapFromEvent,
        AddEventButton,
        CreateEventModal,
        EventActionButton,
        EventDetailModal,
        previousDayButtonContent,
        nextDayButtonContent,
        todayButtonContent,
        todayButtonClassName,
        todayButtonStyle,
        labels,
        defaultDurationMinutes,
        workdayStart,
        workdayEnd,
        showFullDay
      }
    ),
    week: /* @__PURE__ */ jsx15(
      WeekView,
      {
        startDate: startDate.startOf("week"),
        setStartDate,
        scheduledEvents,
        unscheduledEvents,
        setScheduledEvents: handleScheduledEventsChange,
        setUnscheduledEvents,
        onEventMove,
        onEventResize,
        onEventCreate,
        onEventClick,
        onDateClick,
        readOnly,
        mapFromEvent,
        AddEventButton,
        CreateEventModal,
        EventActionButton,
        EventDetailModal,
        previousWeekButtonContent,
        nextWeekButtonContent,
        todayButtonContent,
        todayButtonClassName,
        todayButtonStyle,
        labels
      }
    ),
    month: /* @__PURE__ */ jsx15(
      MonthView,
      {
        setStartDate,
        events: scheduledEvents,
        setEvents: handleScheduledEventsChange,
        setZoomLevel,
        onEventClick,
        onDateClick,
        onEventCreate,
        readOnly,
        mapFromEvent,
        AddEventButton,
        CreateEventModal,
        EventDetailModal,
        previousMonthButtonContent,
        nextMonthButtonContent,
        weekStartsOn,
        maxEventsPerDay
      }
    ),
    year: /* @__PURE__ */ jsx15(
      YearView,
      {
        setStartDate,
        events: scheduledEvents,
        setEvents: handleScheduledEventsChange,
        setZoomLevel,
        onEventClick,
        onDateClick,
        onEventCreate,
        readOnly,
        mapFromEvent,
        AddEventButton,
        CreateEventModal,
        EventDetailModal,
        previousYearButtonContent,
        nextYearButtonContent,
        weekStartsOn,
        maxEventsPerDay
      }
    )
  };
  return /* @__PURE__ */ jsx15(DndContext2, { onDragEnd: handleDragEnd, children: /* @__PURE__ */ jsxs9("div", { "data-slot": "calendar-root", className, style, children: [
    showSwitcher && orderedViews.length > 0 && /* @__PURE__ */ jsx15("div", { "data-slot": "calendar-view-switcher", children: /* @__PURE__ */ jsx15(
      SegmentedControl,
      {
        value: effectiveZoom,
        options: orderedViews.map((v) => ({
          label: VIEW_LABELS[v],
          value: v
        })),
        onChange: (value) => setZoomLevel(value),
        className: viewSwitcherClassName,
        buttonClassName: viewSwitcherButtonClassName
      }
    ) }),
    /* @__PURE__ */ jsx15("div", { "data-slot": "calendar-content", "data-view": effectiveZoom, children: zoomLevelView[effectiveZoom] })
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
import { jsx as jsx16 } from "react/jsx-runtime";
var Card = ({ children, className }) => {
  return /* @__PURE__ */ jsx16("div", { "data-slot": "card", className, children });
};

// src/components/ui/Tabs.tsx
import { jsx as jsx17, jsxs as jsxs10 } from "react/jsx-runtime";
var Tabs = ({
  activeKey,
  onChange,
  className,
  items
}) => {
  var _a;
  return /* @__PURE__ */ jsxs10("div", { "data-slot": "tabs", className, children: [
    /* @__PURE__ */ jsx17("div", { "data-slot": "tabs-list", children: items.map((item) => /* @__PURE__ */ jsx17(
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
    /* @__PURE__ */ jsx17("div", { "data-slot": "tabs-content", children: (_a = items.find((item) => item.key === activeKey)) == null ? void 0 : _a.children })
  ] });
};

// src/demo/CalendarContainer.tsx
import { useState as useState9 } from "react";
import { jsx as jsx18 } from "react/jsx-runtime";
var ALL_VIEWS2 = ["day", "week", "month", "year"];
function CalendarContainer({
  showSwitcher,
  showTabs = true,
  views = ALL_VIEWS2,
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
  todayButtonContent,
  todayButtonClassName,
  todayButtonStyle,
  viewSwitcherClassName,
  viewSwitcherButtonClassName
}) {
  const effectiveAreas = areas.length > 0 ? areas : [{ id: "", name: "Calendar" }];
  const [activeTab, setActiveTab] = useState9(
    () => {
      var _a, _b;
      return (_b = (_a = effectiveAreas[0]) == null ? void 0 : _a.id) != null ? _b : "";
    }
  );
  if (!showTabs || effectiveAreas.length <= 1) {
    return /* @__PURE__ */ jsx18("div", { "data-slot": "calendar-container", children: /* @__PURE__ */ jsx18(Card, { children: /* @__PURE__ */ jsx18(
      Calendar,
      {
        showSwitcher,
        views,
        defaultScheduledEvents,
        defaultUnscheduledEvents,
        onEventMove,
        onEventResize,
        onEventCreate,
        onEventClick,
        onDateClick,
        readOnly,
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
        todayButtonContent,
        todayButtonClassName,
        todayButtonStyle,
        viewSwitcherClassName,
        viewSwitcherButtonClassName
      }
    ) }) });
  }
  return /* @__PURE__ */ jsx18("div", { "data-slot": "calendar-container", "data-tabs": true, children: /* @__PURE__ */ jsx18(
    Tabs,
    {
      activeKey: activeTab,
      onChange: setActiveTab,
      items: effectiveAreas.map((area) => ({
        key: area.id,
        label: /* @__PURE__ */ jsx18("span", { "data-slot": "tab-label", "data-area-id": area.id, children: area.name }),
        children: /* @__PURE__ */ jsx18(Card, { children: /* @__PURE__ */ jsx18(
          Calendar,
          {
            showSwitcher,
            views,
            defaultScheduledEvents,
            defaultUnscheduledEvents,
            onEventMove,
            onEventResize,
            onEventCreate,
            onEventClick,
            onDateClick,
            readOnly,
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
            todayButtonContent,
            todayButtonClassName,
            todayButtonStyle,
            viewSwitcherClassName,
            viewSwitcherButtonClassName
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
  applyWeekStartsOn,
  formatHourLabel,
  generateCalendarWeeks,
  getEventsForDay,
  getEventsForWeek,
  getEventsForYear,
  getLeadingEmptyCount,
  getTaskColorHex,
  getTasksForWeek,
  getTasksForYear,
  getVisibleHourRange,
  getWeekdayLabels,
  hhmmToMinutes,
  mapEventToTask,
  mapTaskToEvent,
  parseHHMM,
  snapMinutes
};
