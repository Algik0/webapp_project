"use client";

import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Calendar } from "lucide-react";
import "../styles/bottomtabbar.css";

export default function BottomTabBar() {
  const pathname = usePathname();
  const router = useRouter();

  const tabs = [
    { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
    { name: "Kalender", icon: Calendar, href: "/dashboard/calender" },
  ];

  return (
    <nav className="bottom-tabbar-nav">
      {tabs.map((tab) => {
        const isActive = pathname === tab.href;
        const Icon = tab.icon;

        return (
          <button
            key={tab.name}
            onClick={() => router.push(tab.href)}
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
