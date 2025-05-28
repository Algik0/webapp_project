// WeatherPage: Zeigt das Wetter-Widget (dynamisch importiert, kein SSR)
"use client";
import dynamic from "next/dynamic";

const Weather = dynamic(() => import("../../components/Weather"), {
  ssr: false, // Wetter-Komponente nur im Client rendern
});

export default function WeatherPage() {
  return <Weather />;
}
