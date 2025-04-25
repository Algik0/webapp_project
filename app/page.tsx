"use client";

import { useState } from "react";
import Image from "next/image";
import Login from "./components/login";
import Register from "./components/register";
import Dashboard from "./components/dashboard";
import taskademiaLogo from "./images/taskademia.png";

export default function Home() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (isLoggedIn) {
    return <Dashboard />;
  }

  return (
    <div>
      <div className="banner">
        <Image
          src={taskademiaLogo}
          alt="Taskademia Logo"
          width={300}
          height={300}
          className="rounded-full"
        />
        <div className="login-box">
          {isRegistering ? (
            <Register onSwitch={() => setIsRegistering(false)} />
          ) : (
            <Login
              onSwitch={() => setIsRegistering(true)}
              onLoginSuccess={() => setIsLoggedIn(true)}
            />
          )}
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
        <div className="fact-box">
          🎯 Personalisiere Taskademia zu deinem perfekten Alltagsplaner
        </div>
      </div>
    </div>
  );
}