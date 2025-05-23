import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import nodemailer from "nodemailer";

// Produktiver Mailversand mit nodemailer (SMTP-Beispiel)
async function sendMail(to: string, subject: string, text: string) {
  // SMTP-Konfiguration für Gmail
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  await transporter.sendMail({
    from: process.env.SMTP_FROM || 'Taskademia <noreply@taskademia.de>',
    to,
    subject,
    text
  });
}

export async function POST(request: Request) {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    return NextResponse.json(
      { success: false, message: "DATABASE_URL is not set" },
      { status: 500 }
    );
  }
  const sql = neon(databaseUrl);

  // Find all users with important tasks due in 24h and not done
  // Assumes: Task table has columns Important (bool), Done (bool), Date (date), UserID (int)
  //          User table has columns UserID (int), Email (string)
  try {
    // Get all users with at least one such task
    const usersWithTasks = await sql`
      SELECT DISTINCT u."UserID", u."Email"
      FROM "WebApp"."User" u
      JOIN "WebApp"."Task" t ON u."UserID" = t."UserID"
      WHERE t."Important" = true
        AND t."Checked" = false
        AND t."Date" <= CURRENT_DATE + INTERVAL '1 day'
        AND t."Date" >= CURRENT_DATE
    `;

    for (const user of usersWithTasks) {
      // Get all important, not done, due-in-24h tasks for this user
      const tasks = await sql`
        SELECT "Name", "Date" FROM "WebApp"."Task"
        WHERE "UserID" = ${user.UserID}
          AND "Important" = true
          AND "Checked" = false
          AND "Date" <= CURRENT_DATE + INTERVAL '1 day'
          AND "Date" >= CURRENT_DATE
      `;
      if (tasks.length > 0) {
        const taskList = tasks.map((t: any) => `- ${t.Name} (fällig am ${t.Date.toISOString().slice(0,10)})`).join("\n");
        const subject = "Wichtige Aufgaben fällig in 24h";
        const text = `Hallo,\n\nSie haben folgende wichtige Aufgaben, die innerhalb der nächsten 24 Stunden fällig sind und noch nicht erledigt wurden:\n\n${taskList}\n\nBitte erledigen Sie diese rechtzeitig!\n\nIhr Taskademia Team`;
        await sendMail(user.Email, subject, text);
      }
    }
    return NextResponse.json({ success: true, message: "Benachrichtigungen verarbeitet." });
  } catch (error) {
    console.error("Notify error:", error);
    return NextResponse.json(
      { success: false, message: "Fehler beim Benachrichtigen." },
      { status: 500 }
    );
  }
}
