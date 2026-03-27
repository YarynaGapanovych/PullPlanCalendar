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
import dayjs12 from "dayjs";
import { useState as useState8 } from "react";

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
import { useState } from "react";
var ALL_VIEWS = ["day", "week", "month", "year"];
function useCalendarViews(views) {
  var _a;
  const orderedViews = ALL_VIEWS.filter((v) => views.includes(v));
  const [zoomLevel, setZoomLevel] = useState(
    () => orderedViews.length > 0 ? orderedViews[0] : "week"
  );
  const effectiveZoom = orderedViews.includes(zoomLevel) ? zoomLevel : (_a = orderedViews[0]) != null ? _a : "week";
  return { orderedViews, setZoomLevel, effectiveZoom };
}

// src/components/DayView.tsx
import dayjs5 from "dayjs";
import { useCallback as useCallback3, useEffect, useMemo, useState as useState3 } from "react";

// src/hooks/useCreateEventSubmit.ts
import dayjs2 from "dayjs";
import { useCallback as useCallback2 } from "react";
function useCreateEventSubmit(scheduledEvents, setScheduledEvents, onEventCreate, onClose) {
  return useCallback2(
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
      onClose();
      if (onEventCreate) {
        try {
          await onEventCreate({
            id: newEvent.id,
            title: newEvent.title,
            start: dayjs2(newEvent.start),
            end: dayjs2(newEvent.end)
          });
        } catch (e) {
          setScheduledEvents(prevScheduled);
        }
      }
    },
    [scheduledEvents, setScheduledEvents, onEventCreate, onClose]
  );
}

// src/components/tasks/CreateTaskModal.tsx
import dayjs3 from "dayjs";
import { useState as useState2 } from "react";
import { jsx as jsx2, jsxs } from "react/jsx-runtime";
function CreateTaskModal({
  isOpen,
  onClose,
  areaId,
  onSubmit,
  className
}) {
  const [taskName, setTaskName] = useState2("");
  const [startDate, setStartDate] = useState2(dayjs3());
  const [endDate, setEndDate] = useState2(dayjs3().add(1, "day"));
  const [isSubmitting, setIsSubmitting] = useState2(false);
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
      setStartDate(dayjs3());
      setEndDate(dayjs3().add(1, "day"));
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleCancel = () => {
    setTaskName("");
    setStartDate(dayjs3());
    setEndDate(dayjs3().add(1, "day"));
    onClose();
  };
  if (!isOpen) return null;
  return /* @__PURE__ */ jsxs("div", { "data-slot": "create-task-modal", role: "dialog", "aria-modal": "true", "aria-labelledby": "create-task-title", className, children: [
    /* @__PURE__ */ jsx2("div", { "data-slot": "create-task-modal-backdrop", onClick: handleCancel, "aria-hidden": true }),
    /* @__PURE__ */ jsxs("div", { "data-slot": "create-task-modal-content", children: [
      /* @__PURE__ */ jsxs("div", { "data-slot": "create-task-modal-header", children: [
        /* @__PURE__ */ jsx2("h2", { id: "create-task-title", "data-slot": "create-task-modal-title", children: "Create New Task" }),
        /* @__PURE__ */ jsx2("button", { type: "button", onClick: handleCancel, "aria-label": "Close", children: "\xD7" })
      ] }),
      /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, "data-slot": "create-task-form", children: [
        /* @__PURE__ */ jsxs("div", { "data-slot": "create-task-fields", children: [
          /* @__PURE__ */ jsx2("label", { htmlFor: "taskName", children: "Task Name" }),
          /* @__PURE__ */ jsx2(
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
          /* @__PURE__ */ jsx2("label", { htmlFor: "startDate", children: "Start Date" }),
          /* @__PURE__ */ jsx2(
            "input",
            {
              id: "startDate",
              type: "date",
              value: startDate.format("YYYY-MM-DD"),
              onChange: (e) => setStartDate(dayjs3(e.target.value)),
              required: true,
              "data-slot": "create-task-start"
            }
          ),
          /* @__PURE__ */ jsx2("label", { htmlFor: "endDate", children: "End Date" }),
          /* @__PURE__ */ jsx2(
            "input",
            {
              id: "endDate",
              type: "date",
              value: endDate.format("YYYY-MM-DD"),
              onChange: (e) => setEndDate(dayjs3(e.target.value)),
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
          /* @__PURE__ */ jsx2("button", { type: "button", onClick: handleCancel, children: "Cancel" }),
          /* @__PURE__ */ jsx2("button", { type: "submit", disabled: isSubmitting || !taskName, children: isSubmitting ? "Creating..." : "Create Task" })
        ] })
      ] })
    ] })
  ] });
}

// src/components/tasks/TaskModal.tsx
import dayjs4 from "dayjs";
import { jsx as jsx3, jsxs as jsxs2 } from "react/jsx-runtime";
function TaskModal({
  task,
  isOpen,
  onClose,
  className
}) {
  if (!isOpen) return null;
  return /* @__PURE__ */ jsxs2("div", { "data-slot": "task-modal", role: "dialog", "aria-modal": "true", "aria-labelledby": "task-modal-title", className, children: [
    /* @__PURE__ */ jsx3("div", { "data-slot": "task-modal-backdrop", onClick: onClose, "aria-hidden": true }),
    /* @__PURE__ */ jsxs2("div", { "data-slot": "task-modal-content", children: [
      /* @__PURE__ */ jsxs2("div", { "data-slot": "task-modal-header", children: [
        /* @__PURE__ */ jsx3("h2", { id: "task-modal-title", "data-slot": "task-modal-title", children: "Task Details" }),
        /* @__PURE__ */ jsx3("button", { type: "button", onClick: onClose, "aria-label": "Close", children: "\xD7" })
      ] }),
      /* @__PURE__ */ jsxs2("div", { "data-slot": "task-modal-body", children: [
        /* @__PURE__ */ jsx3("p", { "data-slot": "task-name", children: task.name }),
        /* @__PURE__ */ jsxs2("p", { "data-slot": "task-start", children: [
          "Start: ",
          dayjs4(task.startDate).format("MMM D, YYYY")
        ] }),
        /* @__PURE__ */ jsxs2("p", { "data-slot": "task-end", children: [
          "End: ",
          dayjs4(task.endDate).format("MMM D, YYYY")
        ] })
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
function isFullDayEvent(event, dayStart, dayEnd) {
  const start = dayjs5(event.start);
  const end = dayjs5(event.end);
  return (start.isBefore(dayStart) || start.isSame(dayStart)) && (end.isAfter(dayEnd) || end.isSame(dayEnd));
}
function getEventDayPosition(event, dayStart, dayEnd, hourRowHeight) {
  const start = dayjs5(event.start);
  const end = dayjs5(event.end);
  const visualStart = start.isBefore(dayStart) ? dayStart : start;
  const visualEnd = end.isAfter(dayEnd) ? dayEnd : end;
  if (!visualStart.isBefore(visualEnd) && !visualStart.isSame(visualEnd))
    return null;
  const topPx = visualStart.diff(dayStart, "minute") * (hourRowHeight / 60);
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
  onEventResize,
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
  className,
  style
}) {
  const [isTaskOpen, setIsTaskOpen] = useState3(false);
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState3(false);
  const [selectedEvent, setSelectedEvent] = useState3(
    null
  );
  const openTask = () => setIsTaskOpen(true);
  const closeTask = () => {
    setIsTaskOpen(false);
    setSelectedEvent(null);
  };
  const openCreateTask = async () => {
    if (onDateClick) {
      try {
        await onDateClick(startDate, "day");
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
  const dayStart = useMemo(() => startDate.startOf("day"), [startDate]);
  const dayEnd = useMemo(() => startDate.endOf("day"), [startDate]);
  const [now, setNow] = useState3(() => dayjs5());
  const isViewingToday = startDate.isSame(now, "day");
  useEffect(() => {
    if (!isViewingToday) return;
    const t = setInterval(() => setNow(dayjs5()), 6e4);
    return () => clearInterval(t);
  }, [isViewingToday]);
  const eventsForDay = useMemo(() => {
    return scheduledEvents.filter((event) => {
      const eventStart = dayjs5(event.start);
      const eventEnd = dayjs5(event.end);
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
  const handleUnassignedEventDrop = useCallback3(
    (event) => {
      const oldStart = dayjs5(event.start);
      const oldEnd = dayjs5(event.end);
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
    closeCreateTask
  );
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
      /* @__PURE__ */ jsx8(Button, { type: "button", onClick: handleNextDay, "aria-label": "Next day", children: nextDayButtonContent })
    ] }),
    fullDayEvents.length > 0 && /* @__PURE__ */ jsxs3("div", { "data-slot": "day-multiday", children: [
      /* @__PURE__ */ jsx8("h3", { "data-slot": "day-multiday-title", children: "All-day / multi-day" }),
      /* @__PURE__ */ jsx8("div", { "data-slot": "day-multiday-items", children: fullDayEvents.map((event) => {
        var _a;
        return /* @__PURE__ */ jsxs3(
          "div",
          {
            "data-slot": "event",
            "data-event-id": event.id,
            "data-allday": true,
            "data-color": (_a = event.color) != null ? _a : void 0,
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
        "data-slot": "day-view-grid",
        style: {
          display: "grid",
          gridTemplateColumns: "4rem 1fr",
          gridTemplateRows: `repeat(24, ${HOUR_ROW_HEIGHT}px)`
        },
        children: [
          hours.map((hour) => /* @__PURE__ */ jsx8(
            "div",
            {
              "data-slot": "day-hour",
              "data-hour": hour,
              style: { gridRow: hour + 1, minHeight: HOUR_ROW_HEIGHT },
              children: hour === 0 ? "12 AM" : hour < 12 ? `${hour} AM` : hour === 12 ? "12 PM" : `${hour - 12} PM`
            },
            hour
          )),
          /* @__PURE__ */ jsxs3(
            "div",
            {
              "data-slot": "day-events",
              style: {
                gridColumn: 2,
                gridRow: "1 / -1",
                minHeight: 24 * HOUR_ROW_HEIGHT,
                position: "relative",
                borderLeft: "1px solid #f3f4f6"
              },
              children: [
                isViewingToday && /* @__PURE__ */ jsx8(
                  "div",
                  {
                    "data-slot": "day-now-line",
                    "aria-hidden": true,
                    style: {
                      position: "absolute",
                      left: 0,
                      right: 0,
                      top: now.diff(dayStart, "minute") * (HOUR_ROW_HEIGHT / 60),
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
                      margin: 0
                    },
                    children: "No events scheduled"
                  }
                ) : timedEvents.map((event) => {
                  var _a;
                  const pos = getEventDayPosition(
                    event,
                    dayStart,
                    dayEnd,
                    HOUR_ROW_HEIGHT
                  );
                  if (!pos) return null;
                  return /* @__PURE__ */ jsxs3(
                    "div",
                    {
                      "data-slot": "event",
                      "data-event-id": event.id,
                      "data-color": (_a = event.color) != null ? _a : void 0,
                      style: {
                        position: "absolute",
                        left: 4,
                        right: 4,
                        top: pos.topPx,
                        height: pos.heightPx,
                        boxSizing: "border-box",
                        padding: "2px 6px",
                        overflow: "hidden"
                      },
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
                })
              ]
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxs3("div", { "data-slot": "unscheduled-list", children: [
      /* @__PURE__ */ jsx8("h3", { "data-slot": "unscheduled-title", children: "Unscheduled events" }),
      !readOnly && (AddEventButton ? /* @__PURE__ */ jsx8(AddEventButton, { onClick: openCreateTask }) : /* @__PURE__ */ jsx8(Tooltip, { title: "Add new event", children: /* @__PURE__ */ jsx8(
        Button,
        {
          type: "button",
          onClick: openCreateTask,
          "aria-label": "Add event",
          children: "+"
        }
      ) })),
      CreateEventModal ? /* @__PURE__ */ jsx8(
        CreateEventModal,
        {
          isOpen: isCreateTaskOpen,
          onClose: closeCreateTask,
          onSubmit: handleCreateSubmit
        }
      ) : /* @__PURE__ */ jsx8(
        CreateTaskModal,
        {
          isOpen: isCreateTaskOpen,
          onClose: closeCreateTask,
          onSubmit: handleCreateSubmit
        }
      ),
      /* @__PURE__ */ jsx8("div", { "data-slot": "unscheduled-items", children: unscheduledEvents.map((event) => {
        var _a;
        return /* @__PURE__ */ jsx8(
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
      unscheduledEvents.length > 0 && !readOnly && /* @__PURE__ */ jsx8("p", { "data-slot": "unscheduled-hint", children: "Drag an event onto the day above to schedule it, or double-click to view." })
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
import dayjs8 from "dayjs";
import { useMemo as useMemo2, useState as useState5 } from "react";

// src/utils/calendarHelpers.ts
import dayjs6 from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import minMax from "dayjs/plugin/minMax";
dayjs6.extend(isBetween);
dayjs6.extend(minMax);
var generateCalendarWeeks = (year) => {
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
var getEventsForWeek = (week, events) => {
  return events.filter((event) => {
    const start = dayjs6(event.start);
    const end = dayjs6(event.end);
    return week.some((day) => day.isBetween(start, end, void 0, "[]"));
  });
};
var getEventsForYear = (week, events, year) => {
  return events.filter((event) => {
    const start = dayjs6(event.start);
    const end = dayjs6(event.end);
    return week.some((day) => day.isBetween(start, end, void 0, "[]")) && (start.year() === year || end.year() === year);
  });
};
var getTasksForWeek = (week, tasks) => {
  return tasks.filter((task) => {
    const start = dayjs6(task.startDate);
    const end = dayjs6(task.endDate);
    return week.some((day) => day.isBetween(start, end, void 0, "[]"));
  });
};
var getTasksForYear = (week, tasks, year) => {
  return tasks.filter((task) => {
    const start = dayjs6(task.startDate);
    const end = dayjs6(task.endDate);
    return week.some((day) => day.isBetween(start, end, void 0, "[]")) && (start.year() === year || end.year() === year);
  });
};

// src/components/ui/Text.tsx
import { jsx as jsx9 } from "react/jsx-runtime";
var Text = ({ children, className }) => {
  return /* @__PURE__ */ jsx9("span", { "data-slot": "text", className, children });
};

// src/components/Week.tsx
import dayjs7 from "dayjs";
import { useState as useState4 } from "react";
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
  mapFromEvent
}) {
  const [isTaskOpen, setIsTaskOpen] = useState4(false);
  const [selectedEvent, setSelectedEvent] = useState4(null);
  const openTask = () => setIsTaskOpen(true);
  const closeTask = () => {
    setIsTaskOpen(false);
    setSelectedEvent(null);
  };
  const eventsForWeek = events.filter(
    (event) => days.some(
      (day) => dayjs7(day).isBetween(
        dayjs7(event.start),
        dayjs7(event.end),
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
      Array(days[0].day()).fill(null).map((_, index) => /* @__PURE__ */ jsx10("div", { "data-slot": "week-day-spacer" }, `empty-${index}`)),
      days.map((day, index) => {
        const isCurrentMonth = day.month() === currentMonth;
        if (isCurrentMonth) {
          return /* @__PURE__ */ jsxs4("div", { "data-slot": "week-day", "data-date": day.format("YYYY-MM-DD"), children: [
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
          ] }, index);
        }
        return /* @__PURE__ */ jsx10("div", { "data-slot": "week-day-spacer" }, `empty-${index}`);
      })
    ] }),
    /* @__PURE__ */ jsxs4("div", { "data-slot": "week-events", style: { display: "grid", gridTemplateColumns: "repeat(7, 1fr)" }, children: [
      eventsForWeek.slice(0, 3).map((event, eventIndex) => {
        var _a;
        const eventStart = dayjs7(event.start);
        const eventEnd = dayjs7(event.end);
        const weekStart = dayjs7(days[0]);
        const weekEnd = dayjs7(days[6]);
        const actualStart = dayjs7.max(eventStart, weekStart);
        const actualEnd = dayjs7.min(eventEnd, weekEnd);
        const startColumn = days.findIndex((d) => d.isSame(actualStart, "day"));
        const eventSpan = actualEnd.diff(actualStart, "days") + 1;
        const endColumn = startColumn + eventSpan - 1;
        return /* @__PURE__ */ jsx10(
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
    selectedEvent && mapFromEvent && /* @__PURE__ */ jsx10(
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
import { jsx as jsx11, jsxs as jsxs5 } from "react/jsx-runtime";
function MonthView({
  events,
  setEvents,
  setStartDate,
  setZoomLevel,
  onEventClick,
  onDateClick,
  readOnly = false,
  updateTask = async () => {
  },
  mapFromEvent,
  AddEventButton,
  CreateEventModal,
  previousMonthButtonContent = "\u2190",
  nextMonthButtonContent = "\u2192",
  className,
  style
}) {
  const [currentMonth, setCurrentMonth] = useState5(dayjs8().month());
  const [selectedDate, setSelectedDate] = useState5(null);
  const [isModalOpen, setIsModalOpen] = useState5(false);
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
      /* @__PURE__ */ jsx11(
        Button,
        {
          type: "button",
          onClick: handlePreviousMonth,
          "aria-label": "Previous month",
          children: previousMonthButtonContent
        }
      ),
      /* @__PURE__ */ jsx11(Title, { level: 4, children: dayjs8(`${dayjs8().year()}-${currentMonth + 1}-01`).format("MMMM") }),
      /* @__PURE__ */ jsx11(Button, { type: "button", onClick: handleNextMonth, "aria-label": "Next month", children: nextMonthButtonContent }),
      !readOnly && AddEventButton && /* @__PURE__ */ jsx11(AddEventButton, { onClick: () => openModalWithDate(dayjs8()) })
    ] }),
    /* @__PURE__ */ jsxs5("div", { "data-slot": "month-view-body", children: [
      /* @__PURE__ */ jsx11("div", { "data-slot": "month-view-weekdays", children: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => /* @__PURE__ */ jsx11("div", { "data-slot": "month-weekday", children: day }, day)) }),
      /* @__PURE__ */ jsx11("div", { "data-slot": "month-view-weeks", children: calendarData.filter((week) => week.some((day) => day.month() === currentMonth)).map((week, weekIndex) => /* @__PURE__ */ jsxs5("div", { "data-slot": "month-week", children: [
        /* @__PURE__ */ jsx11(
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
            mapFromEvent
          }
        )
      ] }, weekIndex)) })
    ] }),
    CreateEventModal ? /* @__PURE__ */ jsx11(
      CreateEventModal,
      {
        isOpen: isModalOpen,
        onClose: () => setIsModalOpen(false)
      }
    ) : /* @__PURE__ */ jsx11(
      CreateTaskModal,
      {
        isOpen: isModalOpen,
        onClose: () => setIsModalOpen(false)
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
import dayjs10 from "dayjs";
import { useCallback as useCallback4, useEffect as useEffect2, useMemo as useMemo4, useRef, useState as useState6 } from "react";

// src/utils/weekViewLayout.ts
import dayjs9 from "dayjs";
function getEventPlacement(event, weekStart, containerWidth, resizeOverlay) {
  if (containerWidth <= 0) return null;
  const eventStart = dayjs9(event.start);
  const eventEnd = dayjs9(event.end);
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
        /* @__PURE__ */ jsx12(
          "span",
          {
            style: {
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              flex: 1
            },
            children: event.title
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
  onDateClick,
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
  className,
  style
}) {
  const [isTaskOpen, setIsTaskOpen] = useState6(false);
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState6(false);
  const [selectedEvent, setSelectedEvent] = useState6(
    null
  );
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState6(0);
  const [dragDelta, setDragDelta] = useState6(
    null
  );
  const [resizePreview, setResizePreview] = useState6(null);
  const [resizing, setResizing] = useState6(null);
  const resizePreviewRef = useRef({ leftDeltaDays: 0, rightDeltaDays: 0 });
  const lastClampedDeltaRef = useRef(null);
  useEffect2(() => {
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
  const openCreateTask = async () => {
    if (onDateClick) {
      try {
        await onDateClick(startDate, "week");
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
  const handlePreviousWeek = useCallback4(() => {
    setStartDate(startDate.subtract(1, "week"));
  }, [startDate, setStartDate]);
  const handleNextWeek = useCallback4(() => {
    setStartDate(startDate.add(1, "week"));
  }, [startDate, setStartDate]);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );
  const handleDragMove = useCallback4(
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
  const handleDragEnd = useCallback4(
    (event) => {
      var _a;
      const { active, delta } = event;
      const effectiveDeltaX = ((_a = lastClampedDeltaRef.current) == null ? void 0 : _a.id) === active.id ? lastClampedDeltaRef.current.x : delta.x;
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
      const oldStart = dayjs10(ev.start);
      const oldEnd = dayjs10(ev.end);
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
  const onResizeStart = useCallback4(
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
  useEffect2(() => {
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
      const oldStart = dayjs10(evt.start);
      const oldEnd = dayjs10(evt.end);
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
  const handleUnassignedEventDrop = useCallback4(
    (event, dayIndex) => {
      const oldStart = dayjs10(event.start);
      const oldEnd = dayjs10(event.end);
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
    closeCreateTask
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
            /* @__PURE__ */ jsx13("span", { children: dayjs10(date).format("ddd") }),
            /* @__PURE__ */ jsx13("span", { children: dayjs10(date).format("D") })
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
      /* @__PURE__ */ jsx13("h3", { "data-slot": "unscheduled-title", children: "Unscheduled events" }),
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
          onSubmit: handleCreateSubmit
        }
      ) : /* @__PURE__ */ jsx13(
        CreateTaskModal,
        {
          isOpen: isCreateTaskOpen,
          onClose: closeCreateTask,
          onSubmit: handleCreateSubmit
        }
      ),
      /* @__PURE__ */ jsx13("div", { "data-slot": "unscheduled-items", children: unscheduledEvents.map((event) => {
        var _a;
        return /* @__PURE__ */ jsx13(
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
import dayjs11 from "dayjs";
import { useMemo as useMemo5, useState as useState7 } from "react";
import { jsx as jsx14, jsxs as jsxs8 } from "react/jsx-runtime";
function YearView({
  events,
  setEvents,
  setStartDate,
  setZoomLevel,
  onEventClick,
  onDateClick,
  readOnly = false,
  updateTask = async () => {
  },
  mapFromEvent,
  AddEventButton,
  CreateEventModal,
  previousYearButtonContent = "\u2190",
  nextYearButtonContent = "\u2192",
  className,
  style
}) {
  const [selectedDate, setSelectedDate] = useState7(null);
  const [isModalOpen, setIsModalOpen] = useState7(false);
  const [currentYear, setCurrentYear] = useState7(dayjs11().year());
  const openModalWithDate = (date) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  };
  const generateCalendarData = () => {
    const year = dayjs11().year();
    const startDate = dayjs11(`${year}-01-01`);
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
  const calendarData = useMemo5(() => generateCalendarData(), []);
  const getEventsForWeekInYear = (week) => getEventsForYear(week, events, currentYear);
  const handlePreviousYear = () => {
    setCurrentYear((prev) => prev - 1);
  };
  const handleNextYear = () => {
    setCurrentYear((prev) => prev + 1);
  };
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
      !readOnly && AddEventButton && /* @__PURE__ */ jsx14(AddEventButton, { onClick: () => openModalWithDate(dayjs11()) })
    ] }),
    /* @__PURE__ */ jsx14("div", { "data-slot": "year-view-months", children: [...Array(12)].map((_, monthIndex) => /* @__PURE__ */ jsxs8("div", { "data-slot": "year-month", children: [
      /* @__PURE__ */ jsx14(Title, { level: 4, children: dayjs11(`${currentYear}-${monthIndex + 1}-01`).format("MMMM") }),
      /* @__PURE__ */ jsx14("div", { "data-slot": "year-month-weekdays", children: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => /* @__PURE__ */ jsx14("div", { "data-slot": "year-weekday", children: day }, day)) }),
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
              openModalWithDate(week[0]);
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
            mapFromEvent
          }
        )
      ] }, weekIndex)) })
    ] }, monthIndex)) }),
    CreateEventModal ? /* @__PURE__ */ jsx14(
      CreateEventModal,
      {
        isOpen: isModalOpen,
        onClose: () => setIsModalOpen(false)
      }
    ) : /* @__PURE__ */ jsx14(
      CreateTaskModal,
      {
        isOpen: isModalOpen,
        onClose: () => setIsModalOpen(false)
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
  className,
  style,
  viewSwitcherClassName,
  viewSwitcherButtonClassName
}) {
  const { orderedViews, setZoomLevel, effectiveZoom } = useCalendarViews(views);
  const [scheduledEvents, setScheduledEvents] = useState8(
    () => {
      var _a;
      return (_a = defaultScheduledEvents != null ? defaultScheduledEvents : defaultEvents) != null ? _a : [];
    }
  );
  const [unscheduledEvents, setUnscheduledEvents] = useState8(
    () => defaultUnscheduledEvents != null ? defaultUnscheduledEvents : []
  );
  const [startDate, setStartDate] = useState8(dayjs12().startOf("week"));
  const handleDragEnd = useCalendarDragEnd(
    startDate,
    scheduledEvents,
    unscheduledEvents,
    setScheduledEvents,
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
        setScheduledEvents,
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
        nextDayButtonContent
      }
    ),
    week: /* @__PURE__ */ jsx15(
      WeekView,
      {
        startDate,
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
        readOnly,
        mapFromEvent,
        AddEventButton,
        CreateEventModal,
        EventActionButton,
        EventDetailModal,
        previousWeekButtonContent,
        nextWeekButtonContent
      }
    ),
    month: /* @__PURE__ */ jsx15(
      MonthView,
      {
        setStartDate,
        events: scheduledEvents,
        setEvents: setScheduledEvents,
        setZoomLevel,
        onEventClick,
        onDateClick,
        readOnly,
        mapFromEvent,
        AddEventButton,
        CreateEventModal,
        previousMonthButtonContent,
        nextMonthButtonContent
      }
    ),
    year: /* @__PURE__ */ jsx15(
      YearView,
      {
        setStartDate,
        events: scheduledEvents,
        setEvents: setScheduledEvents,
        setZoomLevel,
        onEventClick,
        onDateClick,
        readOnly,
        mapFromEvent,
        AddEventButton,
        CreateEventModal,
        previousYearButtonContent,
        nextYearButtonContent
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
  generateCalendarWeeks,
  getEventsForWeek,
  getEventsForYear,
  getTaskColorHex,
  getTasksForWeek,
  getTasksForYear,
  mapEventToTask,
  mapTaskToEvent
};
