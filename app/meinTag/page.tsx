"use client";

import { useState } from "react";
import BackButton from "../components/backButton";
import { Star, Trash2 } from "lucide-react";
import type { Task } from "../types";

export default function MeinTagPage() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      taskID: 1,
      categoryID: 1, // Beispiel
      name: "Mathe Übungsblatt abgeben",
      date: "2025-05-06",
      checked: false,
      important: false,
    },
    {
      taskID: 2,
      categoryID: 1,
      name: "Projektmeeting um 14:00",
      date: "2025-05-06",
      checked: false,
      important: true,
    },
  ]);

  const toggleChecked = (id: number) => {
    setTasks(tasks.map(task =>
      task.taskID === id ? { ...task, checked: !task.checked } : task
    ));
  };

  const toggleImportant = (task: Task) => {
    setTasks(tasks.map(t =>
      t.taskID === task.taskID ? { ...t, important: !t.important } : t
    ));
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.taskID !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="flex items-center justify-between mb-6">
        <BackButton />
        <h1 className="text-3xl font-bold text-center flex-1 -ml-6">📅 Mein Tag</h1>
        <div className="w-6" />
      </div>

      <div className="bg-white shadow-md rounded-lg p-6 space-y-4">
        {tasks.map(task => (
          <div key={task.taskID} className="flex justify-between items-center">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={task.checked}
                onChange={() => toggleChecked(task.taskID)}
                className="h-5 w-5"
              />
              <span className={`text-lg ${task.checked ? "line-through text-gray-400" : ""}`}>
                {task.name}
              </span>
            </label>
            <div className="flex gap-3 items-center">
              <button onClick={() => toggleImportant(task)}>
                {task.important ? (
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                ) : (
                  <Star className="w-5 h-5 text-yellow-500" />
                )}
              </button>
              <button onClick={() => deleteTask(task.taskID)}>
                <Trash2 className="w-5 h-5 text-gray-600 hover:text-red-600" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
