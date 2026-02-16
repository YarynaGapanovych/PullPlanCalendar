"use client";
import { Button } from "@/app/components/ui/Button";
import { Title } from "@/app/components/ui/Title";
import { ChevronLeftIcon } from "@/app/components/ui/icons/ChevronLeft";
import { ChevronRightIcon } from "@/app/components/ui/icons/ChevronRight";
import { EyeIcon } from "@/app/components/ui/icons/Eye";
import dayjs, { Dayjs } from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import minMax from "dayjs/plugin/minMax";
import { useMemo, useState } from "react";

import { Task } from "@/app/types/task";
import CreateTaskModal from "./tasks/CreateTaskModal";
import { Week } from "./Week";

dayjs.extend(isBetween);
dayjs.extend(minMax);

interface YearViewProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  setStartDate: (date: Dayjs) => void;
  setZoomLevel: (zoom: "year" | "week") => void;
}

function YearView({
  tasks,
  setTasks,
  setStartDate,
  setZoomLevel,
}: YearViewProps) {
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentYear, setCurrentYear] = useState(dayjs().year());

  const openModalWithDate = (date: Dayjs) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  const generateCalendarData = () => {
    const year = dayjs().year(); // Get the current year
    const startDate = dayjs(`${year}-01-01`); // Start of the year
    const weeks: Dayjs[][] = []; // Store weeks
    let currentWeek: Dayjs[] = []; // Temporary array to hold days of the current week
    let currentDate = startDate.clone(); // Clone start date to work with

    // Loop through each day of the year
    while (currentDate.year() === year) {
      currentWeek.push(currentDate.clone()); // Add current day to the current week

      // When the current day is Sunday (the start of a new week)
      if (currentDate.day() === 6) {
        weeks.push(currentWeek); // Add the current week to the weeks array
        currentWeek = []; // Reset the current week array for the next week
      }

      currentDate = currentDate.add(1, "day"); // Move to the next day
    }

    // Push the remaining days if there is an incomplete week at the end of the year
    if (currentWeek.length) {
      weeks.push(currentWeek);
    }

    return weeks; // Return the array of weeks
  };

  const calendarData = useMemo(() => generateCalendarData(), []);

  const getTasksForWeek = (week: Dayjs[]) => {
    return tasks.filter((task) => {
      const start = dayjs(task.startDate);
      const end = dayjs(task.endDate);
      return (
        week.some((day) => day.isBetween(start, end, undefined, "[]")) &&
        (start.year() === currentYear || end.year() === currentYear)
      );
    });
  };

  const handlePreviousYear = () => {
    setCurrentYear((prev) => prev - 1);
  };

  const handleNextYear = () => {
    setCurrentYear((prev) => prev + 1);
  };

  return (
    <>
      <div className="flex justify-between mt-4">
        <Button type="text" onClick={handlePreviousYear}>
          <ChevronLeftIcon />
        </Button>
        <Title level={4}>{currentYear}</Title>
        <Button type="text" onClick={handleNextYear}>
          <ChevronRightIcon />
        </Button>
      </div>
      <div className="container mx-auto px-4 mt-6">
        <div className="gap-6 grid md:grid-cols-2">
          {[...Array(12)].map((_, monthIndex) => (
            <div key={monthIndex} className="bg-white rounded-lg shadow-lg p-4">
              <Title level={4}>
                {dayjs(`${currentYear}-${monthIndex + 1}-01`).format("MMMM")}
              </Title>
              <div className="grid grid-cols-7 gap-1 text-center font-semibold text-gray-600">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                  (day) => (
                    <div key={day} className="p-1">
                      {day}
                    </div>
                  ),
                )}
              </div>
              <div className="grid grid-cols-1 gap-2">
                {calendarData
                  .filter(
                    (week) => week.some((day) => day.month() === monthIndex), // Include if any day is in the month
                  )
                  .map((week, weekIndex) => (
                    <div
                      key={weekIndex}
                      className="hover:border border-gray-100 rounded-lg p-2 hover:scale-105 transition-all relative group"
                    >
                      <div
                        className="cursor-pointer absolute right-[-28px] top-0 h-full flex items-center p-0 bg-gray-100 ring-1 ring-gray-200 rounded-r-md opacity-0 group-hover:opacity-100 group-hover:right-[-30px] transition-all"
                        onClick={() => {
                          setStartDate(week[0]);
                          setZoomLevel("week");
                          openModalWithDate(week[0]);
                        }}
                      >
                        <EyeIcon className="text-[#d18f60] px-1" />
                      </div>
                      <Week
                        days={week}
                        tasks={getTasksForWeek(week)}
                        onSelectDate={openModalWithDate}
                        currentMonth={monthIndex}
                      />
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
        <CreateTaskModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
    </>
  );
}

export default YearView;
