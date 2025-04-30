"use client";

import { useState } from "react";
import { Trash2, Plus } from "lucide-react";
import BackButton from "../backbutton";
import "../../styles/dashboard.css";


export default function KategorisierungPage() {
  const [categories, setCategories] = useState([
    { id: 1, name: "Abgaben" },
    { id: 2, name: "Hausaufgaben" },
    { id: 3, name: "Web-App" },
    { id: 4, name: "Krypto" },
  ]);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const [tasks, setTasks] = useState([
    { id: 1, category: "Web-App", text: "Login bauen", done: false },
    { id: 2, category: "Web-App", text: "Datenbank anlegen", done: false },
    { id: 3, category: "Krypto", text: "Wallet einrichten", done: true },
  ]);

  const toggleTask = (id: number) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  const deleteCategory = (id: number) => {
    const categoryToDelete = categories.find((cat) => cat.id === id)?.name;
    setCategories((prev) => prev.filter((c) => c.id !== id));
    setTasks((prev) => prev.filter((t) => t.category !== categoryToDelete));
    if (selectedCategory === categoryToDelete) setSelectedCategory(null);
  };

  const handleAddCategory = () => {
    const name = prompt("Neue Kategorie:");
    if (name && name.trim()) {
      setCategories([...categories, { id: Date.now(), name: name.trim() }]);
    }
  };

  return (
    <div className="min-h-screen pb-20 bg-gray-200 p-6">
      {/* Oben immer BackButton */}
      <div className="flex items-center justify-between mb-4">
        <BackButton />
        <h1 className="text-xl font-semibold text-center flex-1 -ml-6">
          Kategorisierung
        </h1>
        <div className="w-6" /> {/* Platzhalter für Icon-Ausgleich */}
      </div>

      {/* Kategorieübersicht */}
      {!selectedCategory ? (
        <div className="space-y-2">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="flex justify-between items-center bg-gray-100 px-4 py-3 rounded border hover:bg-gray-300 transition cursor-pointer"
            >
              <span
                className="text-lg font-medium"
                onClick={() => setSelectedCategory(cat.name)}
              >
                {cat.name}
              </span>
              <button onClick={() => deleteCategory(cat.id)}>
                <Trash2 className="w-5 h-5 text-gray-700 hover:text-red-600" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        // Aufgabenansicht für ausgewählte Kategorie
        <div>
          <button
            onClick={() => setSelectedCategory(null)}
            className="text-blue-600 hover:underline mb-4 flex items-center gap-2"
          >
            ← Zurück zu den Kategorien
          </button>

          <h2 className="text-lg font-semibold mb-2">
            Aufgaben in {selectedCategory}
          </h2>

          <div className="bg-white rounded shadow p-4 space-y-2 mb-4">
            {tasks.filter((t) => t.category === selectedCategory).length === 0 ? (
              <p className="text-sm text-gray-500">Keine Aufgaben vorhanden</p>
            ) : (
              tasks
                .filter((t) => t.category === selectedCategory)
                .map((t) => (
                  <label key={t.id} className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={t.done}
                      onChange={() => toggleTask(t.id)}
                      className="h-5 w-5"
                    />
                    <span
                      className={`text-base ${
                        t.done ? "line-through text-gray-400" : ""
                      }`}
                    >
                      {t.text}
                    </span>
                  </label>
                ))
            )}
          </div>

          {/* Neue Aufgabe hinzufügen */}
          <AddTaskForm
            onAdd={(taskText) => {
              if (!taskText.trim()) return;
              setTasks((prev) => [
                ...prev,
                {
                  id: Date.now(),
                  category: selectedCategory,
                  text: taskText.trim(),
                  done: false,
                },
              ]);
            }}
          />
        </div>
      )}

      {/* Kategorie hinzufügen (nur in Übersicht) */}
      {!selectedCategory && (
        <button
          onClick={handleAddCategory}
          className="fixed bottom-0 left-0 right-0 w-full bg-gray-700 text-white py-4 flex justify-center items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Hinzufügen
        </button>
      )}
    </div>
  );
}

// 🔧 Komponente zum Aufgaben-Hinzufügen
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
