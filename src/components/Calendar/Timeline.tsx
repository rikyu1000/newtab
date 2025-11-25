"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface CalendarEvent {
  id: string;
  summary: string;
  start: { dateTime?: string; date?: string };
  end: { dateTime?: string; date?: string };
}

interface TimelineProps {
  events: CalendarEvent[];
}

export default function Timeline({ events }: TimelineProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Helper to calculate percentage of day (0-100)
  const getDayPercentage = (date: Date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return ((hours * 60 + minutes) / (24 * 60)) * 100;
  };

  const currentPosition = getDayPercentage(currentTime);

  // Generate hour markers (every 1 hour)
  const hourMarkers = Array.from({ length: 25 }, (_, i) => i);

  return (
    <div className="w-full h-full relative bg-zinc-900/40 backdrop-blur-md border-t border-zinc-800/50">
      {/* Time Axis */}
      <div className="absolute inset-0 flex items-end pb-2 px-4">
        {hourMarkers.map((hour) => (
          <div
            key={hour}
            className="absolute bottom-0 flex flex-col items-center -translate-x-1/2"
            style={{ left: `${(hour / 24) * 100}%` }}
          >
            <div className="h-2 w-px bg-zinc-700" />
            <span className="text-[10px] text-zinc-500 mt-1 font-mono">
              {hour.toString().padStart(2, "0")}:00
            </span>
          </div>
        ))}
      </div>

      {/* Current Time Indicator */}
      <div
        className="absolute top-0 bottom-0 w-px bg-cyan-500 z-10 shadow-[0_0_8px_rgba(6,182,212,0.6)] -translate-x-1/2"
        style={{ left: `${currentPosition}%` }}
      >
        <div className="absolute -top-1 -left-1 w-2 h-2 rounded-full bg-cyan-500" />
      </div>

      {/* Events */}
      <div className="absolute inset-0 top-4 bottom-8 overflow-hidden">
        {events.map((event, index) => {
          if (!event.start.dateTime || !event.end.dateTime) return null; // Skip all-day events for now or handle differently

          const start = new Date(event.start.dateTime);
          const end = new Date(event.end.dateTime);

          const startPercent = getDayPercentage(start);
          const endPercent = getDayPercentage(end);
          const widthPercent = Math.max(endPercent - startPercent, 0.5); // Min width

          const isPast = end < currentTime;

          return (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{ opacity: isPast ? 0.4 : 1, scaleY: 1 }}
              transition={{ delay: index * 0.05 }}
              className={`absolute top-0 bottom-0 rounded-lg border border-zinc-700/50 bg-zinc-800/80 backdrop-blur-sm overflow-hidden group hover:z-20 hover:border-zinc-500 transition-colors cursor-default`}
              style={{
                left: `${startPercent}%`,
                width: `${widthPercent}%`,
                minWidth: "4px",
              }}
            >
              <div className="px-2 py-1 h-full flex flex-col justify-center">
                <span className="text-xs text-zinc-200 font-medium truncate block">
                  {event.summary}
                </span>
                <span className="text-[10px] text-zinc-400 font-mono truncate mt-1">
                  {start.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}{" "}
                  -{" "}
                  {end.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
