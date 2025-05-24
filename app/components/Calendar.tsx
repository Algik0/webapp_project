import { useState, useRef, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Star,
  Trash2,
} from "lucide-react";

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
  tasksByDate: Record<
    string,
    {
      TaskID: number;
      Name: string;
      Checked: boolean;
      Important?: boolean;
      Date: string;
    }[]
  >;
}

export default function Calendar({ tasksByDate }: CalendarProps) {
  const [view, setView] = useState<CalendarView>("week");
  const [current, setCurrent] = useState(new Date());
  const [localTaskState, setLocalTaskState] = useState<
    Record<number, { Checked: boolean; Important?: boolean; deleted?: boolean }>
  >({});
  const [error, setError] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [newTaskName, setNewTaskName] = useState("");

  // Neu: Lokaler State für hinzugefügte Tasks pro Datum
  const [addedTasksByDate, setAddedTasksByDate] = useState<Record<string, any[]>>({});

  // Scroll-Handling für Task-Icons
  const taskRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const [scrollingTasks, setScrollingTasks] = useState<Record<number, boolean>>(
    {}
  );

  useEffect(() => {
    Object.entries(taskRefs.current).forEach(([taskId, el]) => {
      if (!el) return;
      let timeout: any;
      const onScroll = () => {
        setScrollingTasks((prev) => ({ ...prev, [taskId]: true }));
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          setScrollingTasks((prev) => ({ ...prev, [taskId]: false }));
        }, 400);
      };
      el.addEventListener("scroll", onScroll);
      return () => el.removeEventListener("scroll", onScroll);
    });
  }, [tasksByDate, view, current]);

  // Handler für Task-Interaktion
  const handleToggleChecked = async (task: any) => {
    const newChecked = !(localTaskState[task.TaskID]?.Checked ?? task.Checked);
    setLocalTaskState((prev) => ({
      ...prev,
      [task.TaskID]: {
        ...prev[task.TaskID],
        Checked: newChecked,
        Important: prev[task.TaskID]?.Important ?? task.Important,
      },
    }));
    try {
      await fetch("/api/task", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId: task.TaskID, checked: newChecked }),
      });
    } catch {
      setError("Aktion fehlgeschlagen (Check). Bitte später erneut versuchen.");
      setTimeout(() => setError(null), 3000);
    }
  };
  const handleToggleImportant = async (task: any) => {
    const newImportant = !(
      localTaskState[task.TaskID]?.Important ?? task.Important
    );
    setLocalTaskState((prev) => ({
      ...prev,
      [task.TaskID]: {
        ...prev[task.TaskID],
        Checked: prev[task.TaskID]?.Checked ?? task.Checked,
        Important: newImportant,
      },
    }));
    try {
      await fetch("/api/task", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId: task.TaskID, important: newImportant }),
      });
    } catch {
      setError(
        "Aktion fehlgeschlagen (Wichtig). Bitte später erneut versuchen."
      );
      setTimeout(() => setError(null), 3000);
    }
  };
  const handleDeleteTask = async (task: any) => {
    setLocalTaskState((prev) => ({
      ...prev,
      [task.TaskID]: {
        ...prev[task.TaskID],
        deleted: true,
      },
    }));
    try {
      await fetch(`/api/task?taskId=${task.TaskID}`, {
        method: "DELETE",
      });
    } catch {
      setError(
        "Aktion fehlgeschlagen (Löschen). Bitte später erneut versuchen."
      );
      setTimeout(() => setError(null), 3000);
    }
  };
  const handleAddTask = async () => {
    if (!newTaskName.trim() || !selectedDay) return;
    try {
      const response = await fetch("/api/task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newTaskName,
          date: getDateKey(selectedDay), // z.B. "2024-05-26"
        }),
      });
      const createdTask = await response.json();
      setNewTaskName("");

      // Neu: Task lokal für den Tag ergänzen
      setAddedTasksByDate(prev => {
        const key = getDateKey(selectedDay);
        return {
          ...prev,
          [key]: [...(prev[key] || []), createdTask],
        };
      });

      setLocalTaskState(prev => ({
        ...prev,
        [createdTask.TaskID]: {
          Checked: false,
          Important: false,
          deleted: false,
        },
      }));
    } catch {
      setError("Task konnte nicht hinzugefügt werden.");
      setTimeout(() => setError(null), 3000);
    }
  };

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

  // In der Monats- und Wochenansicht: Datumsschlüssel immer als lokales Datum (deutsche Zeitzone) erzeugen
  const getDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getDateKeyFromString = (dateString: string) => dateString.slice(0, 10);
// ergibt "2024-05-26"

  return (
    <div className="calendar-widget">
      {error && (
        <div
          style={{
            background: "#de3163",
            color: "#fff",
            padding: "0.5rem 1rem",
            borderRadius: "0.5rem",
            marginBottom: "1rem",
            textAlign: "center",
          }}
        >
          {error}
        </div>
      )}
      <div className="calendar-header">
        <button onClick={prev}>
          <ChevronLeft />
        </button>
        <span className="calendar-title">
          {view === "week"
            ? `KW ${weekNumber} (${monday.toLocaleDateString()} - ${weekDays[6].toLocaleDateString()})`
            : `${current.toLocaleString("default", {
                month: "long",
              })} ${current.getFullYear()}`}
        </span>
        <button onClick={next}>
          <ChevronRight />
        </button>
        <button
          className="calendar-view-toggle"
          onClick={() => setView(view === "week" ? "month" : "week")}
          title={view === "week" ? "Monatsansicht" : "Wochenansicht"}
        >
          <CalendarIcon />
        </button>
      </div>
      <div className={view === "week" ? "calendar-week" : "calendar-month"}>
        {(view === "week" ? weekDays : monthDays).map((d) => (
          <div
            key={d.toISOString()}
            className="calendar-day"
            onClick={() => setSelectedDay(d)}
            style={{ cursor: "pointer" }}
          >
            <div className="calendar-day-label">
              {view === "week"
                ? d.toLocaleDateString("de-DE", {
                    weekday: "short",
                    day: "2-digit",
                    month: "2-digit",
                  })
                : d.getDate()}
            </div>
            <div className="calendar-tasks">
              {(tasksByDate[getDateKey(d)] || []).map((task) => {
                const deleted = localTaskState[task.TaskID]?.deleted;
                const checked = localTaskState[task.TaskID]?.Checked ?? task.Checked;
                if (deleted) return null;
                return (
                  <div
                    key={task.TaskID}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      color: "#222",
                      fontSize: 16,
                      background: "#fff",
                      padding: "2px 0",
                    }}
                  >
                    <span
                      style={{
                        flex: 1,
                        textDecoration: checked ? "line-through" : "none",
                        color: checked ? "#bbb" : "#222",
                        cursor: "pointer"
                      }}
                      onClick={() => handleToggleChecked(task)}
                      title={checked ? "Als offen markieren" : "Abhaken"}
                    >
                      {task.Name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Modal für ausgewählten Tag */}
      {selectedDay && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setSelectedDay(null)}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 12,
              padding: 32,
              minWidth: 320,
              maxWidth: 400,
              boxShadow: "0 4px 24px rgba(0,0,0,0.15)",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              style={{
                position: "absolute",
                top: 12,
                right: 16,
                background: "none",
                border: "none",
                fontSize: 24,
                cursor: "pointer",
                color: "#de3163",
              }}
              onClick={() => setSelectedDay(null)}
              aria-label="Schließen"
            >
              ×
            </button>
            <h2 style={{ marginBottom: 16, color: "#222" }}>
              {selectedDay.toLocaleDateString("de-DE", {
                weekday: "long",
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </h2>
            <div>
              {(tasksByDate[getDateKey(selectedDay)] || []).length === 0 ? (
                <div style={{ color: "#888" }}>Keine Tasks für diesen Tag.</div>
              ) : (
                (() => {
                  const dateKey = getDateKey(selectedDay);
                  const allTasksForDay = [
                    ...(tasksByDate[dateKey] || []),
                    ...(addedTasksByDate[dateKey] || [])
                  ];
                  return allTasksForDay.map((task, idx) => {
                    // Fallback für fehlende TaskID (z.B. bei neuen Tasks)
                    const key = task.TaskID ?? `temp-${dateKey}-${idx}`;
                    const checked = localTaskState[task.TaskID]?.Checked ?? task.Checked;
                    const important = localTaskState[task.TaskID]?.Important ?? task.Important;
                    const deleted = localTaskState[task.TaskID]?.deleted;
                    if (deleted) return null;
                    return (
                      <div
                        key={key}
                        style={{
                          padding: "8px 0",
                          borderBottom: "1px solid #eee",
                          display: "flex",
                          alignItems: "center",
                          color: "#222",
                          fontSize: 18,
                          background: "#fff"
                        }}
                      >
                        <span
                          style={{
                            flex: 1,
                            textDecoration: checked ? "line-through" : "none",
                            color: checked ? "#bbb" : "#222",
                            cursor: "pointer"
                          }}
                          onClick={() => handleToggleChecked(task)}
                          title={checked ? "Als offen markieren" : "Abhaken"}
                        >
                          {task.Name}
                        </span>
                        <button
                          style={{
                            background: "none",
                            border: "none",
                            color: important ? "#de3163" : "#bbb",
                            marginRight: 8,
                            cursor: "pointer"
                          }}
                          onClick={() => handleToggleImportant(task)}
                          title={important ? "Wichtig entfernen" : "Als wichtig markieren"}
                        >
                          <Star fill={important ? "#de3163" : "none"} stroke="#de3163" width={16} height={16} />
                        </button>
                        <button
                          style={{
                            background: "none",
                            border: "none",
                            color: "#de3163",
                            cursor: "pointer"
                          }}
                          onClick={() => handleDeleteTask(task)}
                          title="Task löschen"
                        >
                          <Trash2 width={16} height={16} />
                        </button>
                      </div>
                    );
                  });
                })()
              )}
            </div>
            <div style={{ marginTop: 16 }}>
              <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                <input
                  type="text"
                  value={newTaskName}
                  onChange={e => setNewTaskName(e.target.value)}
                  placeholder="Neue Aufgabe..."
                  style={{
                    flex: 1,
                    padding: "8px",
                    borderRadius: 6,
                    border: "1px solid #ccc",
                    fontSize: 16
                  }}
                  onKeyDown={e => { if (e.key === "Enter") handleAddTask(); }}
                />
                <button
                  onClick={handleAddTask}
                  style={{
                    padding: "8px 16px",
                    borderRadius: 6,
                    border: "none",
                    background: "#de3163",
                    color: "#fff",
                    fontWeight: 600,
                    cursor: "pointer"
                  }}
                >
                  Hinzufügen
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
