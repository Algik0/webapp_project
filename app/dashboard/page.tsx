"use client";

import "../styles/dashboard.css";
import BottomTabBar from "./bottomtabbar";
import { useRouter } from "next/navigation";
import { CalendarDays, Star, BookOpen } from "lucide-react";
import { useEffect } from "react";

export default function Dashboard() {
  const router = useRouter();

  const handleLogout = () => {
    document.cookie = "userId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=" + window.location.hostname + ";";
    document.cookie = "userId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "userId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; Secure;";
    document.cookie = "userId=; Max-Age=0; path=/;";
    window.location.href = "/";
  };

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
      </div>
      <div className="dashboard-bottom">
        <BottomTabBar />
      </div>
    </div>
  );
}
