"use client";

import type { Dayjs } from "dayjs";
import { useEffect, useState } from "react";
import {
  fromDatetimeLocalValue,
  toDatetimeLocalValue,
} from "../../utils/timeGrid";

export interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  areaId?: string;
  onSubmit?: (data: {
    name: string;
    startDate: Dayjs | null;
    endDate: Dayjs | null;
  }) => Promise<void>;
  /** Seed start when the modal opens. Null/omit leaves the field empty. */
  initialStartDate?: Dayjs | null;
  /** Seed end when the modal opens. Null/omit leaves the field empty. */
  initialEndDate?: Dayjs | null;
  className?: string;
}

export function CreateTaskModal({
  isOpen,
  onClose,
  areaId,
  onSubmit,
  initialStartDate,
  initialEndDate,
  className,
}: CreateTaskModalProps) {
  const [taskName, setTaskName] = useState("");
  const [startDate, setStartDate] = useState<Dayjs | null>(
    () => initialStartDate ?? null,
  );
  const [endDate, setEndDate] = useState<Dayjs | null>(
    () => initialEndDate ?? null,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [startEditing, setStartEditing] = useState(false);
  const [endEditing, setEndEditing] = useState(false);

  const datesSeeded = initialStartDate != null || initialEndDate != null;
  const datesPartial =
    (startDate != null && endDate == null) ||
    (startDate == null && endDate != null);
  const startInputType =
    datesSeeded || startDate != null || startEditing
      ? "datetime-local"
      : "text";
  const endInputType =
    datesSeeded || endDate != null || endEditing ? "datetime-local" : "text";

  useEffect(() => {
    if (!isOpen) return;
    setTaskName("");
    setStartDate(initialStartDate ?? null);
    setEndDate(initialEndDate ?? null);
    setStartEditing(false);
    setEndEditing(false);
    // Seed only when the modal opens; initials are read from the open render.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- open transition only
  }, [isOpen]);

  const resetFields = () => {
    setTaskName("");
    setStartDate(null);
    setEndDate(null);
    setStartEditing(false);
    setEndEditing(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
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

  return (
    <div
      data-slot="create-task-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-task-title"
      className={className}
    >
      <div
        data-slot="create-task-modal-backdrop"
        onClick={handleCancel}
        aria-hidden
      />
      <div data-slot="create-task-modal-content">
        <div data-slot="create-task-modal-header">
          <h2 id="create-task-title" data-slot="create-task-modal-title">
            Create New Event
          </h2>
          <button type="button" onClick={handleCancel} aria-label="Close">
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit} data-slot="create-task-form">
          <div data-slot="create-task-fields">
            <label htmlFor="taskName">Event Name</label>
            <input
              id="taskName"
              type="text"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              required
              placeholder="Enter event name"
              data-slot="create-task-name"
            />
            <label htmlFor="startDate">Start</label>
            <input
              id="startDate"
              type={startInputType}
              value={toDatetimeLocalValue(startDate)}
              placeholder="Not set"
              onFocus={() => setStartEditing(true)}
              onBlur={() => {
                if (startDate == null) setStartEditing(false);
              }}
              onChange={(e) =>
                setStartDate(fromDatetimeLocalValue(e.target.value))
              }
              required={datesSeeded}
              data-slot="create-task-start"
            />
            <label htmlFor="endDate">End</label>
            <input
              id="endDate"
              type={endInputType}
              value={toDatetimeLocalValue(endDate)}
              placeholder="Not set"
              onFocus={() => setEndEditing(true)}
              onBlur={() => {
                if (endDate == null) setEndEditing(false);
              }}
              onChange={(e) =>
                setEndDate(fromDatetimeLocalValue(e.target.value))
              }
              required={datesSeeded}
              min={toDatetimeLocalValue(startDate) || undefined}
              data-slot="create-task-end"
            />
            {areaId && (
              <div data-slot="create-task-area">Area ID: {areaId}</div>
            )}
          </div>
          <div data-slot="create-task-actions">
            <button type="button" onClick={handleCancel}>
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !taskName || datesPartial}
            >
              {isSubmitting ? "Creating..." : "Create Event"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
