// app/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Login from "./components/login";
import Register from "./components/register";
import taskademiaLogo from "./images/taskademia.png";

export default function Home() {
  const [isRegistering, setIsRegistering] = useState(false);
  const router = useRouter(); // ✅ Routing aktivieren

  const handleLoginSuccess = () => {
    router.push("/dashboard"); // ✅ Weiterleitung nach erfolgreichem Login
  };

  return (
    <div className="min-h-screen p-8 bg-gray-100 flex flex-col items-center">
      {/* Logo der Anwendung */}
      <div className="absolute top-4 right-4">
        <Image
          src={taskademiaLogo}
          alt="Taskademia Logo"
          width={300}
          height={300}
          className="rounded-full"
        />
      </div>

      {/* Titel der Anwendung */}
      <h1 className="text-4xl font-bold mb-8">
        Taskademia {isRegistering ? "Registrieren" : "Login"}
      </h1>

      {isRegistering ? (
        <Register onSwitch={() => setIsRegistering(false)} />
      ) : (
        <Login
          onSwitch={() => setIsRegistering(true)}
          onLoginSuccess={handleLoginSuccess} // ✅ Weitergabe der Weiterleitungsfunktion
        />
      )}
    </div>
  );
}
