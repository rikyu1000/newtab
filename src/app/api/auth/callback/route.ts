import { getGoogleAuthClient } from "@/lib/google";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.json({ error: "No code provided" }, { status: 400 });
  }

  try {
    const oauth2Client = getGoogleAuthClient();
    const { tokens } = await oauth2Client.getToken(code);

    if (tokens.refresh_token) {
      cookies().set("google_refresh_token", tokens.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 365, // 1 year
      });
    }

    return NextResponse.redirect(new URL("/", request.url));
  } catch (error: any) {
    console.error("Auth error:", error);
    const envCheck = {
      hasClientId: !!process.env.GOOGLE_CLIENT_ID,
      hasClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
      baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
    };
    return NextResponse.json(
      {
        error: "Auth Failed v3",
        details: String(error),
        envCheck,
      },
      { status: 500 }
    );
  }
}
