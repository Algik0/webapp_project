"use client";

import { useState } from "react";
import BackButton from "../components/backButton";
import { Star, Trash2 } from "lucide-react";
import type { Task } from "../types";

export default function WichtigPage() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      taskID: 101,
      categoryID: 4,
      name: "Hausarbeit finalisieren",
      date: "2025-05-08",
      checked: false,
      important: true,
    },
    {
      taskID: 102,
      categoryID: 4,
      name: "Portfolio aktualisieren",
      date: "2025-05-09",
      checked: true,
      important: true,
    },
  ]);

  const toggleChecked = (id: number) => {
    setTasks(tasks.map(task =>
      task.taskID === id ? { ...task, checked: !task.checked } : task
    ));
  };

  const removeTask = (id: number) => {
    setTasks(tasks.filter(task => task.taskID !== id));
  };

  const unmarkImportant = (task: Task) => {
    setTasks(tasks.map(t =>
      t.taskID === task.taskID ? { ...t, important: false } : t
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="flex items-center justify-between mb-6">
        <BackButton />
        <h1 className="text-3xl font-bold text-center flex-1 -ml-6">⭐ Wichtig</h1>
        <div className="w-6" />
      </div>

      <div className="bg-white shadow-md rounded-lg p-6 space-y-4">
        {tasks.filter(task => task.important).length === 0 ? (
          <p className="text-gray-500">Keine wichtigen Aufgaben vorhanden.</p>
        ) : (
          tasks.filter(task => task.important).map(task => (
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
                <button onClick={() => unmarkImportant(task)}>
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                </button>
                <button onClick={() => removeTask(task.taskID)}>
                  <Trash2 className="w-5 h-5 text-gray-600 hover:text-red-600" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
