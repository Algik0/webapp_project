"use client";

import { useState } from "react";
import { neon } from "@neondatabase/serverless";

export default function Taskademia() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  async function handleLogin(event: React.FormEvent) {
    event.preventDefault();
    setLoginError("");

    try {
      const sql = neon(`${process.env.DATABASE_URL}`);
      const result = await sql(`SELECT * FROM WebApp.Login WHERE username = $1 AND password = $2`
        ,
        [username, password]
      );

      if (result.length > 0) {
        alert("Login successful!");
        // Handle successful login (e.g., set user session)
      } else {
        setLoginError("Invalid username or password.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setLoginError("An error occurred. Please try again.");
    }
  }

  return (
    <div className="min-h-screen p-8 bg-gray-100 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-8">Taskademia Login</h1>

      <form onSubmit={handleLogin} className="w-full max-w-md space-y-4">
        <input
          type="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="E-Mail"
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
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Login
        </button>
      </form>
    </div>
  );
}
