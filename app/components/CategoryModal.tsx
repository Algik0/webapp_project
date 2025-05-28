// CategoryModal-Komponente: Modal zum Hinzufügen einer neuen Kategorie
// Zeigt ein Eingabefeld und validiert den Namen
import React, { useState } from "react";
import "../styles/welcomepage.css";
import "../styles/tasks.css";

interface CategoryModalProps {
  open: boolean; // Modal sichtbar?
  onClose: () => void; // Schließen-Handler
  onSubmit: (name: string) => void; // Callback für Speichern
  title?: string; // Überschrift
}

export default function CategoryModal({
  open,
  onClose,
  onSubmit,
  title,
}: CategoryModalProps) {
  const [name, setName] = useState(""); // Kategoriename
  const [error, setError] = useState(""); // Fehleranzeige

  if (!open) return null; // Modal nur anzeigen, wenn open=true

  // Beim Absenden: Validierung und Callback
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Bitte den Kategorienamen eingeben.");
      return;
    }
    setError("");
    onSubmit(name.trim());
    setName("");
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2 className="modal-title">{title || "Kategorie hinzufügen"}</h2>
        <form className="modal-form" onSubmit={handleSubmit}>
          <label className="modal-label">Kategoriename</label>
          <input
            className="modal-input"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Kategoriename"
            autoFocus
          />
          {error && <div className="modal-error">{error}</div>}
          <button className="modal-submit" type="submit">
            Hinzufügen
          </button>
          <button className="modal-cancel" type="button" onClick={onClose}>
            Abbrechen
          </button>
        </form>
      </div>
    </div>
  );
}
