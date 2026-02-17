"use client";

import dayjs, { type Dayjs } from "dayjs";
import { useState } from "react";

export interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  areaId?: string;
  onSubmit?: (data: { name: string; startDate: Dayjs; endDate: Dayjs }) => Promise<void>;
  className?: string;
}

export function CreateTaskModal({
  isOpen,
  onClose,
  areaId,
  onSubmit,
  className,
}: CreateTaskModalProps) {
  const [taskName, setTaskName] = useState("");
  const [startDate, setStartDate] = useState<Dayjs>(dayjs());
  const [endDate, setEndDate] = useState<Dayjs>(dayjs().add(1, "day"));
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
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

  return (
    <div data-slot="create-task-modal" role="dialog" aria-modal="true" aria-labelledby="create-task-title" className={className}>
      <div data-slot="create-task-modal-backdrop" onClick={handleCancel} aria-hidden />
      <div data-slot="create-task-modal-content">
        <div data-slot="create-task-modal-header">
          <h2 id="create-task-title" data-slot="create-task-modal-title">Create New Task</h2>
          <button type="button" onClick={handleCancel} aria-label="Close">×</button>
        </div>
        <form onSubmit={handleSubmit} data-slot="create-task-form">
          <div data-slot="create-task-fields">
            <label htmlFor="taskName">Task Name</label>
            <input
              id="taskName"
              type="text"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              required
              placeholder="Enter task name"
              data-slot="create-task-name"
            />
            <label htmlFor="startDate">Start Date</label>
            <input
              id="startDate"
              type="date"
              value={startDate.format("YYYY-MM-DD")}
              onChange={(e) => setStartDate(dayjs(e.target.value))}
              required
              data-slot="create-task-start"
            />
            <label htmlFor="endDate">End Date</label>
            <input
              id="endDate"
              type="date"
              value={endDate.format("YYYY-MM-DD")}
              onChange={(e) => setEndDate(dayjs(e.target.value))}
              required
              min={startDate.format("YYYY-MM-DD")}
              data-slot="create-task-end"
            />
            {areaId && <div data-slot="create-task-area">Area ID: {areaId}</div>}
          </div>
          <div data-slot="create-task-actions">
            <button type="button" onClick={handleCancel}>Cancel</button>
            <button type="submit" disabled={isSubmitting || !taskName}>
              {isSubmitting ? "Creating..." : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
