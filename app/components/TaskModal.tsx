// Modal-Komponente zum Hinzufügen/Bearbeiten eines Tasks
import React, { useState } from "react";
import "../styles/welcomepage.css";
import "../styles/tasks.css";

interface TaskModalProps {
  open: boolean; // Modal sichtbar?
  onClose: () => void; // Schließen-Handler
  onSubmit: (name: string, date?: string) => void; // Callback für Speichern
  title?: string; // Überschrift
  hideDateField?: boolean; // Soll das Datumsfeld ausgeblendet werden?
}

export default function TaskModal({
  open,
  onClose,
  onSubmit,
  title,
  hideDateField,
}: TaskModalProps) {
  const [name, setName] = useState(""); // Taskname
  const [date, setDate] = useState(""); // Datum
  const [error, setError] = useState(""); // Fehleranzeige

  if (!open) return null; // Modal nur anzeigen, wenn open=true

  // Beim Absenden: Validierung und Callback
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || (!hideDateField && !date)) {
      setError("Bitte alle Felder ausfüllen.");
      return;
    }
    setError("");
    if (hideDateField) {
      onSubmit(name.trim());
    } else {
      onSubmit(name.trim(), date);
    }
    setName("");
    setDate("");
  };

  // Das eigentliche Modal-Formular
  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2 className="modal-title">{title || "Task hinzufügen"}</h2>
        <form className="modal-form" onSubmit={handleSubmit}>
          <label className="modal-label">Taskname</label>
          <input
            className="modal-input"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Taskname"
            autoFocus
            required
          />
          {/* Optionales Datumsfeld */}
          {!hideDateField && (
            <>
              <label className="modal-label">Datum</label>
              <input
                className="modal-input"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </>
          )}
          {/* Fehleranzeige */}
          {error && <div className="modal-error">{error}</div>}
          <div className="modal-actions">
            <button type="submit" className="modal-save">
              Speichern
            </button>
            <button type="button" className="modal-cancel" onClick={onClose}>
              Abbrechen
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
