"use client";

import { useState } from "react";
import Login from "./components/login";
import Register from "./components/register";

export default function Taskademia() {
  const [isRegistering, setIsRegistering] = useState(false);

  return (
    <div className="min-h-screen p-8 bg-gray-100 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-8">
        Taskademia {isRegistering ? "Registrieren" : "Login"}
      </h1>
      {isRegistering ? (
        <Register onSwitch={() => setIsRegistering(false)} />
      ) : (
        <Login onSwitch={() => setIsRegistering(true)} />
      )}
    </div>
  );
}