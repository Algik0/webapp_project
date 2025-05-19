import React, { useState } from "react";
import "../styles/welcomepage.css";

interface TaskModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (name: string, date?: string) => void;
  title?: string;
  hideDateField?: boolean;
}

export default function TaskModal({ open, onClose, onSubmit, title, hideDateField }: TaskModalProps) {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [error, setError] = useState("");

  if (!open) return null;

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
            onChange={e => setName(e.target.value)}
            placeholder="Taskname"
            autoFocus
          />
          {!hideDateField && (
            <>
              <label className="modal-label">Datum</label>
              <input
                className="modal-input"
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
              />
            </>
          )}
          {error && <div className="modal-error">{error}</div>}
          <button className="modal-submit" type="submit">Hinzufügen</button>
          <button className="modal-cancel" type="button" onClick={onClose}>Abbrechen</button>
        </form>
      </div>
    </div>
  );
}
