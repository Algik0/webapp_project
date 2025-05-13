"use client";

import { useState } from "react";

export default function Register({ onSwitch }: { onSwitch: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [registerError, setRegisterError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function handleRegister(event: React.FormEvent) {
    event.preventDefault();
    setRegisterError("");
    setSuccessMessage("");

   // Überprüfe, ob die E-Mail ein "@" enthält
   if (!email.includes("@")) {
    setRegisterError("Bitte geben Sie eine gültige E-Mail-Adresse ein.");
    return;
  }

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email, password }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccessMessage(data.message);
      } else {
        setRegisterError(data.message);
      }
    } catch (error) {
      console.error("Registration error:", error);
      setRegisterError("An error occurred. Please try again.");
    }
  }

  return (
    <form onSubmit={handleRegister} className="w-full max-w-md space-y-4">
      <input
        type="text"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
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
      {registerError && <p className="text-red-500">{registerError}</p>}
      {successMessage && <p className="text-green-500">{successMessage}</p>}
      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
      >
        Registrieren
      </button>
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