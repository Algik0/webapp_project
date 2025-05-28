// WichtigPage: Zeigt alle wichtigen Tasks des Nutzers, erlaubt Markieren/Löschen/Hinzufügen
// Nutzt TaskModal und TaskListSkeleton für UX
"use client";

import { useEffect, useState } from "react";
import "../../styles/tasks.css";
import BackButton from "../../components/backButton";
import { Plus, Trash2 } from "lucide-react";
import TaskModal from "../../components/TaskModal";
import { Star } from "lucide-react";
import TaskListSkeleton from "../../components/TaskListSkeleton";
import { useCachedFetch } from "../../components/useCachedFetch";
import { Folder } from "lucide-react";

interface Task {
  TaskID: number;
  Name: string;
  Checked: boolean;
  Important: boolean;
  CategoryID?: number;
}

export default function WichtigPage() {
  const [modalOpen, setModalOpen] = useState(false); // Modal für neuen Task
  const [categoryDropdownTask, setCategoryDropdownTask] = useState<number | undefined>(undefined);

  // Holt wichtige Tasks aus der API (mit Caching)
  const {
    data: tasks,
    loading,
    error,
    refresh,
    setData: setTasks,
  } = useCachedFetch<Task[]>(
    "important_tasks",
    async () => {
      const response = await fetch("/api/task?important=true");
      const data = await response.json();
      if (!data.success)
        throw new Error(data.message || "Fehler beim Laden der Tasks");
      return data.tasks;
    },
    { refreshOnFocus: true }
  );

  const { data: categories } = useCachedFetch<{ id: number; name: string }[]>(
    "categories",
    async () => {
      const res = await fetch("/api/category");
      const data = await res.json();
      if (!data.success) return [];
      return data.categories.map((cat: any) => ({ id: cat.CategoryID, name: cat.Name }));
    }
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

  // Funktion zum Umschalten der Wichtigkeit einer Aufgabe
  const handleToggleImportant = async (taskId: number, important: boolean) => {
    try {
      if (important) {
        setTasks((prev) =>
          prev ? prev.filter((task) => task.TaskID !== taskId) : []
        );
      } else {
        setTasks((prev) =>
          prev
            ? prev.map((task) =>
                task.TaskID === taskId
                  ? { ...task, Important: !important }
                  : task
              )
            : []
        );
      }
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

  // Öffnet das Modal zum Hinzufügen eines neuen Tasks
  const handleAddTask = () => {
    setModalOpen(true);
  };

  // Funktion zum Hinzufügen eines neuen Tasks über das Modal
  const handleModalSubmit = async (name: string, date?: string, categoryId?: number) => {
    try {
      const response = await fetch("/api/task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, important: true, date, categoryId }),
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

  // Ladeanzeige während der Datenbeschaffung
  if (loading) return <TaskListSkeleton />;
  // Fehleranzeige bei Fehlern
  if (error) return <div className="task-container task-error">{error}</div>;

  return (
    <div className="shared-container">
      <div className="shared-header">
        <BackButton />
        <h1 className="shared-title">Wichtig</h1>
      </div>
      <ul className="shared-list">
        {(tasks || []).map((task) => (
          <li
            key={task.TaskID}
            className={`shared-list-item${task.Checked ? " shared-list-done" : ""}`}
            onClick={() => handleToggleChecked(task.TaskID, task.Checked)}
            style={{ fontWeight: task.Important ? "bold" : "normal" }}
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
              {/* Kategorie-Icon */}
              <button
                className="shared-category"
                title="Kategorie ändern"
                onClick={e => {
                  e.stopPropagation();
                  setCategoryDropdownTask(task.TaskID);
                }}
              >
                <Folder className="shared-important-icon" stroke="#222" width={16} height={16} />
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
            {/* Kategorie-Dropdown für diesen Task */}
            {categoryDropdownTask === task.TaskID && (
              <select
                className="modal-input"
                style={{ position: "absolute", right: 40, top: 30, zIndex: 10, minWidth: 120 }}
                value={task.CategoryID ?? ""}
                onChange={async e => {
                  setCategoryDropdownTask(undefined);
                  const newCategoryId = e.target.value ? Number(e.target.value) : null;
                  await fetch("/api/task", {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ taskId: task.TaskID, categoryId: newCategoryId }),
                  });
                  setTasks(prev => prev ? prev.map(t => t.TaskID === task.TaskID ? { ...t, CategoryID: newCategoryId ?? undefined } : t) : prev);
                }}
                onBlur={() => setCategoryDropdownTask(undefined)}
              >
                <option value="">Keine Kategorie</option>
                {categories && categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            )}
          </li>
        ))}
      </ul>
      <button onClick={handleAddTask} className="shared-add-button">
        <Plus className="important-add-icon" /> Hinzufügen
      </button>
      <TaskModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
        title="Wichtigen Task hinzufügen"
      />
    </div>
  );
}
