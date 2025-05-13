"use client";

import { useEffect, useState } from "react";
import { Trash2, Plus } from "lucide-react";
import BackButton from "../backbutton";
import "../../styles/category.css";

export default function KategorisierungPage() {
  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch(`/api/category`);
        const data = await response.json();

        if (data.success) {
          setCategories(
            data.categories.map((cat: { CategoryID: number; Name: string }) => ({
              id: cat.CategoryID,
              name: cat.Name,
            }))
          );
        } else {
          setError(data.message || "Fehler beim Laden der Kategorien");
        }
      } catch (err) {
        console.error("Fehler beim Abrufen der Kategorien:", err);
        setError("Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.");
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  const deleteCategory = async (id: number) => {
    try {
      const response = await fetch(`/api/category?categoryId=${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        // Entferne die Kategorie aus dem lokalen Zustand
        setCategories((prev) => prev.filter((c) => c.id !== id));
      } else {
        alert(data.message || "Fehler beim Löschen der Kategorie");
      }
    } catch (err) {
      console.error("Fehler beim Löschen der Kategorie:", err);
      alert("Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.");
    }
  };

  const handleAddCategory = async () => {
    const name = prompt("Neue Kategorie:");
    if (name && name.trim()) {
      try {
        const response = await fetch("/api/category", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: name.trim() }),
        });

        const data = await response.json();

        if (data.success) {
          setCategories((prev) => [
            ...prev,
            { id: Date.now(), name: name.trim() },
          ]);
        } else {
          alert(data.message || "Fehler beim Hinzufügen der Kategorie");
        }
      } catch (err) {
        console.error("Fehler beim Hinzufügen der Kategorie:", err);
        alert("Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.");
      }
    }
  };

  if (loading) {
    return <p className="category-loading">Lade Kategorien...</p>;
  }

  if (error) {
    return <p className="category-error">{error}</p>;
  }

  return (
    <div className="category-container">
      <div className="category-header">
        <BackButton />
        <h1 className="category-title">Kategorisierung</h1>
      </div>

      <div className="category-list">
        {categories.map((cat) => (
          <div key={cat.id} className="category-item">
            <span className="category-name">{cat.name}</span>
            <button onClick={() => deleteCategory(cat.id)}>
              <Trash2 className="category-delete-icon" />
            </button>
          </div>
        ))}
      </div>

      <button onClick={handleAddCategory} className="category-add-button">
        <Plus className="category-add-icon" />
        Hinzufügen
      </button>
    </div>
  );
}