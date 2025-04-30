"use client";

import { useState } from "react";
import BackButton from "../backbutton";
import "../../styles/dashboard.css";


export default function WichtigPage() {
  const [tasks, setTasks] = useState([
    { id: 1, text: "Abgabe der Hausarbeit", done: false },
    { id: 2, text: "Vorbereitung auf Präsentation", done: false },
    { id: 3, text: "Bewerbung abschicken", done: false },
  ]);

  const toggleTask = (id: number) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, done: !task.done } : task
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 relative">
      <div className="absolute top-4 right-4">
        <BackButton />
      </div>
      <div className="flex flex-col items-center">
        <div className="w-full max-w-2xl">
          <h1 className="text-3xl font-bold mb-6">⭐ Wichtig</h1>
          <div className="bg-white shadow-md rounded-lg p-6 space-y-4">
            {tasks.map(task => (
              <div key={task.id} className="flex items-center justify-between">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={task.done}
                    onChange={() => toggleTask(task.id)}
                    className="h-5 w-5 text-yellow-500 rounded focus:ring-0 border-gray-300"
                  />
                  <span className={`text-lg ${task.done ? "line-through text-gray-400" : ""}`}>
                    {task.text}
                  </span>
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
