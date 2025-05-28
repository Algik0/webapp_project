// CategoryDetailPage: Zeigt alle Tasks einer Kategorie, erlaubt Hinzufügen/Löschen/Markieren
// Prüft Zugriffsrechte und lädt Tasks per API
"use client";
import { useEffect, useState } from "react";
import { Trash2, Plus, Star, Folder } from "lucide-react";
import BackButton from "../../../components/backButton";
import TaskModal from "../../../components/TaskModal";
import { useRouter, useSearchParams } from "next/navigation";
import "../../../styles/tasks.css";
import React from "react";
import { useCachedFetch } from "../../../components/useCachedFetch";

export default function CategoryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: categoryId } = React.use(params); // Kategorie-ID aus Params
  const [tasks, setTasks] = useState<any[]>([]); // Tasks der Kategorie
  const [loading, setLoading] = useState(true); // Ladezustand
  const [error, setError] = useState(""); // Fehleranzeige
  const [modalOpen, setModalOpen] = useState(false); // Task-Modal sichtbar?
  const [categoryAllowed, setCategoryAllowed] = useState<boolean | null>(null); // Zugriff erlaubt?
  const [categoryDropdownTask, setCategoryDropdownTask] = useState<number | undefined>(undefined);
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryName = searchParams.get("name"); // Anzeigename
  const { data: categories } = useCachedFetch<{ id: number; name: string }[]>(
    "categories",
    async () => {
      const res = await fetch("/api/category");
      const data = await res.json();
      if (!data.success) return [];
      return data.categories.map((cat: any) => ({ id: cat.CategoryID, name: cat.Name }));
    }
  );

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

  // Handler zum Umschalten des Checked-Status
  const handleToggleChecked = async (taskId: number, checked: boolean) => {
    try {
      setTasks((prev) =>
        prev
          ? prev.map((task) =>
              task.TaskID === taskId ? { ...task, Checked: !checked } : task
            )
          : []
      );
      const response = await fetch("/api/task", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId, checked: !checked }),
      });
      const data = await response.json();
      if (!data.success) {
        // Optional: Task wieder zurücksetzen
        setTasks((prev) =>
          prev
            ? prev.map((task) =>
                task.TaskID === taskId ? { ...task, Checked: checked } : task
              )
            : []
        );
        alert(data.message || "Fehler beim Aktualisieren des Tasks");
      }
    } catch (err) {
      // Optional: Task wieder zurücksetzen
      setTasks((prev) =>
        prev
          ? prev.map((task) =>
              task.TaskID === taskId ? { ...task, Checked: checked } : task
            )
          : []
      );
      alert("Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.");
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
            <li
              key={task.TaskID}
              className={`shared-list-item${task.Checked ? " shared-list-done" : ""}`}
              onClick={() => handleToggleChecked(task.TaskID, task.Checked)}
            >
              <span className="shared-list-name">{task.Name}</span>
              <div className="shared-actions">
                {/* Kategorie-Icon (Folder) */}
                <button
                  className="shared-category"
                  title="Kategorie ändern"
                  style={{ marginRight: 2 }}
                  onClick={e => {
                    e.stopPropagation();
                    setCategoryDropdownTask(task.TaskID);
                  }}
                >
                  <Folder className="shared-important-icon" stroke="#222" width={16} height={16} />
                </button>
                <button
                  className="shared-important"
                  onClick={e => {
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
              {/* Kategorie-Dropdown für diesen Task */}
              {categoryDropdownTask === task.TaskID && (
                <select
                  className="modal-input"
                  style={{ position: "absolute", right: 40, top: 30, zIndex: 10, minWidth: 120 }}
                  value={task.CategoryID ?? ""}
                  onChange={async e => {
                    setCategoryDropdownTask(undefined);
                    const newCategoryId = e.target.value ? Number(e.target.value) : null;
                    await fetch("/api/task", {
                      method: "PATCH",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ taskId: task.TaskID, categoryId: newCategoryId }),
                    });
                    setTasks(prev => prev ? prev.map(t => t.TaskID === task.TaskID ? { ...t, CategoryID: newCategoryId ?? undefined } : t) : prev);
                  }}
                  onBlur={() => setCategoryDropdownTask(undefined)}
                >
                  <option value="">Keine Kategorie</option>
                  {categories && categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              )}
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
        hideCategoryField={true}
        categoryId={Number(categoryId)}
      />
    </div>
  );
}
