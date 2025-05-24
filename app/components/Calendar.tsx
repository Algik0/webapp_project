// Kalender-Komponente: Zeigt Aufgaben im Wochen- oder Monatsüberblick
// Enthält Navigation, Task-Interaktion und lokale UI-Logik
import { useState, useRef, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Star,
  Trash2,
} from "lucide-react";

// Hilfsfunktion: Erster Tag der Woche (Montag)
function getMonday(d: Date) {
  const date = new Date(d);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(date.setDate(diff));
}

// Hilfsfunktion: Kalenderwoche berechnen
function getWeekNumber(d: Date) {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  return Math.ceil((((date as any) - (yearStart as any)) / 86400000 + 1) / 7);
}

export type CalendarView = "week" | "month";

export interface CalendarProps {
  // Aufgaben gruppiert nach Datum
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
  const [view, setView] = useState<CalendarView>("week"); // Ansicht: Woche/Monat
  const [current, setCurrent] = useState(new Date()); // Aktuelles Datum
  const [localTaskState, setLocalTaskState] = useState<
    Record<number, { Checked: boolean; Important?: boolean; deleted?: boolean }>
  >({}); // Lokaler Zustand für Tasks (z.B. checked, wichtig, gelöscht)
  const [error, setError] = useState<string | null>(null); // Fehleranzeige

  // Scroll-Handling für Task-Icons (Animationen)
  const taskRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const [scrollingTasks, setScrollingTasks] = useState<Record<number, boolean>>(
    {}
  );

  useEffect(() => {
    // Fügt Scroll-Listener zu jedem Task hinzu
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

  // Handler für Task-Checkbox (erledigt/unerledigt)
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
  // Handler für Task-Wichtigkeit (Stern)
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
  // Handler für Task-Löschen
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

  // Woche berechnen (Mo-So)
  const monday = getMonday(current);
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });

  // Monat berechnen (alle Tage)
  const firstDay = new Date(current.getFullYear(), current.getMonth(), 1);
  const lastDay = new Date(current.getFullYear(), current.getMonth() + 1, 0);
  const monthDays = Array.from({ length: lastDay.getDate() }, (_, i) => {
    const d = new Date(firstDay);
    d.setDate(i + 1);
    return d;
  });

  // Navigation: Vor/Zurück (Woche/Monat)
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

  // Kalenderwoche für Anzeige
  const weekNumber = getWeekNumber(monday);

  // Hilfsfunktion: Datumsschlüssel für Aufgaben (lokale Zeitzone)
  const getDateKey = (date: Date) => {
    // Lokale Zeit, aber mit expliziter Zeitzone für Deutschland
    const tzDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    const year = tzDate.getFullYear();
    const month = (tzDate.getMonth() + 1).toString().padStart(2, "0");
    const day = tzDate.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Render: Kalender-Widget mit Aufgaben, Navigation und Fehleranzeige
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
        {view === "week"
          ? weekDays.map((d) => (
              <div key={d.toISOString()} className="calendar-day">
                <div className="calendar-day-label">
                  {d.toLocaleDateString("de-DE", {
                    weekday: "short",
                    day: "2-digit",
                    month: "2-digit",
                  })}
                </div>
                <div className="calendar-tasks">
                  {(tasksByDate[getDateKey(d)] || []).map((task) => {
                    const checked =
                      localTaskState[task.TaskID]?.Checked ?? task.Checked;
                    const important =
                      localTaskState[task.TaskID]?.Important ?? task.Important;
                    const deleted = localTaskState[task.TaskID]?.deleted;
                    if (deleted) return null;
                    return (
                      <div
                        key={task.TaskID}
                        ref={(el) => {
                          taskRefs.current[task.TaskID] = el;
                        }}
                        className={`calendar-task${
                          checked ? " calendar-task-done" : ""
                        }${scrollingTasks[task.TaskID] ? " scrolling" : ""}`}
                        onClick={() => handleToggleChecked(task)}
                        style={{ display: "flex", alignItems: "center" }}
                      >
                        <span style={{ flex: 1 }}>{task.Name}</span>
                        <span
                          className="calendar-task-actions"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0,
                          }}
                        >
                          <button
                            className="calendar-task-star"
                            style={{
                              background: "none",
                              border: "none",
                              color: important ? "#de3163" : "#bbb",
                              margin: 0,
                              cursor: "pointer",
                              padding: 0,
                              width: 22,
                              height: 22,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleImportant(task);
                            }}
                            title={
                              important
                                ? "Wichtig entfernen"
                                : "Als wichtig markieren"
                            }
                          >
                            <Star
                              fill={important ? "#de3163" : "none"}
                              stroke="#de3163"
                              width={16}
                              height={16}
                            />
                          </button>
                          <button
                            className="calendar-task-delete"
                            style={{
                              background: "none",
                              border: "none",
                              color: "#de3163",
                              margin: 0,
                              cursor: "pointer",
                              padding: 0,
                              width: 22,
                              height: 22,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteTask(task);
                            }}
                            title="Task löschen"
                          >
                            <Trash2 width={16} height={16} />
                          </button>
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          : monthDays.map((d) => (
              <div key={d.toISOString()} className="calendar-day">
                <div className="calendar-day-label">{d.getDate()}</div>
                <div className="calendar-tasks">
                  {(tasksByDate[getDateKey(d)] || []).map((task) => {
                    const checked =
                      localTaskState[task.TaskID]?.Checked ?? task.Checked;
                    const important =
                      localTaskState[task.TaskID]?.Important ?? task.Important;
                    const deleted = localTaskState[task.TaskID]?.deleted;
                    if (deleted) return null;
                    return (
                      <div
                        key={task.TaskID}
                        ref={(el) => {
                          taskRefs.current[task.TaskID] = el;
                        }}
                        className={`calendar-task${
                          checked ? " calendar-task-done" : ""
                        }${scrollingTasks[task.TaskID] ? " scrolling" : ""}`}
                        onClick={() => handleToggleChecked(task)}
                        style={{ display: "flex", alignItems: "center" }}
                      >
                        <span style={{ flex: 1 }}>{task.Name}</span>
                        <span
                          className="calendar-task-actions"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0,
                          }}
                        >
                          <button
                            className="calendar-task-star"
                            style={{
                              background: "none",
                              border: "none",
                              color: important ? "#de3163" : "#bbb",
                              margin: 0,
                              cursor: "pointer",
                              padding: 0,
                              width: 22,
                              height: 22,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleImportant(task);
                            }}
                            title={
                              important
                                ? "Wichtig entfernen"
                                : "Als wichtig markieren"
                            }
                          >
                            <Star
                              fill={important ? "#de3163" : "none"}
                              stroke="#de3163"
                              width={16}
                              height={16}
                            />
                          </button>
                          <button
                            className="calendar-task-delete"
                            style={{
                              background: "none",
                              border: "none",
                              color: "#de3163",
                              margin: 0,
                              cursor: "pointer",
                              padding: 0,
                              width: 22,
                              height: 22,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteTask(task);
                            }}
                            title="Task löschen"
                          >
                            <Trash2 width={16} height={16} />
                          </button>
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
      </div>
    </div>
  );
}
