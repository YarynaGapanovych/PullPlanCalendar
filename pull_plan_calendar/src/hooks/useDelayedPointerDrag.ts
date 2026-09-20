"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  POINTER_DRAG_DELAY_MS,
  POINTER_DRAG_MOUSE_DISTANCE_PX,
  POINTER_DRAG_TOLERANCE_PX,
  isTouchLikePointer,
  pointerDistance,
} from "../utils/pointerDrag";

type Session<T> = {
  payload: T;
  pointerId: number;
  startX: number;
  startY: number;
  target: HTMLElement;
  activated: boolean;
  aborted: boolean;
  timer: ReturnType<typeof setTimeout> | null;
  savedTouchAction: string;
  lastEvent: PointerEvent;
};

type DelayedPointerDragOptions<T> = {
  disabled?: boolean;
  onDragStart?: (payload: T, event: PointerEvent) => void;
  onDragMove: (payload: T, event: PointerEvent) => void;
  onDragEnd: (payload: T, event: PointerEvent) => void;
  onDragCancel?: (payload: T) => void;
  /** Pointer released without activating a drag (tap). Not called if the gesture became a scroll. */
  onPress?: (payload: T, event: PointerEvent) => void;
};

/**
 * Pointer drag that does not fight mobile scroll:
 * - touch/pen: activate after a hold, abort if the pointer moves past tolerance
 * - mouse: activate after a small distance
 * `touch-action: none` is applied only after the drag has activated.
 */
export function useDelayedPointerDrag<T>(options: DelayedPointerDragOptions<T>) {
  const optsRef = useRef(options);
  const sessionRef = useRef<Session<T> | null>(null);
  const detachRef = useRef<(() => void) | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  useLayoutEffect(() => {
    optsRef.current = options;
  }, [options]);

  const clearSession = useCallback((releaseCapture: boolean) => {
    const session = sessionRef.current;
    if (!session) return;
    if (session.timer != null) {
      clearTimeout(session.timer);
      session.timer = null;
    }
    if (releaseCapture) {
      session.target.style.touchAction = session.savedTouchAction;
      try {
        if (session.target.hasPointerCapture(session.pointerId)) {
          session.target.releasePointerCapture(session.pointerId);
        }
      } catch {
        // ignore elements that do not support capture
      }
    }
    sessionRef.current = null;
    setIsDragging(false);
  }, []);

  useEffect(
    () => () => {
      detachRef.current?.();
    },
    [],
  );

  const onPointerDown = useCallback(
    (event: React.PointerEvent, payload: T) => {
      if (optsRef.current.disabled) return;
      if (event.button !== 0) return;
      detachRef.current?.();

      const target = event.currentTarget as HTMLElement;
      const nativeEvent = event.nativeEvent;
      const touchLike = isTouchLikePointer(event.pointerType);

      const session: Session<T> = {
        payload,
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        target,
        activated: false,
        aborted: false,
        timer: null,
        savedTouchAction: target.style.touchAction,
        lastEvent: nativeEvent,
      };
      sessionRef.current = session;

      const activate = (e: PointerEvent) => {
        const current = sessionRef.current;
        if (!current || current.aborted || current.activated) return;
        current.activated = true;
        if (current.timer != null) {
          clearTimeout(current.timer);
          current.timer = null;
        }
        current.target.style.touchAction = "none";
        try {
          current.target.setPointerCapture(current.pointerId);
        } catch {
          // ignore
        }
        setIsDragging(true);
        optsRef.current.onDragStart?.(current.payload, e);
      };

      const onMove = (e: PointerEvent) => {
        const current = sessionRef.current;
        if (!current || e.pointerId !== current.pointerId) return;
        current.lastEvent = e;
        if (!current.activated) {
          const dist = pointerDistance(e, {
            clientX: current.startX,
            clientY: current.startY,
          });
          if (touchLike) {
            if (dist > POINTER_DRAG_TOLERANCE_PX) {
              current.aborted = true;
              detach();
              optsRef.current.onDragCancel?.(current.payload);
            }
            return;
          }
          if (dist >= POINTER_DRAG_MOUSE_DISTANCE_PX) {
            activate(e);
            optsRef.current.onDragMove(current.payload, e);
          }
          return;
        }
        if (e.cancelable) e.preventDefault();
        optsRef.current.onDragMove(current.payload, e);
      };

      const onTouchMove = (e: TouchEvent) => {
        const current = sessionRef.current;
        if (!current?.activated) return;
        if (e.cancelable) e.preventDefault();
      };

      const onUp = (e: PointerEvent) => {
        const current = sessionRef.current;
        if (!current || e.pointerId !== current.pointerId) return;
        const activated = current.activated;
        const aborted = current.aborted;
        const payloadAtEnd = current.payload;
        const canceled = e.type === "pointercancel";
        detach();
        if (activated && !canceled) {
          optsRef.current.onDragEnd(payloadAtEnd, e);
        } else if (!activated && !aborted && !canceled) {
          optsRef.current.onPress?.(payloadAtEnd, e);
        } else {
          optsRef.current.onDragCancel?.(payloadAtEnd);
        }
      };

      const detach = () => {
        window.removeEventListener("pointermove", onMove, true);
        window.removeEventListener("pointerup", onUp, true);
        window.removeEventListener("pointercancel", onUp, true);
        window.removeEventListener("touchmove", onTouchMove, true);
        detachRef.current = null;
        clearSession(true);
      };
      detachRef.current = detach;

      window.addEventListener("pointermove", onMove, {
        capture: true,
        passive: false,
      });
      window.addEventListener("pointerup", onUp, { capture: true });
      window.addEventListener("pointercancel", onUp, { capture: true });
      window.addEventListener("touchmove", onTouchMove, {
        capture: true,
        passive: false,
      });

      if (touchLike) {
        session.timer = setTimeout(() => {
          const current = sessionRef.current;
          if (!current || current.aborted) return;
          activate(current.lastEvent);
        }, POINTER_DRAG_DELAY_MS);
      }
    },
    [clearSession],
  );

  return { onPointerDown, isDragging };
}
