// API-Route für Registrierung: Legt neuen User mit gehashtem Passwort an
import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import crypto from "crypto";

export async function POST(request: Request) {
  const { email: email, password } = await request.json();
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    return NextResponse.json(
      { success: false, message: "DATABASE_URL is not set" },
      { status: 500 }
    );
  }

  try {
    const sql = neon(databaseUrl);

    // Überprüfe, ob der Benutzer bereits existiert
    const existingEmail =
      await sql`SELECT * FROM "WebApp"."User" WHERE "Email" = ${email}`;
    if (existingEmail.length > 0) {
      return NextResponse.json({
        success: false,
        message: "User already exists",
      });
    }

    // Generiere ein Salt
    const salt = crypto.randomBytes(16).toString("hex");

    // Hash das Passwort mit dem Salt
    const hashedPassword = crypto
      .createHash("sha256")
      .update(password + salt)
      .digest("hex");

    // Füge den neuen Benutzer in die Datenbank ein
    await sql`INSERT INTO "WebApp"."User" ("Email", "Password", "Salt") VALUES (${email}, ${hashedPassword}, ${salt})`;

    return NextResponse.json({
      success: true,
      message: "Registration successful",
    });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
