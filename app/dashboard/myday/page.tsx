"use client";

import { useState } from "react";
import "../../styles/myday.css";

export default function MeinTagPage() {
  const [tasks, setTasks] = useState([
    { id: 1, text: "Mathe Übungsblatt abgeben", done: false },
    { id: 2, text: "Projektmeeting um 14:00", done: false },
    { id: 3, text: "Einkaufen", done: false },
  ]);

  const toggleTask = (id: number) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task
      )
    );
  };

  return (
    <div className="myday-container">
      <h1 className="myday-title">Mein Tag</h1>
      <ul className="myday-task-list">
        {tasks.map((task) => (
          <li
            key={task.id}
            className={`myday-task-item ${task.done ? "myday-task-done" : ""}`}
            onClick={() => toggleTask(task.id)}
          >
            {task.text}
          </li>
        ))}
      </ul>
    </div>
  );
}
