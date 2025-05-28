// Modal-Komponente zum Hinzufügen/Bearbeiten eines Tasks
import React, { useState, useEffect } from "react";
import "../styles/welcomepage.css";
import "../styles/tasks.css";
import { useCachedFetch } from "./useCachedFetch";
import { Folder, X } from "lucide-react";

interface TaskModalProps {
  open: boolean; // Modal sichtbar?
  onClose: () => void; // Schließen-Handler
  onSubmit: (name: string, date?: string, categoryId?: number) => void; // Callback für Speichern (jetzt mit Kategorie)
  title?: string; // Überschrift
  hideDateField?: boolean; // Soll das Datumsfeld ausgeblendet werden?
  categoryId?: number; // Vorausgewählte Kategorie (z.B. in Kategorie-Detailansicht)
  hideCategoryField?: boolean; // Kategorie-Auswahl ausblenden (z.B. in Kategorie-Detailansicht)
}

export default function TaskModal({
  open,
  onClose,
  onSubmit,
  title,
  hideDateField,
  categoryId,
  hideCategoryField,
}: TaskModalProps) {
  const [name, setName] = useState(""); // Taskname
  const [date, setDate] = useState(""); // Datum
  const [error, setError] = useState(""); // Fehleranzeige
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>(categoryId);
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
    setSelectedCategory(categoryId);
  }, [categoryId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || (!hideDateField && !date)) {
      setError("Bitte alle Felder ausfüllen.");
      return;
    }
    setError("");
    if (hideDateField) {
      onSubmit(name.trim(), undefined, selectedCategory);
    } else {
      onSubmit(name.trim(), date, selectedCategory);
    }
    setName("");
    setDate("");
    setSelectedCategory(categoryId);
  };

  if (!open) return null; // Modal nur anzeigen, wenn open=true

  return (
    <div className="modal-overlay">
      <div className="modal-container" style={{ borderRadius: 16, padding: 32, minWidth: 320, maxWidth: 380 }}>
        <h2 className="modal-title" style={{
          color: '#de3163',
          fontWeight: 700,
          fontSize: 28,
          textAlign: 'center',
          marginBottom: 24
        }}>{title || "Task hinzufügen"}</h2>
        <form className="modal-form" onSubmit={handleSubmit}>
          <label className="modal-label" style={{ fontWeight: 500, marginBottom: 8 }}>Taskname</label>
          <input
            className="modal-input"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Taskname"
            autoFocus
            required
            style={{ marginBottom: 16 }}
          />
          {!hideDateField && (
            <>
              <label className="modal-label" style={{ fontWeight: 500, marginBottom: 8 }}>Datum</label>
              <input
                className="modal-input"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                style={{ marginBottom: 16 }}
              />
            </>
          )}
          {!hideCategoryField && categories && (
            <>
              <label className="modal-label" style={{ fontWeight: 500, marginBottom: 8 }}>Kategorie auswählen</label>
              <select
                className="modal-input"
                value={selectedCategory ?? ""}
                onChange={e => setSelectedCategory(e.target.value ? Number(e.target.value) : undefined)}
                style={{ marginBottom: 16 }}
              >
                <option value="">Keine Kategorie</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </>
          )}
          {error && <div className="modal-error">{error}</div>}
          <button type="submit" className="modal-save" style={{
            width: '100%',
            background: 'linear-gradient(90deg, #de3163 0%, #ffb347 100%)',
            color: '#fff',
            fontWeight: 600,
            fontSize: 18,
            border: 'none',
            borderRadius: 8,
            padding: '12px 0',
            marginTop: 8,
            marginBottom: 8,
            cursor: 'pointer',
            transition: 'background 0.2s'
          }}
          onMouseOver={e => (e.currentTarget.style.background = 'linear-gradient(90deg, #ffb347 0%, #de3163 100%)')}
          onMouseOut={e => (e.currentTarget.style.background = 'linear-gradient(90deg, #de3163 0%, #ffb347 100%)')}
          >Hinzufügen</button>
        </form>
        <button type="button" className="modal-cancel" onClick={onClose} style={{
          background: 'none',
          border: 'none',
          color: '#de3163',
          textAlign: 'center',
          width: '100%',
          fontSize: 16,
          marginTop: 8,
          textDecoration: 'underline',
          cursor: 'pointer',
          fontWeight: 500
        }}>Abbrechen</button>
      </div>
    </div>
  );
}
