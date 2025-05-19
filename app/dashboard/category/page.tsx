"use client";

import { useEffect, useState } from "react";
import { Trash2, Plus } from "lucide-react";
import BackButton from "../../components/backButton";
import CategoryModal from "../../components/CategoryModal";
import CategoryListSkeleton from "../../components/CategoryListSkeleton";
import { useCachedFetch } from "../../components/useCachedFetch";
import "../../styles/category.css";

export default function KategorisierungPage() {
  const [modalOpen, setModalOpen] = useState(false);

  const {
    data: categories,
    loading,
    error,
    refresh,
    setData: setCategories,
  } = useCachedFetch<{ id: number; name: string }[]>(
    "categories",
    async () => {
      const response = await fetch(`/api/category`);
      const data = await response.json();
      if (!data.success)
        throw new Error(data.message || "Fehler beim Laden der Kategorien");
      return data.categories.map(
        (cat: { CategoryID: number; Name: string }) => ({
          id: cat.CategoryID,
          name: cat.Name,
        })
      );
    },
    { refreshOnFocus: true }
  );

  const deleteCategory = async (id: number) => {
    try {
      const response = await fetch(`/api/category?categoryId=${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        setCategories((prev) => (prev ? prev.filter((c) => c.id !== id) : []));
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
        setCategories((prev) =>
          prev
            ? [...prev, { id: Date.now(), name: name.trim() }]
            : [{ id: Date.now(), name: name.trim() }]
        );
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
    return <CategoryListSkeleton />;
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
        {(categories || []).map((cat) => (
          <div key={cat.id} className="category-list-item">
            <span
              className="category-list-name"
              style={{ cursor: "pointer" }}
              onClick={() =>
                window.location.assign(`/dashboard/category/${cat.id}`)
              }
            >
              {cat.name}
            </span>
            <button
              className="category-delete"
              onClick={() => deleteCategory(cat.id)}
            >
              <Trash2 className="category-delete-icon" />
            </button>
          </div>
        ))}
      </div>
      <button
        onClick={() => setModalOpen(true)}
        className="category-add-button"
      >
        <Plus className="category-add-icon" /> Hinzufügen
      </button>
      <CategoryModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={(name) => handleAddCategory(name)}
        title="Kategorie hinzufügen"
      />
    </div>
  );
}
