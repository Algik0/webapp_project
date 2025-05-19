"use client";

import { useEffect, useState } from "react";
import "../../styles/important.css";
import BackButton from "../backbutton";
import { Plus, Trash2 } from "lucide-react";
import TaskModal from "../../components/TaskModal";

interface Task {
  TaskID: number;
  Name: string;
  Checked: boolean;
  Important: boolean;
}

export default function WichtigPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    async function fetchTasks() {
      try {
        const response = await fetch("/api/task?important=true");
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

  const handleAddTask = () => {
    setModalOpen(true);
  };

  const handleModalSubmit = async (name: string, date: string) => {
    try {
      const response = await fetch("/api/task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, important: true, date }),
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
    <div className="important-container">
      <div className="important-loading-centered">Lade Aufgaben...</div>
    </div>
  );
  if (error) return <div className="important-container">{error}</div>;

  return (
    <div className="important-container">
      <div className="important-header">
        <BackButton />
        <h1 className="important-title">Wichtig</h1>
      </div>
      <ul className="important-task-list">
        {tasks.map((task) => (
          <li
            key={task.TaskID}
            className={`important-task-list-item${task.Checked ? " important-task-list-done" : ""}`}
            onClick={() => handleToggleChecked(task.TaskID, task.Checked)}
            style={{ cursor: "pointer", fontWeight: task.Important ? "bold" : "normal" }}
          >
            <span>{task.Name}</span>
            <button className="important-task-delete" onClick={e => { e.stopPropagation(); handleDeleteTask(task.TaskID); }}>
              <Trash2 className="important-task-delete-icon" />
            </button>
          </li>
        ))}
      </ul>
      <button onClick={handleAddTask} className="important-add-button">
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
