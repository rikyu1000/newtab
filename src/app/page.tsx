"use client";

import { useEffect, useState } from "react";

const getCurrentTime = () => {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};

export default function Page() {
  const [time, setTime] = useState("--:--");

  useEffect(() => {
    setTime(getCurrentTime());

    const id = setInterval(() => {
      setTime(getCurrentTime());
    }, 10000);

    return () => clearInterval(id);
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#050505]">
      <div className="clock-container relative flex h-20 w-full max-w-3xl items-center justify-center border border-zinc-800/80 text-zinc-400">
        <div className="corner-accent top-0 left-0" />
        <div className="corner-accent top-0 right-0" />
        <div className="corner-accent bottom-0 left-0" />
        <div className="corner-accent bottom-0 right-0" />
        <span className="font-mono text-4xl tracking-tight">{time}</span>
      </div>
    </main>
  );
}

