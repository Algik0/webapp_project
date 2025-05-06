"use client";

import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Calendar } from "lucide-react";

export default function BottomTabBar() {
  const pathname = usePathname();
  const router = useRouter();

  const tabs = [
    { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
    { name: "Kalender", icon: Calendar, href: "/kalender" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-md flex justify-around py-3 z-50">
      {tabs.map((tab) => {
        const isActive = pathname === tab.href;
        const Icon = tab.icon;

        return (
          <button
            key={tab.name}
            onClick={() => router.push(tab.href)}
            className={`flex flex-col items-center text-sm ${
              isActive ? "text-blue-600" : "text-gray-500"
            }`}
          >
            <Icon className="w-6 h-6 mb-1" />
            {tab.name}
          </button>
        );
      })}
    </nav>
  );
}
