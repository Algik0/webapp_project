"use client";

import "../styles/dashboard.css";
import BottomTabBar from "./bottomtabbar";
import { useRouter } from "next/navigation";
import { CalendarDays, Star, BookOpen } from "lucide-react";
import { useEffect } from "react";

export default function Dashboard() {
  const router = useRouter();

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Willkommen bei Taskademia</h1>
        <p className="dashboard-subtitle">Wähle eine Kategorie aus.</p>
      </div>

      <div className="dashboard-buttons">
        <button
          onClick={() => router.push("/dashboard/myday")}
          className="dashboard-button"
        >
          <CalendarDays className="dashboard-icon text-blue-600" />
          <span className="dashboard-button-text">Mein Tag</span>
        </button>

        <button
          onClick={() => router.push("/dashboard/important")}
          className="dashboard-button"
        >
          <Star className="dashboard-icon text-yellow-500" />
          <span className="dashboard-button-text">Wichtig</span>
        </button>

        <button
          onClick={() => router.push("/dashboard/category")}
          className="flex items-center gap-3 p-4 bg-white rounded-lg shadow hover:bg-blue-100 transition"
        >
          <BookOpen className="dashboard-icon text-green-600" />
          <span className="dashboard-button-text">Kategorisierung</span>
        </button>
      </div>
      <BottomTabBar />
    </div>
  );
}
