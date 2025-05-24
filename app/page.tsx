// Hauptseite: Zeigt Willkommensbereich, Vorteile und Login/Register-Modal
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Login from "./components/login";
import Register from "./components/register";
import taskademiaLogo from "./images/taskademia.png";
import "./styles/welcomepage.css";

export default function Home() {
  // State für Login- und Register-Modal
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false); // Login-Modal sichtbar?
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false); // Register-Modal sichtbar?

  // Wenn nicht eingeloggt, Willkommensseite anzeigen
  return (
    <div>
      {/* Banner mit Logo und Login-Button */}
      <div className="banner">
        <Image src={taskademiaLogo} alt="Taskademia Logo" />
        <div className="login-box">
          {/* Öffnet Login-Modal */}
          <button onClick={() => setIsLoginModalOpen(true)}>
            Login | Sign Up
          </button>
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

      {/* Login-Modal */}
      {isLoginModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <button
              className="close-button"
              onClick={() => setIsLoginModalOpen(false)}
            >
              ✖
            </button>
            {/* Login-Komponente mit Switch zu Register */}
            <Login
              onSwitch={() => {
                setIsLoginModalOpen(false);
                setIsRegisterModalOpen(true);
              }}
              onLoginSuccess={() => {
                setIsLoginModalOpen(false);
              }}
            />
          </div>
        </div>
      )}

      {/* Register-Modal */}
      {isRegisterModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <button
              className="close-button"
              onClick={() => setIsRegisterModalOpen(false)}
            >
              ✖
            </button>
            {/* Register-Komponente mit Switch zu Login */}
            <Register
              onSwitch={() => {
                setIsRegisterModalOpen(false);
                setIsLoginModalOpen(true);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
