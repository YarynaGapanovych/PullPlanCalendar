/** Hold duration before a touch drag starts so a swipe can still scroll. */
export const POINTER_DRAG_DELAY_MS = 250;
/** Max movement (px) during the touch delay before the gesture is treated as scroll. */
export const POINTER_DRAG_TOLERANCE_PX = 5;
/** Mouse movement (px) before a drag starts. Clicks stay clicks. */
export const POINTER_DRAG_MOUSE_DISTANCE_PX = 5;
/** Week event resize hit target. Wide enough for a finger; still smaller than a 1-day chip. */
export const RESIZE_HANDLE_WIDTH_PX = 20;

/**
 * Resize hit target for one week column.
 * On a narrow column, keep it to about a quarter of the day (at least 8px)
 * so the middle of the bar stays a drag and tap target.
 */
export function weekResizeHandleWidth(columnWidth: number): number {
  if (columnWidth <= 0) return RESIZE_HANDLE_WIDTH_PX;
  return Math.min(RESIZE_HANDLE_WIDTH_PX, Math.max(8, columnWidth * 0.25));
}

export function pointerDistance(
  a: { clientX: number; clientY: number },
  b: { clientX: number; clientY: number },
): number {
  return Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
}

export function isTouchLikePointer(pointerType: string): boolean {
  return pointerType === "touch" || pointerType === "pen";
}

export function pointInRect(
  x: number,
  y: number,
  rect: DOMRectReadOnly,
): boolean {
  return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
}
