import { google } from "googleapis";

export const getGoogleAuthClient = () => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const urlWithProtocol = baseUrl.startsWith("http")
    ? baseUrl
    : `https://${baseUrl}`;

  const cleanUrl = urlWithProtocol.replace(/\/$/, "");

  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${cleanUrl}/api/auth/callback`
  );
};
