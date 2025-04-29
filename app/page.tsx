"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Login from "./components/login";
import Register from "./components/register";
import taskademiaLogo from "./images/taskademia.png";
import "./styles/welcomepage.css"; 

export default function Home() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  //Wenn Benutzer nicht angemeldet ist, wird die Willkommensseite angezeigt
  return (
    <div>

        <div className="banner" >
          <Image
            src={taskademiaLogo}
            alt="Taskademia Logo"
          />
            <div className="login-box">
              <button onClick={() => setIsLoginModalOpen(true)}>Login | Sign Up</button>
          </div>
        </div>

        <div className="slogan">Der Studienplaner von Studenten für Studenten</div>

        <div className="hardfacts-container">
          <div className="fact-box">📘 Dein Planer perfekt für die Uni</div>
          <div className="fact-box">⏰ Nie wieder Abgaben oder Fristen verpassen</div>
          <div className="fact-box">📅 Praktischer Kalender zum Planen von ToDo's</div>
          <div className="fact-box">🚀 Bringe dein Zeitmanagement auf ein neues Level</div>
        </div>

        <div className="hardfacts-container">
          <div className="fact-box">📧 Automatische Erinnerungen per Mail</div>
          <div className="fact-box">✅ Daily Aufgaben alle auf einen Blick</div>
          <div className="fact-box">🔍 Nach eigenen Kategorien filtern</div>
          <div className="fact-box">🌦️ Tägliche Motivationssprüche – passend zum Wetter</div>
        </div>

        <div className="hardfacts-container">
          <div className="fact-box">🎯 Personalisiere Taskademia zu deinem perfekten Alltagsplaner</div>
        </div>

      {setIsRegistering ? (
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