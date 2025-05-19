"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import "../styles/backbutton.css";

export default function BackButton() {
  const router = useRouter();

  return (
    <button onClick={() => router.back()} className="back-button">
      <ArrowLeft className="back-icon" />
    </button>
  );
}
