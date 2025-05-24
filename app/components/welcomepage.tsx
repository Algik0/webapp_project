// Komponente für die Willkommensseite mit Login/Registrierung
import React from "react";
import Login from "./login";
import Register from "./register";
import { useState } from "react";
import "../styles/welcomepage.css";

export default function Home() {
  const [isRegistering, setIsRegistering] = useState(false); // true = Registrierungsformular anzeigen
  const [isLoggedIn, setIsLoggedIn] = useState(false); // true = User ist eingeloggt

  return (
    <div>
      <div className="banner">
        <div className="login-box">
          {/* Zeigt je nach Zustand Login oder Registrierung */}
          {isRegistering ? (
            <Register onSwitch={() => setIsRegistering(false)} />
          ) : (
            <button>
              <Login
                onSwitch={() => setIsRegistering(true)} // Wechsel zu Registrierung
                onLoginSuccess={() => setIsLoggedIn(true)} // Nach Login
              />
            </button>
          )}
        </div>
      </div>

      {/* Slogan */}
      <div className="slogan">
        Der Studienplaner von Studenten für Studenten
      </div>

      {/* Vorteile/Fakten */}
      <div className="hardfacts-container">
        <div className="fact-box">📘 Dein Planer perfekt für die Uni</div>
        <div className="fact-box">
          ⏰ Nie wieder Abgaben oder Fristen verpassen
        </div>
        <div className="fact-box">
          📅 Praktischer Kalender zum Planen von ToDo's
        </div>
        <div className="fact-box">
          🚀 Bringe dein Zeitmanagement auf ein neues Level
        </div>
      </div>

      <div className="hardfacts-container">
        <div className="fact-box">📧 Automatische Erinnerungen per Mail</div>
        <div className="fact-box">✅ Daily Aufgaben alle auf einen Blick</div>
        <div className="fact-box">🔍 Nach eigenen Kategorien filtern</div>
        <div className="fact-box">
          🌦️ Tägliche Motivationssprüche – passend zum Wetter
        </div>
      </div>

      <div className="hardfacts-container">
        <div className="fact-box">
          🎯 Personalisiere Taskademia zu deinem perfekten Alltagsplaner
        </div>
      </div>
    </div>
  );
}
