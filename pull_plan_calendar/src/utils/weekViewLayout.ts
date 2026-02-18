import dayjs, { type Dayjs } from "dayjs";
import type { CalendarEvent } from "../types/calendar";

export interface WeekEventPlacement {
  /** Left position in pixels (from container left). */
  leftPx: number;
  /** Width in pixels. */
  widthPx: number;
  /** Start offset in days from week start (0–6 for visible part). */
  startOffsetDays: number;
  /** Duration in days (inclusive). */
  durationDays: number;
  /** Column width in pixels (containerWidth / 7). */
  columnWidth: number;
}

/**
 * Computes pixel placement for an event in the week view.
 * Clamps the event to the visible week boundaries.
 * All layout math is centralized here (not inline in JSX).
 *
 * @param event - Calendar event with start/end
 * @param weekStart - Start of the visible week (dayjs)
 * @param containerWidth - Measured width of the grid container
 * @param resizeOverlay - Optional: day deltas during resize (left: start delta, right: duration delta) for preview only
 * @returns Placement or null if event has no visible span in the week
 */
export function getEventPlacement(
  event: CalendarEvent,
  weekStart: Dayjs,
  containerWidth: number,
  resizeOverlay?: { leftDeltaDays: number; rightDeltaDays: number },
): WeekEventPlacement | null {
  if (containerWidth <= 0) return null;

  const eventStart = dayjs(event.start);
  const eventEnd = dayjs(event.end);
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
    columnWidth,
  };
}

/**
 * Converts a pixel delta to whole-day movement (snap).
 * Used for drag and resize to get day deltas from pointer movement.
 */
export function pixelDeltaToDayDelta(deltaPx: number, columnWidth: number): number {
  if (columnWidth <= 0) return 0;
  return Math.round(deltaPx / columnWidth);
}

/**
 * Assigns row indices to placements so that overlapping events (in time) are in different rows.
 * Two events overlap when their day ranges intersect.
 * Returns an array of row indices (0, 1, 2, ...) in the same order as the input placements,
 * and the total number of rows used (max row index + 1).
 */
export function getOverlapRowAssignments(
  placements: Array<{ startOffsetDays: number; durationDays: number }>,
): { rowIndices: number[]; numRows: number } {
  if (placements.length === 0) return { rowIndices: [], numRows: 0 };
  const n = placements.length;
  const indices = placements.map((_, i) => i);
  indices.sort((a, b) => {
    const pa = placements[a];
    const pb = placements[b];
    if (pa.startOffsetDays !== pb.startOffsetDays) return pa.startOffsetDays - pb.startOffsetDays;
    return pb.durationDays - pa.durationDays;
  });
  const rowEnd: number[] = [];
  const rowIndices = new Array<number>(n);
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
