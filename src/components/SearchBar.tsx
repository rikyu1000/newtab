"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

const SEARCH_URL = "https://www.google.com/search?q=";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isTyping =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable;

      if (!isTyping && event.key === "/") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      return;
    }

    window.location.href = `${SEARCH_URL}${encodeURIComponent(trimmedQuery)}`;
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-xl px-4 animate-fade-in-delay"
    >
      <label className="sr-only" htmlFor="search">
        Search
      </label>
      <div className="group flex items-center gap-3 rounded-full border border-zinc-800/80 bg-zinc-950/40 px-5 py-3 backdrop-blur-md transition-colors focus-within:border-cyan-500/60 hover:border-zinc-700">
        <span className="text-sm uppercase tracking-[0.35em] text-zinc-600 transition-colors group-focus-within:text-cyan-400">
          Search
        </span>
        <input
          id="search"
          ref={inputRef}
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Type and press Enter"
          className="w-full bg-transparent text-base text-zinc-100 outline-none placeholder:text-zinc-600"
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
        />
        <span className="hidden rounded-full border border-zinc-800 px-2 py-1 text-[10px] uppercase tracking-[0.3em] text-zinc-500 md:inline-block">
          /
        </span>
      </div>
    </form>
  );
}
