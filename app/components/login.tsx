"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

interface LoginProps {
  onSwitch: () => void;
  onLoginSuccess: () => void; // Neue Prop
}

export default function Login({ onSwitch, onLoginSuccess }: LoginProps) {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loginError, setLoginError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoginError("");
    setLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        onLoginSuccess(); // Aufruf der neuen Prop
        router.push("../dashboard"); // Weiterleitung zur Dashboard-Seite
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

  return (
    <form onSubmit={handleLogin} className="w-full max-w-md space-y-4">
      <input
        type="text"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="w-full p-2 border rounded"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Passwort"
        className="w-full p-2 border rounded"
        required
      />

      {loginError && <p className="text-red-500">{loginError}</p>}

      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "Lädt…" : "Login"}
      </button>

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
