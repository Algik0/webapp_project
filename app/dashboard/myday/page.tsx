"use client";

import { useEffect, useState } from "react";
import "../../styles/myday.css";
import BackButton from "../backbutton";

interface Task {
  TaskID: number;
  Name: string;
  Checked: boolean;
}

export default function MeinTagPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  if (loading) return <div className="myday-container">Lade...</div>;
  if (error) return <div className="myday-container">{error}</div>;

  return (
    <div className="myday-container">
      <div className="myday-header">
        <BackButton />
        <h1 className="myday-title">Mein Tag</h1>
      </div>
      <ul className="myday-task-list">
        {tasks.map((task) => (
          <li
            key={task.TaskID}
            className={`myday-task-list-item${task.Checked ? " myday-task-list-done" : ""}`}
            onClick={() => handleToggleChecked(task.TaskID, task.Checked)}
            style={{ cursor: "pointer" }}
          >
            {task.Name}
          </li>
        ))}
      </ul>
    </div>
  );
}
