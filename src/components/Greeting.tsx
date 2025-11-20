"use client";

import { useState, useEffect } from "react";

export default function Greeting() {
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours();
      if (hour < 12) setGreeting("Good Morning KENTA");
      else if (hour < 18) setGreeting("Good Afternoon KENTA");
      else setGreeting("Good Evening KENTA");
    };

    updateGreeting();
    const interval = setInterval(updateGreeting, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-2xl font-light text-zinc-400 tracking-widest uppercase animate-fade-in-delay">
      {greeting}
    </div>
  );
}
