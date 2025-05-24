// Login-Komponente: Zeigt das Login-Formular und behandelt die Anmeldung
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

interface LoginProps {
  onSwitch: () => void; // Callback für Wechsel zu Registrierung
  onLoginSuccess: () => void; // Callback bei erfolgreichem Login
}

export default function Login({ onSwitch, onLoginSuccess }: LoginProps) {
  const router = useRouter();
  const [email, setEmail] = useState<string>(""); // E-Mail-Feld
  const [password, setPassword] = useState<string>(""); // Passwort-Feld
  const [loginError, setLoginError] = useState<string>(""); // Fehleranzeige
  const [loading, setLoading] = useState<boolean>(false); // Ladeanzeige

  // Wird beim Absenden des Login-Formulars aufgerufen
  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoginError("");
    setLoading(true);

    try {
      // Anfrage an die Login-API
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        onLoginSuccess(); // Bei Erfolg Callback ausführen
        router.push("../dashboard"); // Weiterleitung zum Dashboard
      } else {
        setLoginError(data.message || "Login fehlgeschlagen");
      }
    } catch (err) {
      console.error("Login error:", err);
      setLoginError("Netzwerkfehler, bitte versuche es erneut.");
    } finally {
      setLoading(false);
    }
  }

  // Das eigentliche Formular
  return (
    <form onSubmit={handleLogin} className="w-full max-w-md space-y-4">
      {/* Eingabefeld für E-Mail */}
      <input
        type="text"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="w-full p-2 border rounded"
        required
      />
      {/* Eingabefeld für Passwort */}
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Passwort"
        className="w-full p-2 border rounded"
        required
      />

      {/* Fehleranzeige */}
      {loginError && <p className="text-red-500">{loginError}</p>}

      {/* Login-Button */}
      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "Lädt…" : "Login"}
      </button>

      {/* Button zum Wechsel zur Registrierung */}
      <button
        type="button"
        onClick={onSwitch}
        className="mt-2 text-blue-500 underline"
      >
        Sign Up
      </button>
    </form>
  );
}
