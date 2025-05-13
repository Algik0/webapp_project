import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import crypto from "crypto";

export async function POST(request: Request) {
  const { email, password } = await request.json();
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    return NextResponse.json(
      { success: false, message: "DATABASE_URL is not set" },
      { status: 500 }
    );
  }

  try {
    const sql = neon(databaseUrl);

    // Hole den Benutzer und das Salt aus der Datenbank
    const result = await sql`
      SELECT "UserID", "Password", "Salt"
      FROM "WebApp"."User"
      WHERE "Email" = ${email}
    `;

    if (result.length === 0) {
      return NextResponse.json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const { UserID, Password: storedPassword, Salt: salt } = result[0];

    // Hash das eingegebene Passwort mit dem Salt
    const hashedPassword = crypto
      .createHash("sha256")
      .update(password + salt)
      .digest("hex");

    // Vergleiche das gehashte Passwort mit dem gespeicherten Passwort
    if (hashedPassword === storedPassword) {
      // Speichere die UserID in einem Cookie
      const response = NextResponse.json({
        success: true,
        message: "Login successful",
      });
      response.cookies.set("userId", UserID, {
        httpOnly: true,
        secure: true,
        path: "/",
      });
      return response;
    } else {
      return NextResponse.json({
        success: false,
        message: "Invalid credentials",
      });
    }
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
