"use client";

import { useEffect, useState } from "react";
import "../../styles/myday.css";
import "../../styles/tasks.css";
import BackButton from "../../components/backButton";
import { Plus, Trash2 } from "lucide-react";
import TaskModal from "../../components/TaskModal";
import { Star } from "lucide-react";

interface Task {
  TaskID: number;
  Name: string;
  Checked: boolean;
  Important?: boolean;
}

export default function MeinTagPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    async function fetchTasks() {
      try {
        const response = await fetch("/api/task?myday=true");
        const data = await response.json();
        if (data.success) {
          setTasks(data.tasks);
        } else {
          setError(data.message || "Fehler beim Laden der Tasks");
        }
      } catch (err) {
        setError("Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.");
      } finally {
        setLoading(false);
      }
    }
    fetchTasks();
  }, []);

  const handleToggleChecked = async (taskId: number, checked: boolean) => {
    try {
      setTasks((prev) =>
        prev.map((task) =>
          task.TaskID === taskId ? { ...task, Checked: !checked } : task
        )
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

  const handleToggleImportant = async (taskId: number, important: boolean | undefined) => {
    try {
      setTasks((prev) =>
        prev.map((task) =>
          task.TaskID === taskId ? { ...task, Important: !important } : task
        )
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

  const handleAddTask = () => {
    setModalOpen(true);
  };

  const handleModalSubmit = async (name: string) => {
    const today = new Date().toISOString().slice(0, 10);
    try {
      const response = await fetch("/api/task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, date: today }),
      });
      const data = await response.json();
      if (data.success && data.task) {
        setTasks((prev) => [...prev, data.task]);
        setModalOpen(false);
      } else {
        alert(data.message || "Fehler beim Hinzufügen der Aufgabe");
      }
    } catch (err) {
      alert("Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.");
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    try {
      const response = await fetch(`/api/task?taskId=${taskId}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (data.success) {
        setTasks((prev) => prev.filter((task) => task.TaskID !== taskId));
      } else {
        alert(data.message || "Fehler beim Löschen der Aufgabe");
      }
    } catch (err) {
      alert("Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.");
    }
  };

  if (loading) return (
    <div className="task-container">
      <div className="task-loading-centered">Lade Aufgaben...</div>
    </div>
  );
  if (error) return <div className="task-container task-error">{error}</div>;

  return (
    <div className="task-container">
      <div className="task-header">
        <BackButton />
        <h1 className="task-title">Mein Tag</h1>
      </div>
      <ul className="task-list">
        {tasks.map((task) => (
          <li
            key={task.TaskID}
            className={`task-list-item${task.Checked ? " task-list-done" : ""}`}
            onClick={() => handleToggleChecked(task.TaskID, task.Checked)}
          >
            <span className="task-list-name">{task.Name}</span>
            <div className="task-actions">
              <button className="task-important" onClick={e => { e.stopPropagation(); handleToggleImportant(task.TaskID, task.Important); }}>
                <Star className="task-important-icon" />
              </button>
              <button className="task-delete" onClick={e => { e.stopPropagation(); handleDeleteTask(task.TaskID); }}>
                <Trash2 className="task-delete-icon" />
              </button>
            </div>
          </li>
        ))}
      </ul>
      <button onClick={handleAddTask} className="task-add-button">
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
