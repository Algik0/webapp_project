"use client";
import { useEffect, useState } from "react";
import { Trash2, Plus, Star } from "lucide-react";
import BackButton from "../../../components/backButton";
import TaskModal from "../../../components/TaskModal";
import { useRouter, useSearchParams } from "next/navigation";
import "../../../styles/tasks.css";
import React from "react";

export default function CategoryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: categoryId } = React.use(params);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [categoryAllowed, setCategoryAllowed] = useState<boolean | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryName = searchParams.get("name");
    
  useEffect(() => {
    // Prüfe, ob die Kategorie dem User gehört
    fetch(`/api/category?categoryId=${categoryId}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.success) {
          setCategoryAllowed(false);
        } else {
          setCategoryAllowed(true);
        }
      })
      .catch(() => setCategoryAllowed(false));
  }, [categoryId]);

  useEffect(() => {
    if (categoryAllowed === false) return;
    fetch(`/api/task?categoryId=${categoryId}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.success)
          throw new Error(data.message || "Fehler beim Laden der Tasks");
        setTasks(data.tasks);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [categoryId, categoryAllowed]);

  const handleAddTask = async (name?: string, date?: string) => {
    if (!name || !date) {
      setModalOpen(true);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), date, categoryId }),
      });
      const data = await res.json();
      if (!data.success)
        throw new Error(data.message || "Fehler beim Hinzufügen des Tasks");
      setTasks((prev) => [...prev, data.task]);
      setModalOpen(false);
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleDeleteTask = async (taskId: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/task?taskId=${taskId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!data.success)
        throw new Error(data.message || "Fehler beim Löschen des Tasks");
      setTasks((prev) => prev.filter((task) => task.TaskID !== taskId));
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleToggleImportant = async (
    taskId: number,
    important: boolean | undefined
  ) => {
    try {
      setTasks((prev) =>
        prev
          ? prev.map((task) =>
              task.TaskID === taskId ? { ...task, Important: !important } : task
            )
          : []
      );
      await fetch("/api/task", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId, important: !important }),
      });
    } catch (err) {
      // Fehlerbehandlung optional
    }
  };

  if (categoryAllowed === false) {
    return (
      <div className="shared-container">
        <BackButton />
        <div className="shared-error" style={{ color: "#fff", marginTop: 32 }}>
          Keine Berechtigung oder Kategorie nicht gefunden.
        </div>
      </div>
    );
  }

  return (
    <div className="shared-container">
      <div className="shared-header" style={{ justifyContent: "space-between" }}>
        <BackButton />
        <span className="shared-title">
          Kategorie: {categoryName || `Kategorie ${categoryId}`}
        </span>
      </div>
      {loading ? (
        <div className="shared-loading">Tasks werden geladen...</div>
      ) : error ? (
        <div className="shared-error" style={{ color: "#fff" }}>{error}</div>
      ) : (
        <ul className="shared-list">
          {tasks.map((task) => (
            <li key={task.TaskID} className="shared-list-item">
              <span className="shared-list-name">{task.Name}</span>
              <div className="shared-actions">
                <button
                  className="shared-important"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleImportant(task.TaskID, task.Important);
                  }}
                >
                  <Star
                    className="shared-important-icon"
                    fill={task.Important ? "#de3163" : "none"}
                    stroke="#de3163"
                    width={16}
                    height={16}
                  />
                </button>
                <button
                  className="shared-delete"
                  onClick={() => handleDeleteTask(task.TaskID)}
                >
                  <Trash2 className="shared-delete-icon" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <button onClick={() => setModalOpen(true)} className="shared-add-button">
        <Plus className="myday-add-icon" /> Hinzufügen
      </button>
      <TaskModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleAddTask}
        title="Task zur Kategorie hinzufügen"
      />
    </div>
  );
}
