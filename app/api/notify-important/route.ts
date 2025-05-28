// Importiere benötigte Module für Server-Response, Datenbank und E-Mail
import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import nodemailer from "nodemailer";

// Funktion zum Versenden einer E-Mail über Gmail
async function sendMail(to: string, subject: string, text: string) {
  // Erstelle einen SMTP-Transporter mit Gmail-Zugangsdaten aus der .env
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_USER, // Absender-Adresse aus Umgebungsvariable
      pass: process.env.SMTP_PASS  // Passwort/App-Passwort aus Umgebungsvariable
    }
  });

  // Sende die E-Mail mit Betreff und Text
  await transporter.sendMail({
    from: process.env.SMTP_FROM || 'Taskademia <noreply@taskademia.de>', // Absender
    to,      // Empfänger
    subject, // Betreff
    text     // Inhalt
  });
}

// API-Route: Wird per POST aufgerufen, um Erinnerungs-Mails zu verschicken
export async function POST(request: Request) {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    // Fehler, wenn keine Datenbank-URL gesetzt ist
    return NextResponse.json(
      { success: false, message: "DATABASE_URL is not set" },
      { status: 500 }
    );
  }
  const sql = neon(databaseUrl); // Datenbank-Verbindung aufbauen

  // Suche alle Nutzer mit wichtigen, offenen Aufgaben, die in 24h fällig sind
  try {
    const usersWithTasks = await sql`
      SELECT DISTINCT u."UserID", u."Email"
      FROM "WebApp"."User" u
      JOIN "WebApp"."Task" t ON u."UserID" = t."UserID"
      WHERE t."Important" = true
        AND t."Checked" = false
        AND t."Date" <= CURRENT_DATE + INTERVAL '1 day'
        AND t."Date" >= CURRENT_DATE
    `;

    // Für jeden Nutzer: Aufgaben abfragen und ggf. E-Mail senden
    for (const user of usersWithTasks) {
      if (user.Email === "levin-lee.kipping@web.de") continue; // Diese Adresse überspringen
      // Hole alle wichtigen, offenen Aufgaben, die in 24h fällig sind
      const tasks = await sql`
        SELECT "Name", "Date" FROM "WebApp"."Task"
        WHERE "UserID" = ${user.UserID}
          AND "Important" = true
          AND "Checked" = false
          AND "Date" <= CURRENT_DATE + INTERVAL '1 day'
          AND "Date" >= CURRENT_DATE
      `;
      if (tasks.length > 0) {
        // Aufgabenliste als Text formatieren
        const taskList = tasks.map((t: any) => `- ${t.Name} (fällig am ${t.Date.toISOString().slice(0,10)})`).join("\n");
        const subject = "Wichtige Aufgaben fällig in 24h"; // Betreff
        const text = `Hallo,\n\nSie haben folgende wichtige Aufgaben, die innerhalb der nächsten 24 Stunden fällig sind und noch nicht erledigt wurden:\n\n${taskList}\n\nBitte erledigen Sie diese rechtzeitig!\n\nIhr Taskademia Team`;
        await sendMail(user.Email, subject, text); // E-Mail senden
      }
    }
    // Erfolgsmeldung zurückgeben
    return NextResponse.json({ success: true, message: "Benachrichtigungen verarbeitet." });
  } catch (error) {
    // Fehler beim Senden oder Datenbank
    console.error("Notify error:", error);
    return NextResponse.json(
      { success: false, message: "Fehler beim Benachrichtigen." },
      { status: 500 }
    );
  }
}
