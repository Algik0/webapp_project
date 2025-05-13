"use client";

import { useEffect, useState } from "react";
import "../../styles/important.css";
import BackButton from "../backbutton";

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

  if (loading) return <div className="important-container">Lade...</div>;
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
            {task.Name}
          </li>
        ))}
      </ul>
    </div>
  );
}
