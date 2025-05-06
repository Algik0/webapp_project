"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition"
    >
      <ArrowLeft className="w-5 h-5" />
      <span>Zurück</span>
    </button>
  );
}
