"use client";

import { useState } from "react";
import "../../styles/important.css";

export default function WichtigPage() {
  const [tasks, setTasks] = useState([
    { id: 1, text: "Abgabe der Hausarbeit", done: false },
    { id: 2, text: "Vorbereitung auf Präsentation", done: false },
    { id: 3, text: "Bewerbung abschicken", done: false },
  ]);

  const toggleTask = (id: number) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task
      )
    );
  };

  return (
    <div className="important-container">
      <h1 className="important-title">Wichtig</h1>
      <ul className="important-task-list">
        {tasks.map((task) => (
          <li
            key={task.id}
            className={`important-task-item ${
              task.done ? "important-task-done" : ""
            }`}
            onClick={() => toggleTask(task.id)}
          >
            {task.text}
          </li>
        ))}
      </ul>
    </div>
  );
}
