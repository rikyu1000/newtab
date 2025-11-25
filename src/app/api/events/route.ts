import { getGoogleAuthClient } from "@/lib/google";
import { google } from "googleapis";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export async function GET() {
  const refreshToken = cookies().get("google_refresh_token")?.value;

  if (!refreshToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const oauth2Client = getGoogleAuthClient();
    oauth2Client.setCredentials({ refresh_token: refreshToken });

    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    // Calculate start and end of day in JST (Asia/Tokyo)
    const now = new Date();
    const jstFormatter = new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Tokyo",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    const parts = jstFormatter.formatToParts(now);
    const year = parts.find((p) => p.type === "year")?.value;
    const month = parts.find((p) => p.type === "month")?.value;
    const day = parts.find((p) => p.type === "day")?.value;

    const startOfDay = new Date(`${year}-${month}-${day}T00:00:00+09:00`);
    const endOfDay = new Date(`${year}-${month}-${day}T23:59:59.999+09:00`);

    const response = await calendar.events.list({
      calendarId: "primary",
      timeMin: startOfDay.toISOString(),
      timeMax: endOfDay.toISOString(),
      singleEvents: true,
      orderBy: "startTime",
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Events fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}
