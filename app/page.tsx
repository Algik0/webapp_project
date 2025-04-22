"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

const Login = dynamic(() => import("./login"), { ssr: false });

export default function Taskademia() {
  const [tasks, setTasks] = useState<string[]>([]);
  const [newTask, setNewTask] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<"login" | "register">("login");

  const addTask = () => {
    if (newTask.trim() !== "") {
      setTasks([...tasks, newTask]);
      setNewTask("");
    }
  };

  const removeTask = (index: number) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const openModal = (type: "login" | "register") => {
    setModalType(type);
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  return (
    <div className="min-h-screen p-8 bg-gray-100 flex flex-col items-center relative">
      {/* Login/Register Buttons */}
      <div className="absolute top-4 right-4 flex gap-2">
        <button
          onClick={() => openModal("login")}
          className="px-4 py-2 bg-white text-blue-500 border border-blue-500 rounded hover:bg-blue-50"
        >
          Login
        </button>
        <button
          onClick={() => openModal("register")}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
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

      {/* Modal */}
      {showModal && modalType === "login" && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-sm relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-black"
            >
              &times;
            </button>
            <Login />
          </div>
        </div>
      )}

      {showModal && modalType === "register" && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-sm relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-black"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4">Registrieren</h2>
            <form className="space-y-4">
              <input
                type="email"
                placeholder="E-Mail"
                className="w-full p-2 border border-gray-300 rounded"
              />
              <input
                type="password"
                placeholder="Passwort"
                className="w-full p-2 border border-gray-300 rounded"
              />
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
              >
                Registrieren
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}