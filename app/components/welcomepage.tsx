import React from 'react';
import Login from "./login";
import Register from "./register";
import { useState } from "react";
import Image from "next/image";
import taskademiaLogo from "../images/taskademia.png";

export default function Home() {
  const [isRegistering, setIsRegistering] = useState(false); // Zustand für den Registrierungsstatu
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Zustand für den Login-Status

  return (
    <div>
      <style>
        {`
          body {
            margin: 0;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(to bottom left, #de3163, #000000);
            color: #333;
          }

          .banner {
            width: 100%;
            height: 420px;
            background-image: url('../images/taskademia.png');
            background-size: cover;
            background-position: center;
            display: flex;
            justify-content: flex-end;
            align-items: flex-start;
            padding: 15px;
            box-sizing: border-box;
          }

          .login-box {
            background-color: white;
            border-radius: 10px;
            width: 160px;
            font-size: 16px;
            text-align: center;
          }

          .login-box button {
            padding: 15px;
            background: linear-gradient(to bottom left, #de3163, #000000);
            border: none;
            color: white;
            border-radius: 5px;
            font-size: 18px;
            cursor: pointer;
            transition: background-color 0.3s ease;
          }

          .login-box button:hover {
            background: linear-gradient(to bottom left, #000000, #de3163);
          }

          .slogan {
            text-align: center;
            background-color: white;
            font-size: 28px;
            font-weight: bold;
            padding: 30px 20px;
            border-radius: 20px;
            margin: 40px auto 20px auto;
            max-width: 700px;
            box-shadow: 0 3px 10px rgba(0, 0, 0, 0.15);
          }

          .hardfacts-container {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 25px;
            padding: 40px;
          }

          .fact-box {
            background-color: white;
            padding: 30px 20px;
            border-radius: 16px;
            box-shadow: 0 3px 12px rgba(0, 0, 0, 0.1);
            text-align: center;
            font-size: 18px;
            line-height: 1.6;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
          }

          .fact-box:hover {
            transform: translateY(-5px);
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
          }
        `}
      </style>

      <div className="banner">
        <div className="login-box">
          {isRegistering ? (
                  <Register onSwitch={() => setIsRegistering(false)} />
                ) : (
          <button>
            <Login 
              onSwitch={() => setIsRegistering(true)} // Callback für den Wechsel zur Registrierung
              onLoginSuccess={() => setIsLoggedIn(true)} // Callback für den erfolgreichen Login
              />
            </button>
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
        <div className="fact-box">🎯 Personalisiere Taskademia zu deinem perfekten Alltagsplaner</div>
      </div>
    </div>
  );
};