import React, { useState } from "react";
import "../styles/welcomepage.css";

interface CategoryModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void;
  title?: string;
}

export default function CategoryModal({
  open,
  onClose,
  onSubmit,
  title,
}: CategoryModalProps) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  if (!open) return null;

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
