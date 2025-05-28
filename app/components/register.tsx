// Registrierungskomponente: Zeigt das Registrierungsformular und behandelt die Registrierung
"use client";

import { useState } from "react";

export default function Register({ onSwitch }: { onSwitch: () => void }) {
  const [email, setEmail] = useState(""); // E-Mail-Feld
  const [password, setPassword] = useState(""); // Passwort-Feld
  const [registerError, setRegisterError] = useState(""); // Fehleranzeige
  const [successMessage, setSuccessMessage] = useState(""); // Erfolgsmeldung

  // Wird beim Absenden des Registrierungsformulars aufgerufen
  async function handleRegister(event: React.FormEvent) {
    event.preventDefault();
    setRegisterError("");
    setSuccessMessage("");

    // Einfache E-Mail-Prüfung
    if (!email.includes("@")) {
      setRegisterError("Bitte geben Sie eine gültige E-Mail-Adresse ein.");
      return;
    }

    try {
      // Anfrage an die Register-API
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email, password }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccessMessage(data.message); // Erfolg
      } else {
        setRegisterError(data.message); // Fehler
      }
    } catch (error) {
      console.error("Registration error:", error);
      setRegisterError("An error occurred. Please try again.");
    }
  }

  // Das eigentliche Formular
  return (
    <form onSubmit={handleRegister} className="w-full max-w-md space-y-4">
      {/* Eingabefeld für E-Mail */}
      <input
        type="text"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="w-full p-2 border border-gray-300 rounded"
        required
      />
      {/* Eingabefeld für Passwort */}
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Passwort"
        className="w-full p-2 border border-gray-300 rounded"
        required
      />
      {/* Fehleranzeige */}
      {registerError && <p className="text-red-500">{registerError}</p>}
      {/* Erfolgsmeldung */}
      {successMessage && <p className="text-green-500">{successMessage}</p>}
      {/* Registrieren-Button */}
      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
      >
        Registrieren
      </button>
      {/* Button zum Wechsel zum Login */}
      <button
        type="button"
        onClick={onSwitch}
        className="mt-4 text-blue-500 underline"
      >
        Zum Login wechseln
      </button>
    </form>
  );
}
