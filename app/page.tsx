"use client";

import { useState } from "react";

export default function Taskademia() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isRegistering, setIsRegistering] = useState(false); // Zustand für Login/Registrieren

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

  async function handleRegister(event: React.FormEvent) {
    event.preventDefault();
    setLoginError("");
    setSuccessMessage("");

    try {
      const response = await fetch("/api/register", {
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
      console.error("Registration error:", error);
      setLoginError("An error occurred. Please try again.");
    }
  }

  return (
    <div className="min-h-screen p-8 bg-gray-100 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-8">Taskademia {isRegistering ? "Registrieren" : "Login"}</h1>

      <form
        onSubmit={isRegistering ? handleRegister : handleLogin}
        className="w-full max-w-md space-y-4"
      >
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
          {isRegistering ? "Registrieren" : "Login"}
        </button>
      </form>

      <button
        onClick={() => setIsRegistering(!isRegistering)}
        className="mt-4 text-blue-500 underline"
      >
        {isRegistering ? "Zum Login wechseln" : "Noch keinen Account? Registrieren"}
      </button>
    </div>
  );
}