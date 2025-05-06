"use client";

import { useState } from "react";
import { Trash2, Plus, Star } from "lucide-react";
import BackButton from "../components/backButton";
import type { Task, Category } from "../types";

export default function KategorisierungPage() {
  const [categories, setCategories] = useState<Category[]>([
    { categoryID: 1, userID: 1, name: "Abgaben" },
    { categoryID: 2, userID: 1, name: "Hausaufgaben" },
  ]);

  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  const [tasks, setTasks] = useState<Task[]>([
    {
      taskID: 1,
      categoryID: 1,
      name: "Aufgabe 1",
      date: "2025-05-06",
      checked: false,
      important: false,
    },
  ]);

  const toggleChecked = (id: number) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.taskID === id ? { ...t, checked: !t.checked } : t
      )
    );
  };

  const toggleImportant = (task: Task) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.taskID === task.taskID ? { ...t, important: !t.important } : t
      )
    );
  };

  const deleteTask = (id: number) => {
    setTasks((prev) => prev.filter((t) => t.taskID !== id));
  };

  const addTask = (name: string) => {
    if (!name.trim() || selectedCategory === null) return;

    const newTask: Task = {
      taskID: Date.now(),
      categoryID: selectedCategory,
      name: name.trim(),
      date: new Date().toISOString().split("T")[0],
      checked: false,
      important: false,
    };
    setTasks((prev) => [...prev, newTask]);
  };

  const deleteCategory = (id: number) => {
    setCategories((prev) => prev.filter((c) => c.categoryID !== id));
    setTasks((prev) => prev.filter((t) => t.categoryID !== id));
    if (selectedCategory === id) setSelectedCategory(null);
  };

  return (
    <div className="min-h-screen pb-20 bg-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <BackButton />
        <h1 className="text-xl font-semibold text-center flex-1 -ml-6">
          Kategorisierung
        </h1>
        <div className="w-6" />
      </div>

      {!selectedCategory ? (
        <div className="space-y-2">
          {categories.map((cat) => (
            <div
              key={cat.categoryID}
              className="flex justify-between items-center bg-gray-100 px-4 py-3 rounded border hover:bg-gray-300 transition cursor-pointer"
            >
              <span
                className="text-lg font-medium"
                onClick={() => setSelectedCategory(cat.categoryID)}
              >
                {cat.name}
              </span>
              <button onClick={() => deleteCategory(cat.categoryID)}>
                <Trash2 className="w-5 h-5 text-gray-700 hover:text-red-600" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div>
          <button
            onClick={() => setSelectedCategory(null)}
            className="text-blue-600 hover:underline mb-4 flex items-center gap-2"
          >
            ← Zurück zu den Kategorien
          </button>

          <h2 className="text-lg font-semibold mb-2">
            Aufgaben in {categories.find(c => c.categoryID === selectedCategory)?.name}
          </h2>

          <div className="bg-white rounded shadow p-4 space-y-2 mb-4">
            {tasks.filter((t) => t.categoryID === selectedCategory).length === 0 ? (
              <p className="text-sm text-gray-500">Keine Aufgaben vorhanden</p>
            ) : (
              tasks
                .filter((t) => t.categoryID === selectedCategory)
                .map((t) => (
                  <div key={t.taskID} className="flex justify-between items-center">
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={t.checked}
                        onChange={() => toggleChecked(t.taskID)}
                        className="h-5 w-5"
                      />
                      <span className={`text-base ${t.checked ? "line-through text-gray-400" : ""}`}>
                        {t.name}
                      </span>
                    </label>
                    <div className="flex gap-3 items-center">
                      <button onClick={() => toggleImportant(t)} title="Wichtig umschalten">
                        {t.important ? (
                          <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                        ) : (
                          <Star className="w-5 h-5 text-yellow-500" />
                        )}
                      </button>
                      <button onClick={() => deleteTask(t.taskID)}>
                        <Trash2 className="w-5 h-5 text-gray-600 hover:text-red-600" />
                      </button>
                    </div>
                  </div>
                ))
            )}
          </div>

          <AddTaskForm onAdd={addTask} />
        </div>
      )}
    </div>
  );
}

function AddTaskForm({ onAdd }: { onAdd: (text: string) => void }) {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(input);
    setInput("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Neue Aufgabe"
        className="flex-1 p-2 border rounded"
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Hinzufügen
      </button>
    </form>
  );
}
