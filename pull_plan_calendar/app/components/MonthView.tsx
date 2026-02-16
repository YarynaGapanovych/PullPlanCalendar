"use client";
import { Button } from "@/app/components/ui/Button";
import { ChevronLeftIcon } from "@/app/components/ui/icons/ChevronLeft";
import { ChevronRightIcon } from "@/app/components/ui/icons/ChevronRight";
import { EyeIcon } from "@/app/components/ui/icons/Eye";
import { Title } from "@/app/components/ui/Title";
import dayjs, { Dayjs } from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import minMax from "dayjs/plugin/minMax";
import { useMemo, useState } from "react";
import { Task } from "@/app/types/task";
import CreateTaskModal from "./tasks/CreateTaskModal";
import { Week } from "./Week";

dayjs.extend(isBetween);
dayjs.extend(minMax);

interface MonthViewProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  setStartDate: (date: Dayjs) => void;
  setZoomLevel: (zoom: "year" | "week") => void;
}

function MonthView({
  tasks,
  setTasks,
  setStartDate,
  setZoomLevel,
}: MonthViewProps) {
  const [currentMonth, setCurrentMonth] = useState(dayjs().month());
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModalWithDate = (date: Dayjs) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  const generateCalendarData = () => {
    const year = dayjs().year();
    const startDate = dayjs(`${year}-01-01`);
    const weeks: Dayjs[][] = [];
    let currentWeek: Dayjs[] = [];
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
  const calendarData = useMemo(() => generateCalendarData(), []);

  const getTasksForWeek = (week: Dayjs[]) => {
    return tasks.filter((task) => {
      const start = dayjs(task.startDate);
      const end = dayjs(task.endDate);
      return week.some((day) => day.isBetween(start, end, undefined, "[]"));
    });
  };

  const handlePreviousMonth = () => {
    setCurrentMonth((prev) => (prev - 1 + 12) % 12);
  };

  const handleNextMonth = () => {
    setCurrentMonth((prev) => (prev + 1) % 12);
  };

  return (
    <>
      <div className="flex justify-between mt-4">
        <Button type="text" onClick={handlePreviousMonth}>
          <ChevronLeftIcon />
        </Button>
        <Title level={4}>
          {dayjs(`${dayjs().year()}-${currentMonth + 1}-01`).format("MMMM")}
        </Title>
        <Button type="text" onClick={handleNextMonth}>
          <ChevronRightIcon />
        </Button>
      </div>
      <div className="container mx-auto px-4 mt-6">
        <div className="gap-6 grid grid-cols-1">
          <div className="bg-white rounded-lg shadow-lg p-4">
            <div className="grid grid-cols-7 gap-1 text-center font-semibold text-gray-600 border-b border-gray-200 pb-2 mb-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="p-1">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 gap-2">
              {calendarData
                .filter((week) =>
                  week.some((day) => day.month() === currentMonth),
                )
                .map((week, weekIndex) => (
                  <div
                    key={weekIndex}
                    className="hover:border border-gray-100 rounded-lg p-2 hover:scale-105 transition-all relative group"
                  >
                    <div
                      className="cursor-pointer absolute -right-6 top-0 h-full flex items-center p-0 bg-gray-100 ring-1 ring-gray-200 rounded-r-md opacity-0 group-hover:opacity-100 group-hover:-right-6 transition-all"
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
                      currentMonth={currentMonth}
                      isMonthView
                    />
                  </div>
                ))}
            </div>
          </div>
        </div>
        <CreateTaskModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
    </>
  );
}

export default MonthView;
