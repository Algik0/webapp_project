// Untere Navigationsleiste für die App (Dashboard/Kalender)
"use client";

import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Calendar } from "lucide-react";
import "../styles/bottomtabbar.css";

export default function BottomTabBar({ onCalendarClick }: { onCalendarClick?: () => void } = {}) {
  const pathname = usePathname(); // Aktueller Pfad
  const router = useRouter(); // Navigation

  // Tabs für die Navigation
  const tabs = [
    { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
    { name: "Kalender", icon: Calendar, href: "/kalender" },
  ];

  // Render: Buttons für jeden Tab
  return (
    <nav className="bottom-tabbar-nav">
      {tabs.map((tab) => {
        const isActive = pathname === tab.href; // Aktiver Tab?
        const Icon = tab.icon;
        return (
          <button
            key={tab.name}
            onClick={() => {
              if (tab.name === "Kalender" && onCalendarClick) {
                onCalendarClick(); // Spezialfall: Kalender-Overlay öffnen
              } else {
                router.push(tab.href); // Navigation
              }
            }}
            className={`bottom-tabbar-btn${isActive ? " bottom-tabbar-btn-active" : ""}`}
          >
            <Icon className="bottom-tabbar-icon" />
            <span className="bottom-tabbar-label">{tab.name}</span>
          </button>
        );
      })}
    </nav>
  );
}
