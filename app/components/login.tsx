"use client";

import { useState } from "react";

export default function Login({ onSwitch }: { onSwitch: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function handleLogin(event: React.FormEvent) {
    event.preventDefault();
    setLoginError("");
    setSuccessMessage("");

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccessMessage(data.message);
      } else {
        setLoginError(data.message);
      }
    } catch (error) {
      console.error("Login error:", error);
      setLoginError("An error occurred. Please try again.");
    }
  }

  return (
    <form onSubmit={handleLogin} className="w-full max-w-md space-y-4">
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        className="w-full p-2 border border-gray-300 rounded"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Passwort"
        className="w-full p-2 border border-gray-300 rounded"
        required
      />
      {loginError && <p className="text-red-500">{loginError}</p>}
      {successMessage && <p className="text-green-500">{successMessage}</p>}
      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
      >
        Login
      </button>
      <button
        type="button"
        onClick={onSwitch}
        className="mt-4 text-blue-500 underline"
      >
        Noch keinen Account? Registrieren
      </button>
    </form>
  );
}