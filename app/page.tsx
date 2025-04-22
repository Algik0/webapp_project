"use client";

import { useState } from "react";

export default function Taskademia() {
  const [tasks, setTasks] = useState<string[]>([]);
  const [newTask, setNewTask] = useState("");

  const addTask = () => {
    if (newTask.trim() !== "") {
      setTasks([...tasks, newTask]);
      setNewTask("");
    }
  };

  const removeTask = (index: number) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen p-8 bg-gray-100 flex flex-col items-center relative">
      {/* Login/Register Buttons */}
      <div className="absolute top-4 right-4 flex gap-2">
        <button className="px-4 py-2 bg-white text-blue-500 border border-blue-500 rounded hover:bg-blue-50">
          Login
        </button>
        <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Registrieren
        </button>
      </div>

      <h1 className="text-4xl font-bold mb-8">Taskademia</h1>

      <div className="w-full max-w-md">
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Neue Aufgabe hinzufügen..."
            className="flex-1 p-2 border border-gray-300 rounded"
          />
          <button
            onClick={addTask}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Hinzufügen
          </button>
        </div>

        <ul className="space-y-2">
          {tasks.map((task, index) => (
            <li
              key={index}
              className="flex justify-between items-center p-2 bg-white border rounded shadow"
            >
              <span>{task}</span>
              <button
                onClick={() => removeTask(index)}
                className="text-red-500 hover:underline"
              >
                Entfernen
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
