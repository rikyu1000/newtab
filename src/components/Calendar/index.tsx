"use client";

import { useState, useEffect } from "react";
import CalendarAuth from "./CalendarAuth";
import EventList from "./EventList";

export default function Calendar() {
  const [token, setToken] = useState<string | null>(null);
  const [events, setEvents] = useState<any[]>([]);

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
      const data = await response.json();
      if (data.items) {
        setEvents(data.items);
      }
    } catch (error) {
      console.error("Failed to fetch events", error);
      // If error is 401, token might be expired
      if (error instanceof Error && error.message.includes("401")) {
        setToken(null);
        localStorage.removeItem("google_access_token");
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full mt-8 min-h-[120px]">
      {!token ? (
        <CalendarAuth onSuccess={handleAuthSuccess} />
      ) : (
        <EventList events={events} />
      )}
    </div>
  );
}
