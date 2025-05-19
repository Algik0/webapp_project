"use client";

import { useEffect, useState } from "react";
import { Trash2, Plus } from "lucide-react";
import BackButton from "../../components/backButton";
import CategoryModal from "../../components/CategoryModal";
import "../../styles/category.css";

export default function KategorisierungPage() {
  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch(`/api/category`);
        const data = await response.json();

        if (data.success) {
          setCategories(
            data.categories.map(
              (cat: { CategoryID: number; Name: string }) => ({
                id: cat.CategoryID,
                name: cat.Name,
              })
            )
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

  const handleAddCategory = async (name?: string) => {
    if (!name) {
      setModalOpen(true);
      return;
    }
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
        setModalOpen(false);
      } else {
        alert(data.message || "Fehler beim Hinzufügen der Kategorie");
      }
    } catch (err) {
      console.error("Fehler beim Hinzufügen der Kategorie:", err);
      alert("Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.");
    }
  };

  if (loading) {
    return (
      <div className="category-container">
        <div className="category-loading-centered">Lade Kategorien...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="category-container">
        <p className="category-error">{error}</p>
      </div>
    );
  }

  return (
    <div className="category-container">
      <div className="category-header">
        <BackButton />
        <h1 className="category-title">Kategorisierung</h1>
      </div>

      <div className="category-list">
        {categories.map((cat) => (
          <div key={cat.id} className="category-list-item">
            <span className="category-list-name">{cat.name}</span>
            <button className="category-delete" onClick={() => deleteCategory(cat.id)}>
              <Trash2 className="category-delete-icon" />
            </button>
          </div>
        ))}
      </div>

      <button onClick={() => setModalOpen(true)} className="category-add-button">
        <Plus className="category-add-icon" /> Hinzufügen
      </button>
      <CategoryModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={name => handleAddCategory(name)}
        title="Kategorie hinzufügen"
      />
    </div>
  );
}
