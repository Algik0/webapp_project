"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function BackButton() {
  const router = useRouter();

  return (
    <button className="bottom_backbutton" onClick={() => router.back()}>
      <ArrowLeft />
    </button>
  );
}
