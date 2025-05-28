// API-Route für Kategorien: Holt, erstellt, löscht Kategorien für den eingeloggten User
import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export async function GET(request: Request) {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    return NextResponse.json(
      { success: false, message: "DATABASE_URL is not set" },
      { status: 500 }
    );
  }

  try {
    const sql = neon(databaseUrl);

    // Hole die UserID aus den Cookies
    const cookies = request.headers.get("cookie");
    const userId = cookies?.match(/userId=(\d+)/)?.[1];

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "UserID is required" },
        { status: 400 }
      );
    }

    // Hole die CategoryID aus den Query-Parametern
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("categoryId");

    if (categoryId) {
      // Einzelne Kategorie prüfen
      const categories = await sql`
        SELECT c."CategoryID", c."Name", COUNT(t."TaskID") AS "TaskCount"
        FROM "WebApp"."Category" c
        LEFT JOIN "WebApp"."Task" t ON t."CategoryID" = c."CategoryID"
        WHERE c."UserID" = ${userId} AND c."CategoryID" = ${categoryId}
        GROUP BY c."CategoryID", c."Name"
      `;

      if (!categories.length) {
        return NextResponse.json(
          { success: false, message: "Kategorie nicht gefunden oder kein Zugriff" },
          { status: 404 }
        );
      }

      return NextResponse.json({ success: true, category: categories[0] });
    }

    // Hole alle Kategorien für den Benutzer, inkl. Task-Anzahl
    const categories = await sql`
      SELECT c."CategoryID", c."Name", COUNT(t."TaskID") AS "TaskCount"
      FROM "WebApp"."Category" c
      LEFT JOIN "WebApp"."Task" t ON t."CategoryID" = c."CategoryID"
      WHERE c."UserID" = ${userId}
      GROUP BY c."CategoryID", c."Name"
    `;

    return NextResponse.json({ success: true, categories });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    return NextResponse.json(
      { success: false, message: "DATABASE_URL is not set" },
      { status: 500 }
    );
  }

  try {
    const sql = neon(databaseUrl);

    // Hole die UserID aus den Cookies
    const cookies = request.headers.get("cookie");
    const userId = cookies?.match(/userId=(\d+)/)?.[1];

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "UserID is required" },
        { status: 400 }
      );
    }

    // Hole den Namen der neuen Kategorie aus dem Request-Body
    const { name } = await request.json();

    if (!name || name.trim() === "") {
      return NextResponse.json(
        { success: false, message: "Category name is required" },
        { status: 400 }
      );
    }

    // Füge die neue Kategorie in die Datenbank ein
    await sql`
      INSERT INTO "WebApp"."Category" ("UserID", "Name")
      VALUES (${userId}, ${name.trim()})
    `;

    return NextResponse.json({
      success: true,
      message: "Category added successfully",
    });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    return NextResponse.json(
      { success: false, message: "DATABASE_URL is not set" },
      { status: 500 }
    );
  }

  try {
    const sql = neon(databaseUrl);

    // Hole die UserID aus den Cookies
    const cookies = request.headers.get("cookie");
    const userId = cookies?.match(/userId=(\d+)/)?.[1];

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "UserID is required" },
        { status: 400 }
      );
    }

    // Hole die CategoryID aus den Query-Parametern
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("categoryId");

    if (!categoryId) {
      return NextResponse.json(
        { success: false, message: "CategoryID is required" },
        { status: 400 }
      );
    }

    // Lösche zuerst alle Tasks dieser Kategorie
    await sql`
      DELETE FROM "WebApp"."Task"
      WHERE "CategoryID" = ${categoryId} AND "UserID" = ${userId}
    `;

    // Lösche die Kategorie aus der Datenbank
    await sql`
      DELETE FROM "WebApp"."Category"
      WHERE "CategoryID" = ${categoryId} AND "UserID" = ${userId}
    `;

    return NextResponse.json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
