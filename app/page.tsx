// app/page.tsx
"use client";

import { useState } from "react";
import Login from "./components/login";
import Register from "./components/register";
import Dashboard from "./components/dashboard";

export default function Home() {
  const [isRegistering, setIsRegistering] = useState(false); // Zustand für den Registrierungsstatu
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Zustand für den Login-Status

if (isLoggedIn) {
    return <Dashboard />; // Wenn der Benutzer eingeloggt ist, zeige das Dashboard an
  }

  return (
    <div className="min-h-screen p-8 bg-gray-100 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-8">
        Taskademia {isRegistering ? "Registrieren" : "Login"}
      </h1>

      {isRegistering ? (
        <Register onSwitch={() => setIsRegistering(false)} />
      ) : (
        <Login 
        onSwitch={() => setIsRegistering(true)} // Callback für den Wechsel zur Registrierung
        onLoginSuccess={() => setIsLoggedIn(true)} // Callback für den erfolgreichen Login
        />
      )}
    </div>
  );
}
