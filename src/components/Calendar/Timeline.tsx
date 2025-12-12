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
      <div className="absolute inset-0 top-4 bottom-8">
        {events.map((event, index) => {
          if (!event.start.dateTime || !event.end.dateTime) return null; // Skip all-day events for now or handle differently

          const start = new Date(event.start.dateTime);
          const end = new Date(event.end.dateTime);

          const startPercent = getDayPercentage(start);
          const endPercent = getDayPercentage(end);
          const widthPercent = Math.max(endPercent - startPercent, 0.5); // Min width
          const isPast = end < currentTime;

          const durationMinutes =
            (end.getTime() - start.getTime()) / (1000 * 60);
          const isShort = durationMinutes < 45;
          const isVeryShort = durationMinutes < 30;

          const titleSize = isVeryShort ? "text-[10px]" : "text-xs";
          const paddingX = isVeryShort ? "px-1" : "px-2";

          return (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{ opacity: isPast ? 0.4 : 1, scaleY: 1 }}
              transition={{ delay: index * 0.05 }}
              className={`absolute top-0 bottom-0 rounded-lg border border-zinc-700/50 bg-zinc-800/80 backdrop-blur-sm group hover:z-20 hover:border-zinc-500 transition-colors cursor-default`}
              style={{
                left: `${startPercent}%`,
                width: `${widthPercent}%`,
                minWidth: "4px",
              }}
            >
              <div
                className={`${paddingX} py-1 h-full flex flex-col justify-center relative`}
              >
                <span
                  className={`${titleSize} text-zinc-200 font-medium truncate block`}
                >
                  {event.summary}
                </span>
                {!isShort && (
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
                )}

                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-[200px] bg-zinc-900/95 backdrop-blur-md border border-zinc-700 rounded-md p-2 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                  <div className="text-xs font-bold text-zinc-100 mb-0.5 whitespace-normal break-words text-center">
                    {event.summary}
                  </div>
                  <div className="text-[10px] text-zinc-400 font-mono text-center">
                    {start.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}{" "}
                    -{" "}
                    {end.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                  {/* Arrow */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-zinc-700" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
