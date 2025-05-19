"use client";

import "../styles/dashboard.css";
import BottomTabBar from "./bottomtabbar";
import { useRouter } from "next/navigation";
import { CalendarDays, Star, BookOpen } from "lucide-react";
import { useEffect, useState } from "react";
import Calendar from "../components/Calendar";
import { useCachedFetch } from "../components/useCachedFetch";
import Link from "next/link";

export default function Dashboard() {
  const router = useRouter();
  const [showCalendar, setShowCalendar] = useState(false);

  const handleLogout = () => {
    document.cookie =
      "userId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=" +
      window.location.hostname +
      ";";
    document.cookie = "userId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie =
      "userId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; Secure;";
    document.cookie = "userId=; Max-Age=0; path=/;";
    window.location.href = "/";
  };

  // Kalender-Tasks laden
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
  const tasksByDate: Record<string, any[]> = {};
  (tasks || []).forEach((task) => {
    if (task.Date) {
      const date = task.Date.slice(0, 10);
      if (!tasksByDate[date]) tasksByDate[date] = [];
      tasksByDate[date].push(task);
    }
  });

  // Kalender-Overlay-Logik
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
          <span className="dashboard-button-text">Kategorisierung</span>
        </button>

        <Link href="/dashboard/weather">
          <button
            className="dashboard-button"
            style={{ justifyContent: "flex-start" }}
          >
            <span className="dashboard-icon" role="img" aria-label="Wetter">
              🌤️
            </span>
            <span className="dashboard-button-text">Wetter & Spruch</span>
          </button>
        </Link>
      </div>
      <div className="dashboard-bottom">
        <BottomTabBar onCalendarClick={() => setShowCalendar(true)} />
      </div>
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
