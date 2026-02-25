import { useState } from "react";
import type { CalendarViewMode } from "../types/calendar";

export const ALL_VIEWS: CalendarViewMode[] = ["day", "week", "month", "year"];

export function useCalendarViews(views: CalendarViewMode[]) {
  const orderedViews = ALL_VIEWS.filter((v) => views.includes(v));
  const [zoomLevel, setZoomLevel] = useState<CalendarViewMode>(() =>
    orderedViews.length > 0 ? orderedViews[0] : "week",
  );
  const effectiveZoom = orderedViews.includes(zoomLevel)
    ? zoomLevel
    : (orderedViews[0] ?? "week");
  return { orderedViews, setZoomLevel, effectiveZoom };
}
