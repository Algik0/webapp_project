// app/page.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import Login from "./components/login";
import Register from "./components/register";
import Dashboard from "./components/dashboard";
import taskademiaLogo from "./images/taskademia.png";

export default function Home() {
  const [isRegistering, setIsRegistering] = useState(false); // Zustand für den Registrierungsstatu
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Zustand für den Login-Status

if (isLoggedIn) {
    return <Dashboard />; // Wenn der Benutzer eingeloggt ist, zeige das Dashboard an
  }

  return (
    <div className="min-h-screen p-8 bg-gray-100 flex flex-col items-center">
      {/* Logo der Anwendung */}
      <div className="absolute top-4 right-4">
        <Image src={taskademiaLogo} alt="Taskademia Logo" width={300} height={300} className="rounded-full"/>
      </div>

      {/* Titel der Anwendung */}
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
