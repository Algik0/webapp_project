import { useState } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";

function getMonday(d: Date) {
  const date = new Date(d);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(date.setDate(diff));
}

function getWeekNumber(d: Date) {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  return Math.ceil((((date as any) - (yearStart as any)) / 86400000 + 1) / 7);
}

export type CalendarView = "week" | "month";

export interface CalendarProps {
  tasksByDate: Record<string, { TaskID: number; Name: string; Checked: boolean; Important?: boolean; Date: string }[]>;
}

export default function Calendar({ tasksByDate }: CalendarProps) {
  const [view, setView] = useState<CalendarView>("week");
  const [current, setCurrent] = useState(new Date());

  // Woche berechnen
  const monday = getMonday(current);
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });

  // Monat berechnen
  const firstDay = new Date(current.getFullYear(), current.getMonth(), 1);
  const lastDay = new Date(current.getFullYear(), current.getMonth() + 1, 0);
  const monthDays = Array.from({ length: lastDay.getDate() }, (_, i) => {
    const d = new Date(firstDay);
    d.setDate(i + 1);
    return d;
  });

  // Navigation
  const prev = () => {
    if (view === "week") {
      const d = new Date(current);
      d.setDate(d.getDate() - 7);
      setCurrent(d);
    } else {
      setCurrent(new Date(current.getFullYear(), current.getMonth() - 1, 1));
    }
  };
  const next = () => {
    if (view === "week") {
      const d = new Date(current);
      d.setDate(d.getDate() + 7);
      setCurrent(d);
    } else {
      setCurrent(new Date(current.getFullYear(), current.getMonth() + 1, 1));
    }
  };

  // Kalenderwoche
  const weekNumber = getWeekNumber(monday);

  return (
    <div className="calendar-widget">
      <div className="calendar-header">
        <button onClick={prev}><ChevronLeft /></button>
        <span className="calendar-title">
          {view === "week"
            ? `KW ${weekNumber} (${monday.toLocaleDateString()} - ${weekDays[6].toLocaleDateString()})`
            : `${current.toLocaleString("default", { month: "long" })} ${current.getFullYear()}`}
        </span>
        <button onClick={next}><ChevronRight /></button>
        <button className="calendar-view-toggle" onClick={() => setView(view === "week" ? "month" : "week")}
          title={view === "week" ? "Monatsansicht" : "Wochenansicht"}>
          <CalendarIcon />
        </button>
      </div>
      <div className={view === "week" ? "calendar-week" : "calendar-month"}>
        {view === "week"
          ? weekDays.map((d) => (
              <div key={d.toISOString()} className="calendar-day">
                <div className="calendar-day-label">{d.toLocaleDateString("de-DE", { weekday: "short", day: "2-digit", month: "2-digit" })}</div>
                <div className="calendar-tasks">
                  {(tasksByDate[d.toISOString().slice(0, 10)] || []).map((task) => (
                    <div key={task.TaskID} className={`calendar-task${task.Checked ? " calendar-task-done" : ""}`}>{task.Name}</div>
                  ))}
                </div>
              </div>
            ))
          : monthDays.map((d) => (
              <div key={d.toISOString()} className="calendar-day">
                <div className="calendar-day-label">{d.getDate()}</div>
                <div className="calendar-tasks">
                  {(tasksByDate[d.toISOString().slice(0, 10)] || []).map((task) => (
                    <div key={task.TaskID} className={`calendar-task${task.Checked ? " calendar-task-done" : ""}`}>{task.Name}</div>
                  ))}
                </div>
              </div>
            ))}
      </div>
    </div>
  );
}
