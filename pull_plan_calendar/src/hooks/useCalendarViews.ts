import { useCallback, useState } from "react";
import type { CalendarViewMode } from "../types/calendar";

export const ALL_VIEWS: CalendarViewMode[] = ["day", "week", "month", "year"];

export function useCalendarViews(
  views: CalendarViewMode[],
  options?: {
    view?: CalendarViewMode;
    defaultView?: CalendarViewMode;
    onViewChange?: (view: CalendarViewMode) => void;
  },
) {
  const orderedViews = ALL_VIEWS.filter((v) => views.includes(v));
  const fallback =
    options?.defaultView && orderedViews.includes(options.defaultView)
      ? options.defaultView
      : (orderedViews[0] ?? "week");

  const isControlled = options?.view !== undefined;
  const [internalZoom, setInternalZoom] = useState<CalendarViewMode>(fallback);

  const zoomLevel = isControlled ? options.view! : internalZoom;
  const effectiveZoom = orderedViews.includes(zoomLevel)
    ? zoomLevel
    : (orderedViews[0] ?? "week");

  const setZoomLevel = useCallback(
    (next: CalendarViewMode) => {
      if (!isControlled) {
        setInternalZoom(next);
      }
      options?.onViewChange?.(next);
    },
    [isControlled, options?.onViewChange],
  );

  return { orderedViews, setZoomLevel, effectiveZoom };
}
