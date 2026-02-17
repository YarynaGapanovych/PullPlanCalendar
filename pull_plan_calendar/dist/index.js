"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
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
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  Calendar: () => Calendar,
  CalendarContainer: () => CalendarContainer,
  CreateTaskModal: () => CreateTaskModal,
  DEFAULT_TASK_COLOR: () => DEFAULT_TASK_COLOR,
  DayView: () => DayView,
  MonthView: () => MonthView,
  ProgressStatus: () => ProgressStatus,
  TaskModal: () => TaskModal,
  UserRole: () => UserRole,
  Week: () => Week,
  WeekView: () => WeekView,
  YearView: () => YearView,
  generateCalendarWeeks: () => generateCalendarWeeks,
  getEventsForWeek: () => getEventsForWeek,
  getEventsForYear: () => getEventsForYear,
  getTaskColorHex: () => getTaskColorHex,
  getTasksForWeek: () => getTasksForWeek,
  getTasksForYear: () => getTasksForYear,
  mapEventToTask: () => mapEventToTask,
  mapTaskToEvent: () => mapTaskToEvent
});
module.exports = __toCommonJS(index_exports);

// src/components/ui/SegmentedControl.tsx
var import_jsx_runtime = require("react/jsx-runtime");
var SegmentedControl = ({
  value,
  onChange,
  options,
  className
}) => {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { "data-slot": "segmented-control", role: "tablist", className, children: options.map((option) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
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
var import_core = require("@dnd-kit/core");
var import_dayjs9 = __toESM(require("dayjs"));
var import_react7 = require("react");

// src/components/ui/Button.tsx
var import_jsx_runtime2 = require("react/jsx-runtime");
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
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
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
var import_jsx_runtime3 = require("react/jsx-runtime");
var TAG = { 1: "h1", 2: "h2", 3: "h3", 4: "h4", 5: "h5" };
var Title = ({ level = 4, children, className }) => {
  const Comp = TAG[level];
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Comp, { "data-slot": "title", "data-level": level, className, children });
};

// src/components/ui/Tooltip.tsx
var import_jsx_runtime4 = require("react/jsx-runtime");
var Tooltip = ({ title, children, className }) => {
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { "data-slot": "tooltip", className, title, children });
};

// src/components/DayView.tsx
var import_dayjs3 = __toESM(require("dayjs"));
var import_react2 = require("react");

// src/components/tasks/CreateTaskModal.tsx
var import_dayjs = __toESM(require("dayjs"));
var import_react = require("react");
var import_jsx_runtime5 = require("react/jsx-runtime");
function CreateTaskModal({
  isOpen,
  onClose,
  areaId,
  onSubmit,
  className
}) {
  const [taskName, setTaskName] = (0, import_react.useState)("");
  const [startDate, setStartDate] = (0, import_react.useState)((0, import_dayjs.default)());
  const [endDate, setEndDate] = (0, import_react.useState)((0, import_dayjs.default)().add(1, "day"));
  const [isSubmitting, setIsSubmitting] = (0, import_react.useState)(false);
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
      setStartDate((0, import_dayjs.default)());
      setEndDate((0, import_dayjs.default)().add(1, "day"));
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleCancel = () => {
    setTaskName("");
    setStartDate((0, import_dayjs.default)());
    setEndDate((0, import_dayjs.default)().add(1, "day"));
    onClose();
  };
  if (!isOpen) return null;
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { "data-slot": "create-task-modal", role: "dialog", "aria-modal": "true", "aria-labelledby": "create-task-title", className, children: [
    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { "data-slot": "create-task-modal-backdrop", onClick: handleCancel, "aria-hidden": true }),
    /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { "data-slot": "create-task-modal-content", children: [
      /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { "data-slot": "create-task-modal-header", children: [
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("h2", { id: "create-task-title", "data-slot": "create-task-modal-title", children: "Create New Task" }),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("button", { type: "button", onClick: handleCancel, "aria-label": "Close", children: "\xD7" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("form", { onSubmit: handleSubmit, "data-slot": "create-task-form", children: [
        /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { "data-slot": "create-task-fields", children: [
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("label", { htmlFor: "taskName", children: "Task Name" }),
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
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
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("label", { htmlFor: "startDate", children: "Start Date" }),
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
            "input",
            {
              id: "startDate",
              type: "date",
              value: startDate.format("YYYY-MM-DD"),
              onChange: (e) => setStartDate((0, import_dayjs.default)(e.target.value)),
              required: true,
              "data-slot": "create-task-start"
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("label", { htmlFor: "endDate", children: "End Date" }),
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
            "input",
            {
              id: "endDate",
              type: "date",
              value: endDate.format("YYYY-MM-DD"),
              onChange: (e) => setEndDate((0, import_dayjs.default)(e.target.value)),
              required: true,
              min: startDate.format("YYYY-MM-DD"),
              "data-slot": "create-task-end"
            }
          ),
          areaId && /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { "data-slot": "create-task-area", children: [
            "Area ID: ",
            areaId
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { "data-slot": "create-task-actions", children: [
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("button", { type: "button", onClick: handleCancel, children: "Cancel" }),
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("button", { type: "submit", disabled: isSubmitting || !taskName, children: isSubmitting ? "Creating..." : "Create Task" })
        ] })
      ] })
    ] })
  ] });
}

// src/components/tasks/TaskModal.tsx
var import_dayjs2 = __toESM(require("dayjs"));
var import_jsx_runtime6 = require("react/jsx-runtime");
function TaskModal({
  task,
  isOpen,
  onClose,
  className
}) {
  if (!isOpen) return null;
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { "data-slot": "task-modal", role: "dialog", "aria-modal": "true", "aria-labelledby": "task-modal-title", className, children: [
    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { "data-slot": "task-modal-backdrop", onClick: onClose, "aria-hidden": true }),
    /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { "data-slot": "task-modal-content", children: [
      /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { "data-slot": "task-modal-header", children: [
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("h2", { id: "task-modal-title", "data-slot": "task-modal-title", children: "Task Details" }),
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("button", { type: "button", onClick: onClose, "aria-label": "Close", children: "\xD7" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { "data-slot": "task-modal-body", children: [
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("p", { "data-slot": "task-name", children: task.name }),
        /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("p", { "data-slot": "task-start", children: [
          "Start: ",
          (0, import_dayjs2.default)(task.startDate).format("MMM D, YYYY")
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("p", { "data-slot": "task-end", children: [
          "End: ",
          (0, import_dayjs2.default)(task.endDate).format("MMM D, YYYY")
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { "data-slot": "task-modal-actions", children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("button", { type: "button", onClick: onClose, children: "Close" }) })
    ] })
  ] });
}

// src/components/DayView.tsx
var import_jsx_runtime7 = require("react/jsx-runtime");
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
  const [isTaskOpen, setIsTaskOpen] = (0, import_react2.useState)(false);
  const [isCreateTaskOpen, setIsCreateTaskOpen] = (0, import_react2.useState)(false);
  const [selectedEvent, setSelectedEvent] = (0, import_react2.useState)(null);
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
  const dayTitle = (0, import_react2.useMemo)(
    () => startDate.format("dddd, MMM D, YYYY"),
    [startDate]
  );
  const hours = (0, import_react2.useMemo)(() => Array.from({ length: 24 }, (_, i) => i), []);
  const HOUR_ROW_HEIGHT = 48;
  const eventsForDay = (0, import_react2.useMemo)(() => {
    const dayStart = startDate.startOf("day");
    const dayEnd = startDate.endOf("day");
    return scheduledEvents.filter((event) => {
      const eventStart = (0, import_dayjs3.default)(event.start).startOf("day");
      const eventEnd = (0, import_dayjs3.default)(event.end).endOf("day");
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
  const handleUnassignedEventDrop = (0, import_react2.useCallback)(
    (event) => {
      const oldStart = (0, import_dayjs3.default)(event.start);
      const oldEnd = (0, import_dayjs3.default)(event.end);
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
  const handleCreateSubmit = (0, import_react2.useCallback)(
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
            start: (0, import_dayjs3.default)(newEvent.start),
            end: (0, import_dayjs3.default)(newEvent.end)
          });
        } catch (e) {
          setScheduledEvents(prevScheduled);
        }
      }
    },
    [scheduledEvents, setScheduledEvents, onEventCreate]
  );
  return /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { "data-slot": "day-view", className, style, children: [
    /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { "data-slot": "day-view-nav", children: [
      /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(Button, { type: "button", onClick: handlePreviousDay, "aria-label": "Previous day", children: "\u2190" }),
      /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(Title, { level: 4, children: dayTitle }),
      /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(Button, { type: "button", onClick: handleNextDay, "aria-label": "Next day", children: "\u2192" })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(
      "div",
      {
        "data-slot": "day-view-grid",
        style: {
          display: "grid",
          gridTemplateColumns: "4rem 1fr",
          gridTemplateRows: `repeat(24, ${HOUR_ROW_HEIGHT}px)`
        },
        children: [
          hours.map((hour) => /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
            "div",
            {
              "data-slot": "day-hour",
              "data-hour": hour,
              style: { gridRow: hour + 1, minHeight: HOUR_ROW_HEIGHT },
              children: hour === 0 ? "12 AM" : hour < 12 ? `${hour} AM` : hour === 12 ? "12 PM" : `${hour - 12} PM`
            },
            hour
          )),
          /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
            "div",
            {
              "data-slot": "day-events",
              style: { gridColumn: 2, gridRow: "1 / -1", minHeight: 24 * HOUR_ROW_HEIGHT },
              children: eventsForDay.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("p", { "data-slot": "day-no-events", children: "No events scheduled" }) : eventsForDay.map((event) => {
                var _a;
                return /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(
                  "div",
                  {
                    "data-slot": "event",
                    "data-event-id": event.id,
                    "data-color": (_a = event.color) != null ? _a : void 0,
                    children: [
                      /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("span", { children: event.title }),
                      /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
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
    /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { "data-slot": "unscheduled-list", children: [
      /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("h3", { "data-slot": "unscheduled-title", children: "Unscheduled events" }),
      !readOnly && /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(Tooltip, { title: "Add new event", children: /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(Button, { type: "button", onClick: openCreateTask, "aria-label": "Add event", children: "+" }) }),
      /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
        CreateTaskModal,
        {
          isOpen: isCreateTaskOpen,
          onClose: closeCreateTask,
          onSubmit: handleCreateSubmit
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("div", { "data-slot": "unscheduled-items", children: unscheduledEvents.map((event) => {
        var _a;
        return /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
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
      unscheduledEvents.length > 0 && !readOnly && /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("p", { "data-slot": "unscheduled-hint", children: "Drag an event onto the day above to schedule it, or double-click to view." })
    ] }),
    selectedEvent && mapFromEvent && /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
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
var import_dayjs4 = __toESM(require("dayjs"));
var import_isBetween = __toESM(require("dayjs/plugin/isBetween"));
var import_minMax = __toESM(require("dayjs/plugin/minMax"));
import_dayjs4.default.extend(import_isBetween.default);
import_dayjs4.default.extend(import_minMax.default);
var generateCalendarWeeks = (year) => {
  const startDate = (0, import_dayjs4.default)(`${year}-01-01`);
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
    const start = (0, import_dayjs4.default)(event.start);
    const end = (0, import_dayjs4.default)(event.end);
    return week.some((day) => day.isBetween(start, end, void 0, "[]"));
  });
};
var getEventsForYear = (week, events, year) => {
  return events.filter((event) => {
    const start = (0, import_dayjs4.default)(event.start);
    const end = (0, import_dayjs4.default)(event.end);
    return week.some((day) => day.isBetween(start, end, void 0, "[]")) && (start.year() === year || end.year() === year);
  });
};
var getTasksForWeek = (week, tasks) => {
  return tasks.filter((task) => {
    const start = (0, import_dayjs4.default)(task.startDate);
    const end = (0, import_dayjs4.default)(task.endDate);
    return week.some((day) => day.isBetween(start, end, void 0, "[]"));
  });
};
var getTasksForYear = (week, tasks, year) => {
  return tasks.filter((task) => {
    const start = (0, import_dayjs4.default)(task.startDate);
    const end = (0, import_dayjs4.default)(task.endDate);
    return week.some((day) => day.isBetween(start, end, void 0, "[]")) && (start.year() === year || end.year() === year);
  });
};

// src/components/MonthView.tsx
var import_dayjs6 = __toESM(require("dayjs"));
var import_react4 = require("react");

// src/components/ui/Text.tsx
var import_jsx_runtime8 = require("react/jsx-runtime");
var Text = ({ children, className }) => {
  return /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("span", { "data-slot": "text", className, children });
};

// src/components/Week.tsx
var import_dayjs5 = __toESM(require("dayjs"));
var import_react3 = require("react");
var import_jsx_runtime9 = require("react/jsx-runtime");
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
  const [isTaskOpen, setIsTaskOpen] = (0, import_react3.useState)(false);
  const [selectedEvent, setSelectedEvent] = (0, import_react3.useState)(null);
  const openTask = () => setIsTaskOpen(true);
  const closeTask = () => {
    setIsTaskOpen(false);
    setSelectedEvent(null);
  };
  const eventsForWeek = events.filter(
    (event) => days.some(
      (day) => (0, import_dayjs5.default)(day).isBetween(
        (0, import_dayjs5.default)(event.start),
        (0, import_dayjs5.default)(event.end),
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
  return /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { "data-slot": "week", "data-month-view": isMonthView ? "true" : void 0, children: [
    /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { "data-slot": "week-days", style: { display: "grid", gridTemplateColumns: "repeat(7, 1fr)" }, children: [
      Array(days[0].day()).fill(null).map((_, index) => /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { "data-slot": "week-day-spacer" }, `empty-${index}`)),
      days.map((day, index) => {
        const isCurrentMonth = day.month() === currentMonth;
        if (isCurrentMonth) {
          return /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { "data-slot": "week-day", "data-date": day.format("YYYY-MM-DD"), children: [
            /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(Text, { children: day.format("D") }),
            !readOnly && /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(Tooltip, { title: "Add event", children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
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
        return /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { "data-slot": "week-day-spacer" }, `empty-${index}`);
      })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { "data-slot": "week-events", style: { display: "grid", gridTemplateColumns: "repeat(7, 1fr)" }, children: [
      eventsForWeek.slice(0, 3).map((event, eventIndex) => {
        var _a;
        const eventStart = (0, import_dayjs5.default)(event.start);
        const eventEnd = (0, import_dayjs5.default)(event.end);
        const weekStart = (0, import_dayjs5.default)(days[0]);
        const weekEnd = (0, import_dayjs5.default)(days[6]);
        const actualStart = import_dayjs5.default.max(eventStart, weekStart);
        const actualEnd = import_dayjs5.default.min(eventEnd, weekEnd);
        const startColumn = days.findIndex((d) => d.isSame(actualStart, "day"));
        const eventSpan = actualEnd.diff(actualStart, "days") + 1;
        const endColumn = startColumn + eventSpan - 1;
        return /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
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
      eventsForWeek.length > 3 && /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { "data-slot": "week-more", style: { gridColumn: isMonthView ? "7" : "6 / 8" }, children: [
        "+",
        eventsForWeek.length - 3,
        " events this week"
      ] })
    ] }),
    selectedEvent && mapFromEvent && /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
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
var import_jsx_runtime10 = require("react/jsx-runtime");
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
  const [currentMonth, setCurrentMonth] = (0, import_react4.useState)((0, import_dayjs6.default)().month());
  const [selectedDate, setSelectedDate] = (0, import_react4.useState)(null);
  const [isModalOpen, setIsModalOpen] = (0, import_react4.useState)(false);
  const openModalWithDate = (date) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  };
  const generateCalendarData = () => {
    const year = (0, import_dayjs6.default)().year();
    const startDate = (0, import_dayjs6.default)(`${year}-01-01`);
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
  const calendarData = (0, import_react4.useMemo)(() => generateCalendarData(), []);
  const getEventsForWeekInMonth = (week) => getEventsForWeek(week, events);
  const handlePreviousMonth = () => {
    setCurrentMonth((prev) => (prev - 1 + 12) % 12);
  };
  const handleNextMonth = () => {
    setCurrentMonth((prev) => (prev + 1) % 12);
  };
  return /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { "data-slot": "month-view", className, style, children: [
    /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { "data-slot": "month-view-nav", children: [
      /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(Button, { type: "button", onClick: handlePreviousMonth, "aria-label": "Previous month", children: "\u2190" }),
      /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(Title, { level: 4, children: (0, import_dayjs6.default)(`${(0, import_dayjs6.default)().year()}-${currentMonth + 1}-01`).format("MMMM") }),
      /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(Button, { type: "button", onClick: handleNextMonth, "aria-label": "Next month", children: "\u2192" })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { "data-slot": "month-view-body", children: [
      /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("div", { "data-slot": "month-view-weekdays", children: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("div", { "data-slot": "month-weekday", children: day }, day)) }),
      /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("div", { "data-slot": "month-view-weeks", children: calendarData.filter((week) => week.some((day) => day.month() === currentMonth)).map((week, weekIndex) => /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { "data-slot": "month-week", children: [
        /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(
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
        /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(
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
    /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(CreateTaskModal, { isOpen: isModalOpen, onClose: () => setIsModalOpen(false) })
  ] });
}

// src/components/WeekView.tsx
var import_dayjs7 = __toESM(require("dayjs"));
var import_react5 = require("react");
var import_react_grid_layout = require("react-grid-layout");
var import_styles = require("react-grid-layout/css/styles.css");
var import_jsx_runtime11 = require("react/jsx-runtime");
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
  const [isTaskOpen, setIsTaskOpen] = (0, import_react5.useState)(false);
  const [isCreateTaskOpen, setIsCreateTaskOpen] = (0, import_react5.useState)(false);
  const [selectedEvent, setSelectedEvent] = (0, import_react5.useState)(null);
  const containerRef = (0, import_react5.useRef)(null);
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
  const getEventGridData = (0, import_react5.useCallback)(
    (event) => {
      const eventStart = (0, import_dayjs7.default)(event.start);
      const eventEnd = (0, import_dayjs7.default)(event.end);
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
  const eventLayouts = (0, import_react5.useMemo)(() => {
    return scheduledEvents.map(getEventGridData).filter(
      (gridData) => gridData !== null
    );
  }, [scheduledEvents, startDate, getEventGridData]);
  const layouts = (0, import_react5.useMemo)(() => {
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
  const weekTitle = (0, import_react5.useMemo)(() => {
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
  const handleDrag = (0, import_react5.useCallback)(
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
  const handleDragStop = (0, import_react5.useCallback)(
    (layout, _oldItem, newItem, _placeholder, _e, element) => {
      if (!newItem || !element) return;
      const event = scheduledEvents.find((ev) => `event-${ev.id}` === newItem.i);
      if (!event) return;
      let newStart = startDate.clone().add(newItem.x, "days");
      const originalDuration = (0, import_dayjs7.default)(event.end).diff((0, import_dayjs7.default)(event.start), "days");
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
      const oldStart = (0, import_dayjs7.default)(event.start);
      const oldEnd = (0, import_dayjs7.default)(event.end);
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
  const handleResizeStop = (0, import_react5.useCallback)(
    (layout) => {
      const event = scheduledEvents.find((ev) => {
        const layoutItem2 = layout.find((item) => item.i === `event-${ev.id}`);
        return layoutItem2 != null;
      });
      if (!event) return;
      const layoutItem = layout.find((item) => item.i === `event-${event.id}`);
      if (!layoutItem) return;
      const oldStart = (0, import_dayjs7.default)(event.start);
      const oldEnd = (0, import_dayjs7.default)(event.end);
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
  const handleUnassignedEventDrop = (0, import_react5.useCallback)(
    (event, dayIndex) => {
      const oldStart = (0, import_dayjs7.default)(event.start);
      const oldEnd = (0, import_dayjs7.default)(event.end);
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
  const handleCreateSubmit = (0, import_react5.useCallback)(
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
            start: (0, import_dayjs7.default)(newEvent.start),
            end: (0, import_dayjs7.default)(newEvent.end)
          });
        } catch (e) {
          setScheduledEvents(prevScheduled);
        }
      }
    },
    [scheduledEvents, setScheduledEvents, onEventCreate]
  );
  return /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { "data-slot": "week-view", className, style, children: [
    /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { "data-slot": "week-view-nav", children: [
      /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(Button, { type: "button", onClick: handlePreviousWeek, "aria-label": "Previous week", children: "\u2190" }),
      /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(Title, { level: 4, children: weekTitle }),
      /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(Button, { type: "button", onClick: handleNextWeek, "aria-label": "Next week", children: "\u2192" })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("div", { "data-slot": "week-view-grid", ref: containerRef, children: /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)(
      import_react_grid_layout.Responsive,
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
          getWeekDaysWithDates().map(({ dayIndex, date }) => /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)(
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
                /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("span", { children: (0, import_dayjs7.default)(date).format("ddd") }),
                /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("span", { children: (0, import_dayjs7.default)(date).format("D") })
              ]
            },
            `day-${dayIndex}`
          )),
          scheduledEvents.map((event) => {
            var _a;
            const gridData = getEventGridData(event);
            if (!gridData) return null;
            return /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)(
              "div",
              {
                "data-grid": gridData,
                "data-slot": "event",
                "data-event-id": event.id,
                "data-color": (_a = event.color) != null ? _a : void 0,
                children: [
                  event.title,
                  /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
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
    /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { "data-slot": "unscheduled-list", children: [
      /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("h3", { "data-slot": "unscheduled-title", children: "Unscheduled events" }),
      !readOnly && /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(Tooltip, { title: "Add new event", children: /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(Button, { type: "button", onClick: openCreateTask, "aria-label": "Add event", children: "+" }) }),
      /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
        CreateTaskModal,
        {
          isOpen: isCreateTaskOpen,
          onClose: closeCreateTask,
          onSubmit: handleCreateSubmit
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("div", { "data-slot": "unscheduled-items", children: unscheduledEvents.map((event) => {
        var _a;
        return /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
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
    selectedEvent && mapFromEvent && /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
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
var import_dayjs8 = __toESM(require("dayjs"));
var import_react6 = require("react");
var import_jsx_runtime12 = require("react/jsx-runtime");
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
  const [selectedDate, setSelectedDate] = (0, import_react6.useState)(null);
  const [isModalOpen, setIsModalOpen] = (0, import_react6.useState)(false);
  const [currentYear, setCurrentYear] = (0, import_react6.useState)((0, import_dayjs8.default)().year());
  const openModalWithDate = (date) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  };
  const generateCalendarData = () => {
    const year = (0, import_dayjs8.default)().year();
    const startDate = (0, import_dayjs8.default)(`${year}-01-01`);
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
  const calendarData = (0, import_react6.useMemo)(() => generateCalendarData(), []);
  const getEventsForWeekInYear = (week) => getEventsForYear(week, events, currentYear);
  const handlePreviousYear = () => {
    setCurrentYear((prev) => prev - 1);
  };
  const handleNextYear = () => {
    setCurrentYear((prev) => prev + 1);
  };
  return /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("div", { "data-slot": "year-view", className, style, children: [
    /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("div", { "data-slot": "year-view-nav", children: [
      /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(Button, { type: "button", onClick: handlePreviousYear, "aria-label": "Previous year", children: "\u2190" }),
      /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(Title, { level: 4, children: currentYear }),
      /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(Button, { type: "button", onClick: handleNextYear, "aria-label": "Next year", children: "\u2192" })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("div", { "data-slot": "year-view-months", children: [...Array(12)].map((_, monthIndex) => /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("div", { "data-slot": "year-month", children: [
      /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(Title, { level: 4, children: (0, import_dayjs8.default)(`${currentYear}-${monthIndex + 1}-01`).format("MMMM") }),
      /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("div", { "data-slot": "year-month-weekdays", children: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("div", { "data-slot": "year-weekday", children: day }, day)) }),
      /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("div", { "data-slot": "year-month-weeks", children: calendarData.filter((week) => week.some((day) => day.month() === monthIndex)).map((week, weekIndex) => /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("div", { "data-slot": "year-week", children: [
        /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
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
        /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
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
    /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(CreateTaskModal, { isOpen: isModalOpen, onClose: () => setIsModalOpen(false) })
  ] });
}

// src/components/Calendar.tsx
var import_jsx_runtime13 = require("react/jsx-runtime");
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
  const [zoomLevel, setZoomLevel] = (0, import_react7.useState)(
    () => views.length > 0 ? views[0] : "week"
  );
  const effectiveZoom = views.includes(zoomLevel) ? zoomLevel : (_a = views[0]) != null ? _a : "week";
  const [scheduledEvents, setScheduledEvents] = (0, import_react7.useState)(
    initialScheduledEvents
  );
  const [unscheduledEvents, setUnscheduledEvents] = (0, import_react7.useState)(
    initialUnscheduledEvents
  );
  const [startDate, setStartDate] = (0, import_react7.useState)((0, import_dayjs9.default)().startOf("week"));
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
    const oldStart = (0, import_dayjs9.default)(draggedEvent.start);
    const oldEnd = (0, import_dayjs9.default)(draggedEvent.end);
    const newStart = startDate.clone().add(dropDateIndex, "days");
    const newEnd = newStart.clone().add(1, "days");
    const prevScheduled = [...scheduledEvents];
    const prevUnscheduled = [...unscheduledEvents];
    setScheduledEvents((prev) => [
      ...prev.filter((ev) => ev.id !== draggedEvent.id),
      __spreadProps(__spreadValues({}, draggedEvent), {
        start: (0, import_dayjs9.default)(newStart.format("YYYY-MM-DD")),
        end: (0, import_dayjs9.default)(newEnd.format("YYYY-MM-DD"))
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
    day: /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
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
    week: /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
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
    month: /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
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
    year: /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
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
  return /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(import_core.DndContext, { onDragEnd: handleDragEnd, children: /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("div", { "data-slot": "calendar-root", className, style, children: [
    showSwitcher && views.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("div", { "data-slot": "calendar-view-switcher", children: /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
      SegmentedControl,
      {
        value: effectiveZoom,
        options: views.map((v) => ({ label: VIEW_LABELS[v], value: v })),
        onChange: (value) => setZoomLevel(value)
      }
    ) }),
    /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("div", { "data-slot": "calendar-content", "data-view": effectiveZoom, children: zoomLevelView[effectiveZoom] })
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
var import_jsx_runtime14 = require("react/jsx-runtime");
var Card = ({ children, className }) => {
  return /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("div", { "data-slot": "card", className, children });
};

// src/components/ui/Tabs.tsx
var import_jsx_runtime15 = require("react/jsx-runtime");
var Tabs = ({
  activeKey,
  onChange,
  className,
  items
}) => {
  var _a;
  return /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)("div", { "data-slot": "tabs", className, children: [
    /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("div", { "data-slot": "tabs-list", children: items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(
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
    /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("div", { "data-slot": "tabs-content", children: (_a = items.find((item) => item.key === activeKey)) == null ? void 0 : _a.children })
  ] });
};

// src/demo/CalendarContainer.tsx
var import_react8 = require("react");
var import_jsx_runtime16 = require("react/jsx-runtime");
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
  const [activeTab, setActiveTab] = (0, import_react8.useState)(
    () => {
      var _a, _b;
      return (_b = (_a = effectiveAreas[0]) == null ? void 0 : _a.id) != null ? _b : "";
    }
  );
  if (!showTabs || effectiveAreas.length <= 1) {
    return /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("div", { "data-slot": "calendar-container", children: /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(
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
  return /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("div", { "data-slot": "calendar-container", "data-tabs": true, children: /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(
    Tabs,
    {
      activeKey: activeTab,
      onChange: setActiveTab,
      items: effectiveAreas.map((area) => ({
        key: area.id,
        label: /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("span", { "data-slot": "tab-label", "data-area-id": area.id, children: area.name }),
        children: /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
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
});
