// KategorisierungPage: Zeigt alle Kategorien des Nutzers und ermöglicht das Hinzufügen/Löschen
// Nutzt CategoryModal und CategoryListSkeleton für UI/UX
"use client";

import { useEffect, useState } from "react";
import { Trash2, Plus } from "lucide-react";
import BackButton from "../../components/backButton";
import CategoryModal from "../../components/CategoryModal";
import CategoryListSkeleton from "../../components/CategoryListSkeleton";
import { useCachedFetch } from "../../components/useCachedFetch";
import { useRouter } from "next/navigation";

export default function KategorisierungPage() {
  const [modalOpen, setModalOpen] = useState(false); // Modal für neue Kategorie
  const router = useRouter();

  // Holt Kategorien aus der API (mit Caching)
  const {
    data: categories,
    loading,
    error,
    refresh,
    setData: setCategories,
  } = useCachedFetch<{ id: number; name: string; count?: number }[]>(
    "categories",
    async () => {
      const response = await fetch(`/api/category`);
      const data = await response.json();
      if (!data.success)
        throw new Error(data.message || "Fehler beim Laden der Kategorien");
      return data.categories.map(
        (cat: { CategoryID: number; Name: string; TaskCount?: number }) => ({
          id: cat.CategoryID,
          name: cat.Name,
          count: Number(cat.TaskCount) || 0,
        })
      );
    },
    { refreshOnFocus: true }
  );

  // Löscht eine Kategorie per API
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
      alert("Fehler beim Löschen der Kategorie");
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
        setModalOpen(false);
        refresh(); // Kategorien neu laden, damit Task-Zahlen und IDs stimmen
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
      <div className="shared-container">
        <p className="category-error">{error}</p>
      </div>
    );
  }

  return (
    <div className="shared-container">
      <div className="shared-header">
        <BackButton />
        <h1 className="shared-title">Kategorisierung</h1>
      </div>
      <div className="shared-list">
        {(categories && categories.length > 0) ? (
          categories.map((cat) => (
            <div key={cat.id} className="shared-list-item">
              <span
                className="shared-list-name"
                style={{ cursor: "pointer" }}
                onClick={() =>
                  router.push(
                    `/dashboard/category/${cat.id}?name=${encodeURIComponent(
                      cat.name
                    )}`
                  )
                }
              >
                {cat.name}
                <span style={{ fontSize: '0.85em', color: '#888', marginLeft: 6 }}>
                  {cat.count} Tasks
                </span>
              </span>
              <button
                className="shared-delete"
                onClick={() => deleteCategory(cat.id)}
              >
                <Trash2 className="shared-delete-icon" />
              </button>
            </div>
          ))
        ) : (
          <div style={{ color: '#888', textAlign: 'center', marginTop: 24 }}>
            Keine Kategorien vorhanden.
          </div>
        )}
      </div>
      <button
        onClick={() => setModalOpen(true)}
        className="shared-add-button"
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
