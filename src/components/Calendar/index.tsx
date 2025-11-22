"use client";

import { useState, useEffect } from "react";
import Timeline from "./Timeline";
import CalendarAuth from "./CalendarAuth";

export default function Calendar() {
  const [token, setToken] = useState<string | null>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Restore token from local storage if available (optional, for persistence)
    const savedToken = localStorage.getItem("google_access_token");
    if (savedToken) {
      setToken(savedToken);
      fetchEvents(savedToken);
    }
  }, []);

  const handleAuthSuccess = (tokenResponse: any) => {
    setToken(tokenResponse.access_token);
    localStorage.setItem("google_access_token", tokenResponse.access_token);
    fetchEvents(tokenResponse.access_token);
  };

  const fetchEvents = async (accessToken: string) => {
    setLoading(true);
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    try {
      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${startOfDay.toISOString()}&timeMax=${endOfDay.toISOString()}&singleEvents=true&orderBy=startTime`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      if (data.items) {
        setEvents(data.items);
      } else {
        setEvents([]);
      }
    } catch (error) {
      console.error("Failed to fetch events", error);
      if (error instanceof Error && error.message.includes("401")) {
        setToken(null);
        localStorage.removeItem("google_access_token");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="w-full flex justify-center pb-12">
        <CalendarAuth onSuccess={handleAuthSuccess} />
      </div>
    );
  }

  return (
    <div className="w-full h-48 mt-auto">
      <Timeline events={events} />
    </div>
  );
}
