"use client";
import { useEffect, useState } from "react";
import { Trash2, Plus } from "lucide-react";
import BackButton from "../../../components/backButton";
import { useParams } from "next/navigation";

export default function CategoryDetailPage() {
  const params = useParams();
  const categoryId = params.id as string;
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    fetch(`/api/task?categoryId=${categoryId}`)
      .then(res => res.json())
      .then(data => {
        if (!data.success) throw new Error(data.message || "Fehler beim Laden der Tasks");
        setTasks(data.tasks);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [categoryId]);

  const handleAddTask = async () => {
    if (!newTask.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newTask.trim(), categoryId }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Fehler beim Hinzufügen des Tasks");
      setTasks(prev => [...prev, data.task]);
      setNewTask("");
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="category-container">
      <div className="category-header">
        <BackButton />
        <h1 className="category-title">Kategorie: {categoryId}</h1>
      </div>
      {loading ? (
        <div>Tasks werden geladen...</div>
      ) : error ? (
        <div style={{ color: "red" }}>{error}</div>
      ) : (
        <>
          <div className="category-task-list">
            {tasks.map(task => (
              <div key={task.TaskID} className="category-task-item">
                <span>{task.Name}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
            <input
              value={newTask}
              onChange={e => setNewTask(e.target.value)}
              placeholder="Neuen Task hinzufügen..."
              style={{ flex: 1, padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
            />
            <button onClick={handleAddTask} className="category-add-button">
              <Plus className="category-add-icon" />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
