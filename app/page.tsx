"use client";

import { useState } from "react";
import Image from "next/image";
import Login from "./components/login";
import Register from "./components/register";
import taskademiaLogo from "./images/taskademia.png";

export default function Home() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  return (
    <div>
      <div className={isLoginModalOpen || isRegisterModalOpen ? "darkened" : ""}>
        <div className="banner">
          <Image
            src={taskademiaLogo}
            alt="Taskademia Logo"
            width={300}
            height={300}
            className="rounded-full"
          />
          <div className="button-container">
            <button onClick={() => setIsLoginModalOpen(true)}>Anmelden</button>
            <button onClick={() => setIsRegisterModalOpen(true)}>Registrieren</button>
          </div>
        </div>

        <div className="slogan">Der Studienplaner von Studenten für Studenten</div>

        <div className="hardfacts-container">
          <div className="fact-box">📘 Dein Planer perfekt für die Uni</div>
          <div className="fact-box">⏰ Nie wieder Abgaben oder Fristen verpassen</div>
          <div className="fact-box">📅 Praktischer Kalender zum Planen von ToDo's</div>
          <div className="fact-box">🚀 Bringe dein Zeitmanagement auf ein neues Level</div>
        </div>
      </div>

      {isLoginModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <button className="close-button" onClick={() => setIsLoginModalOpen(false)}>
              ✖
            </button>
            <Login
              onSwitch={() => {
                setIsLoginModalOpen(false);
                setIsRegisterModalOpen(true);
              }}
              onLoginSuccess={() => {
                setIsLoginModalOpen(false);
                alert("Login erfolgreich!");
              }}
            />
          </div>
        </div>
      )}

      {isRegisterModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <button className="close-button" onClick={() => setIsRegisterModalOpen(false)}>
              ✖
            </button>
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