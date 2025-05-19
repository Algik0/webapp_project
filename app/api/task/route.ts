import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export async function GET(req: NextRequest) {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    return NextResponse.json(
      { success: false, message: "DATABASE_URL is not set" },
      { status: 500 }
    );
  }
  const sql = neon(databaseUrl);
  // Hole die UserID aus den Cookies
  const cookies = req.headers.get("cookie");
  const userId = cookies?.match(/userId=(\d+)/)?.[1];
  if (!userId) {
    return NextResponse.json(
      { success: false, message: "UserID is required" },
      { status: 400 }
    );
  }
  const { searchParams } = new URL(req.url);
  const important = searchParams.get("important");
  const myday = searchParams.get("myday");
  const categoryId = searchParams.get("categoryId");
  let tasks;
  try {
    if (categoryId) {
      tasks = await sql`
        SELECT * FROM "WebApp"."Task"
        WHERE "UserID" = ${userId} AND "CategoryID" = ${categoryId}
      `;
    } else if (important === "true") {
      tasks = await sql`
        SELECT * FROM "WebApp"."Task"
        WHERE "UserID" = ${userId} AND "Important" = true
      `;
    } else if (myday === "true") {
      tasks = await sql`
        SELECT * FROM "WebApp"."Task"
        WHERE "UserID" = ${userId} AND "Date" = CURRENT_DATE
      `;
    } else {
      tasks = await sql`
        SELECT * FROM "WebApp"."Task"
        WHERE "UserID" = ${userId}
      `;
    }
    return NextResponse.json({ success: true, tasks });
  } catch (err) {
    return NextResponse.json({ success: false, message: "Fehler beim Laden der Tasks" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    return NextResponse.json(
      { success: false, message: "DATABASE_URL is not set" },
      { status: 500 }
    );
  }
  const sql = neon(databaseUrl);
  // Hole die UserID aus den Cookies
  const cookies = req.headers.get("cookie");
  const userId = cookies?.match(/userId=(\d+)/)?.[1];
  if (!userId) {
    return NextResponse.json(
      { success: false, message: "UserID is required" },
      { status: 400 }
    );
  }
  const { taskId, checked, important } = await req.json();
  if (!taskId) {
    return NextResponse.json({ success: false, message: "TaskID fehlt" }, { status: 400 });
  }
  try {
    if (typeof checked === "boolean") {
      await sql`
        UPDATE "WebApp"."Task"
        SET "Checked" = ${checked}
        WHERE "TaskID" = ${taskId} AND "UserID" = ${userId}
      `;
    }
    if (typeof important === "boolean") {
      await sql`
        UPDATE "WebApp"."Task"
        SET "Important" = ${important}
        WHERE "TaskID" = ${taskId} AND "UserID" = ${userId}
      `;
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, message: "Fehler beim Aktualisieren des Tasks" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    return NextResponse.json(
      { success: false, message: "DATABASE_URL is not set" },
      { status: 500 }
    );
  }
  const sql = neon(databaseUrl);
  // Hole die UserID aus den Cookies
  const cookies = req.headers.get("cookie");
  const userId = cookies?.match(/userId=(\d+)/)?.[1];
  if (!userId) {
    return NextResponse.json(
      { success: false, message: "UserID is required" },
      { status: 400 }
    );
  }
  const { name, important, date, categoryId } = await req.json();
  if (!name || !date) {
    return NextResponse.json({ success: false, message: "Name und Datum sind erforderlich" }, { status: 400 });
  }
  try {
    let task;
    if (important) {
      // Für Wichtig-Tasks
      task = await sql`
        INSERT INTO "WebApp"."Task" ("UserID", "Name", "Important", "Checked", "Date", "CategoryID")
        VALUES (${userId}, ${name}, true, false, ${date}, ${categoryId ?? null})
        RETURNING *
      `;
    } else {
      // Für Mein Tag-Tasks und alle anderen
      task = await sql`
        INSERT INTO "WebApp"."Task" ("UserID", "Name", "Checked", "Date", "CategoryID")
        VALUES (${userId}, ${name}, false, ${date}, ${categoryId ?? null})
        RETURNING *
      `;
    }
    return NextResponse.json({ success: true, task: task[0] });
  } catch (err) {
    return NextResponse.json({ success: false, message: "Fehler beim Hinzufügen des Tasks" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    return NextResponse.json(
      { success: false, message: "DATABASE_URL is not set" },
      { status: 500 }
    );
  }
  const sql = neon(databaseUrl);
  // Hole die UserID aus den Cookies
  const cookies = req.headers.get("cookie");
  const userId = cookies?.match(/userId=(\d+)/)?.[1];
  if (!userId) {
    return NextResponse.json(
      { success: false, message: "UserID is required" },
      { status: 400 }
    );
  }
  const { searchParams } = new URL(req.url);
  const taskId = searchParams.get("taskId");
  if (!taskId) {
    return NextResponse.json({ success: false, message: "TaskID fehlt" }, { status: 400 });
  }
  try {
    await sql`
      DELETE FROM "WebApp"."Task"
      WHERE "TaskID" = ${taskId} AND "UserID" = ${userId}
    `;
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, message: "Fehler beim Löschen des Tasks" }, { status: 500 });
  }
}
