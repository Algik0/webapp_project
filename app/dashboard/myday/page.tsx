// MeinTagPage: Zeigt alle heutigen Tasks des Nutzers, erlaubt Markieren/Löschen/Hinzufügen
// Nutzt TaskModal und TaskListSkeleton für UX
"use client";

import { useState } from "react";
import "../../styles/tasks.css";
import BackButton from "../../components/backButton";
import { Plus, Trash2 } from "lucide-react";
import TaskModal from "../../components/TaskModal";
import { Star } from "lucide-react";
import TaskListSkeleton from "../../components/TaskListSkeleton";
import { useCachedFetch } from "../../components/useCachedFetch";

interface Task {
  TaskID: number;
  Name: string;
  Checked: boolean;
  Important?: boolean;
}

export default function MeinTagPage() {
  // Holt heutige Tasks aus der API (mit Caching)
  const {
    data: tasks,
    loading,
    error,
    refresh,
    setData: setTasks,
  } = useCachedFetch<Task[]>(
    "myday_tasks",
    async () => {
      const response = await fetch("/api/task?myday=true");
      const data = await response.json();
      if (!data.success)
        throw new Error(data.message || "Fehler beim Laden der Tasks");
      return data.tasks;
    },
    { refreshOnFocus: true }
  );

  // Funktion zum Umschalten des "Checked"-Status einer Aufgabe
  const handleToggleChecked = async (taskId: number, checked: boolean) => {
    try {
      setTasks((prev) =>
        prev
          ? prev.map((task) =>
              task.TaskID === taskId ? { ...task, Checked: !checked } : task
            )
          : []
      );
      const response = await fetch("/api/task", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId, checked: !checked }),
      });
      const data = await response.json();
      if (!data.success) {
        alert(data.message || "Fehler beim Aktualisieren des Tasks");
        // Optional: Task wieder zurücksetzen
      }
    } catch (err) {
      alert("Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.");
      // Optional: Task wieder zurücksetzen
    }
  };

  // Funktion zum Umschalten des "Important"-Status einer Aufgabe
  const handleToggleImportant = async (
    taskId: number,
    important: boolean | undefined
  ) => {
    try {
      setTasks((prev) =>
        prev
          ? prev.map((task) =>
              task.TaskID === taskId ? { ...task, Important: !important } : task
            )
          : []
      );
      const response = await fetch("/api/task", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId, important: !important }),
      });
      const data = await response.json();
      if (!data.success) {
        alert(data.message || "Fehler beim Aktualisieren des Tasks");
      }
    } catch (err) {
      alert("Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.");
    }
  };

  // Öffnet das Modal zum Hinzufügen einer neuen Aufgabe
  const handleAddTask = () => {
    setModalOpen(true);
  };

  const [modalOpen, setModalOpen] = useState(false);

  // Funktion zum Absenden des neuen Tasks über das Modal
  const handleModalSubmit = async (name: string, _date?: string, categoryId?: number) => {
    // Lokales Datum (nicht UTC!)
    const today = new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 10);
    try {
      const response = await fetch("/api/task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, date: today, categoryId }),
      });
      const data = await response.json();
      if (data.success && data.task) {
        setTasks((prev) => (prev ? [...prev, data.task] : [data.task]));
        setModalOpen(false);
      } else {
        alert(data.message || "Fehler beim Hinzufügen der Aufgabe");
      }
    } catch (err) {
      alert("Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.");
    }
  };

  // Funktion zum Löschen einer Aufgabe
  const handleDeleteTask = async (taskId: number) => {
    try {
      const response = await fetch(`/api/task?taskId=${taskId}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (data.success) {
        setTasks((prev) =>
          prev ? prev.filter((task) => task.TaskID !== taskId) : []
        );
      } else {
        alert(data.message || "Fehler beim Löschen der Aufgabe");
      }
    } catch (err) {
      alert("Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.");
    }
  };

  // Laden-Skelett anzeigen, während die Daten geladen werden
  if (loading) return <TaskListSkeleton />;
  // Fehleranzeige, falls beim Laden ein Fehler aufgetreten ist
  if (error) return <div className="task-container task-error">{error}</div>;

  return (
    <div className="shared-container">
      <div className="shared-header">
        <BackButton />
        <h1 className="shared-title">Mein Tag</h1>
      </div>
      <ul className="shared-list">
        {(tasks || []).map((task) => (
          <li
            key={task.TaskID}
            className={`shared-list-item${task.Checked ? " shared-list-done" : ""}`}
            onClick={() => handleToggleChecked(task.TaskID, task.Checked)}
          >
            <span className="shared-list-name">{task.Name}</span>
            <div className="shared-actions">
              <button
                className="shared-important"
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleImportant(task.TaskID, task.Important);
                }}
              >
                <Star
                  className="shared-important-icon"
                  fill={task.Important ? "#de3163" : "none"}
                  stroke="#de3163"
                  width={16}
                  height={16}
                />
              </button>
              <button
                className="shared-delete"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteTask(task.TaskID);
                }}
              >
                <Trash2 className="shared-delete-icon" width={16} height={16} />
              </button>
            </div>
          </li>
        ))}
      </ul>
      <button onClick={handleAddTask} className="shared-add-button">
        <Plus className="myday-add-icon" /> Hinzufügen
      </button>
      <TaskModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
        title="Task für Mein Tag hinzufügen"
        hideDateField
      />
    </div>
  );
}
