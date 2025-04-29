"use client";

import { useRouter } from "next/navigation";
import BottomTabBar from "../components/BottomTabBar";
import {
  CalendarDays,
  Star,
  BookOpen,
} from "lucide-react";

export default function Dashboard() {
  const router = useRouter();

  return (
    <div className="min-h-screen pb-20 bg-gray-100 flex flex-col items-center justify-start p-10">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-6 text-gray-800">
          Willkommen bei Taskademia
        </h1>
        <p className="text-gray-600 text-lg">Wähle eine Kategorie aus.</p>
      </div>

      <div className="flex flex-col gap-4 w-full max-w-md">
        <button
          onClick={() => router.push("/meinTag")}
          className="flex items-center gap-3 p-4 bg-white rounded-lg shadow hover:bg-blue-100 transition"
        >
          <CalendarDays className="w-6 h-6 text-blue-600" />
          <span className="text-lg font-medium text-gray-800">Mein Tag</span>
        </button>

        <button
          onClick={() => router.push("/wichtig")}
          className="flex items-center gap-3 p-4 bg-white rounded-lg shadow hover:bg-blue-100 transition"
        >
          <Star className="w-6 h-6 text-yellow-500" />
          <span className="text-lg font-medium text-gray-800">Wichtig</span>
        </button>

        <button
          onClick={() => router.push("/kategorisierung")}
          className="flex items-center gap-3 p-4 bg-white rounded-lg shadow hover:bg-blue-100 transition"
        >
          <BookOpen className="w-6 h-6 text-green-600" />
          <span className="text-lg font-medium text-gray-800">Kategorisierung</span>
        </button>
      </div>
      <BottomTabBar />
    </div>
  );
}
