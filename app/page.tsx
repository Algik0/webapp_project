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
    setTasks(tasks.filter((_: string, i: number) => i !== index));
  };

  return (
    <div className="min-h-screen p-8 bg-gray-100 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-8">Taskademia</h1>
      <div className="w-full max-w-md">
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newTask}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTask(e.target.value)}
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
          {tasks.map((task: string, index: number) => (
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
