import { NextResponse } from "next/server";

export async function POST() {
  // Setzt das userId-Cookie auf abgelaufen (löschen)
  const response = NextResponse.json({ success: true });
  response.cookies.set("userId", "", {
    httpOnly: true,
    secure: true,
    path: "/",
    expires: new Date(0), // In der Vergangenheit
  });
  return response;
}
