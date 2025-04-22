import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export async function POST(request: Request) {
  const { username, password } = await request.json();
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    return NextResponse.json(
      { success: false, message: "DATABASE_URL is not set" },
      { status: 500 }
    );
  }

  try {
    const sql = neon(databaseUrl);

    // Überprüfe die Login-Daten in der Datenbank
    const result = await sql`SELECT * FROM "WebApp"."Login" WHERE username = ${username} AND password = ${password}`;

    if (result.length > 0) {
      return NextResponse.json({ success: true, message: "Login successful" });
    } else {
      return NextResponse.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}