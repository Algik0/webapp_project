// Dashboard-Seite: Übersicht, Logout, Kalender, Wetter und Navigation
"use client";

import "../styles/dashboard.css";
import BottomTabBar from "../components/BottomTabBar";
import { useRouter } from "next/navigation";
import { CalendarDays, Star, BookOpen } from "lucide-react";
import { useEffect, useState } from "react";
import Calendar from "../components/Calendar";
import { useCachedFetch } from "../components/useCachedFetch";
import Weather from "../components/Weather";

export default function Dashboard() {
  const router = useRouter();
  const [showCalendar, setShowCalendar] = useState(false); // Kalender-Overlay sichtbar?
  const [showWeather, setShowWeather] = useState(false); // Wetter-Widget sichtbar?

  // Logout-Handler: Löscht Cookie und leitet zur Startseite
  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    router.push("/");
  };

  // Holt alle Tasks für den Kalender (mit Caching)
  const {
    data: tasks,
    loading,
    error,
  } = useCachedFetch<any[]>(
    "calendar_tasks",
    async () => {
      const res = await fetch("/api/task");
      const data = await res.json();
      if (!data.success)
        throw new Error(data.message || "Fehler beim Laden der Tasks");
      return data.tasks;
    },
    { refreshOnFocus: true }
  );
  // Gruppiert Tasks nach Datum
  const tasksByDate: Record<string, any[]> = {};
  (tasks || []).forEach((task) => {
    if (task.Date) {
      const date = task.Date.slice(0, 10);
      if (!tasksByDate[date]) tasksByDate[date] = [];
      tasksByDate[date].push(task);
    }
  });

  // Overlay-Logik für Kalender (schließt bei Navigation)
  useEffect(() => {
    // Overlay nur anzeigen, wenn explizit showCalendar true ist
    if (!showCalendar) return;
    // Wenn Overlay offen ist und User navigiert, Overlay schließen
    const closeOnRoute = () => {
      if (window.location.pathname !== "/dashboard") {
        setShowCalendar(false);
      }
    };
    window.addEventListener("popstate", closeOnRoute);
    return () => window.removeEventListener("popstate", closeOnRoute);
  }, []); // <- zurück auf leeres Dependency-Array

  return (
    <div className="dashboard-container">
      <button className="dashboard-logout-btn" onClick={handleLogout}>
        Sign Out
      </button>
      <div className="dashboard-header">
        <h1 className="dashboard-title">Willkommen bei Taskademia</h1>
        <p className="dashboard-subtitle">Wähle eine Kategorie aus.</p>
      </div>

      <div className="dashboard-buttons">
        <button
          onClick={() => router.push("/dashboard/myday")}
          className="dashboard-button"
        >
          <CalendarDays className="dashboard-icon" />
          <span className="dashboard-button-text">Mein Tag</span>
        </button>

        <button
          onClick={() => router.push("/dashboard/important")}
          className="dashboard-button"
        >
          <Star className="dashboard-icon" />
          <span className="dashboard-button-text">Wichtig</span>
        </button>

        <button
          onClick={() => router.push("/dashboard/category")}
          className="dashboard-button"
        >
          <BookOpen className="dashboard-icon" />
          <span className="dashboard-button-text">Kategorien</span>
        </button>

        <button
          onClick={() => setShowWeather((prev) => !prev)}
          className="dashboard-button"
          style={{
            justifyContent: "flex-start",
            background: "#fff",
            border: "2px solid #e0e0e0",
            color: "#222",
            boxShadow: "0 2px 8px #0001",
            fontWeight: 500,
            marginBottom: showWeather ? 0 : "1.5rem",
            borderRadius: "12px 12px 0 0",
            zIndex: 2,
            position: "relative",
          }}
        >
          <span className="dashboard-icon" role="img" aria-label="Wetter">
            🌤️
          </span>
          <span className="dashboard-button-text">Wetter & Spruch</span>
        </button>
        {showWeather && (
          <div
            style={{
              width: "100%",
              background: "#fff",
              borderRadius: "0 0 16px 16px",
              boxShadow: "0 2px 12px #0003",
              padding: "0.7rem",
              marginBottom: "1.2rem",
              marginTop: 0,
              border: "2px solid #e0e0e0",
              borderTop: "none",
              zIndex: 1,
              position: "relative",
              maxHeight: "320px",
              overflowY: "auto",
              fontSize: "0.95rem",
              color: "#c0392b", // gesamter Text rot
              fontWeight: 500,
            }}
          >
            <Weather />
            <div
              style={{
                color: "#fff",
                fontWeight: 400,
                fontSize: "0.98rem",
                marginTop: "0.7rem",
              }}
            >
              Die Sonne motiviert – auch zum Lernen.
            </div>
          </div>
        )}
      </div>
      <BottomTabBar onCalendarClick={() => setShowCalendar(true)} />
      {showCalendar && (
        <div className="calendar-modal-overlay">
          <div className="calendar-modal-window">
            <button
              className="calendar-modal-close"
              onClick={() => setShowCalendar(false)}
            >
              ×
            </button>
            <h1>📅 Kalender</h1>
            {loading ? (
              <div>Kalender wird geladen...</div>
            ) : error ? (
              <div style={{ color: "red" }}>{error}</div>
            ) : (
              <Calendar tasksByDate={tasksByDate} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
