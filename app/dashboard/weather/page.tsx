"use client";
import dynamic from "next/dynamic";

const Weather = dynamic(() => import("../../components/Weather"), {
  ssr: false,
});

export default function WeatherPage() {
  return <Weather />;
}
