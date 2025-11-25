"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LinkItem {
  id: string;
  title: string;
  url: string;
  clicks: number;
}

const DEFAULT_LINKS: LinkItem[] = [
  { id: "1", title: "Google", url: "https://google.com", clicks: 0 },
  { id: "2", title: "YouTube", url: "https://youtube.com", clicks: 0 },
  { id: "3", title: "X", url: "https://x.com", clicks: 0 },
  { id: "4", title: "GitHub", url: "https://github.com", clicks: 0 },
  { id: "5", title: "Gmail", url: "https://mail.google.com", clicks: 0 },
  { id: "6", title: "ChatGPT", url: "https://chat.openai.com", clicks: 0 },
];

export default function QuickLinks() {
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("quick_links");
    if (saved) {
      setLinks(JSON.parse(saved));
    } else {
      setLinks(DEFAULT_LINKS);
    }
  }, []);

  const saveLinks = (newLinks: LinkItem[]) => {
    setLinks(newLinks);
    localStorage.setItem("quick_links", JSON.stringify(newLinks));
  };

  const handleLinkClick = (id: string) => {
    const updated = links.map((link) =>
      link.id === id ? { ...link, clicks: link.clicks + 1 } : link
    );
    // Sort by clicks desc
    updated.sort((a, b) => b.clicks - a.clicks);
    saveLinks(updated);
  };

  const addNewLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newUrl) return;

    const newItem: LinkItem = {
      id: Date.now().toString(),
      title: newTitle,
      url: newUrl.startsWith("http") ? newUrl : `https://${newUrl}`,
      clicks: 0,
    };

    const updated = [...links, newItem];
    saveLinks(updated);
    setNewTitle("");
    setNewUrl("");
    setIsAdding(false);
  };

  const deleteLink = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    e.preventDefault();
    if (confirm("Remove this link?")) {
      const updated = links.filter((l) => l.id !== id);
      saveLinks(updated);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in input
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }

      if (e.key === "ArrowRight") {
        setSelectedIndex((prev) => {
          if (prev === null) return 0;
          return Math.min(prev + 1, links.length - 1);
        });
      } else if (e.key === "ArrowLeft") {
        setSelectedIndex((prev) => {
          if (prev === null) return 0;
          return Math.max(prev - 1, 0);
        });
      } else if (e.key === "Enter" && selectedIndex !== null) {
        const link = links[selectedIndex];
        if (link) {
          handleLinkClick(link.id);
          window.location.href = link.url;
        }
      } else if (e.key === "Escape") {
        setSelectedIndex(null);
      } else {
        // Reset selection on other keys or clicks
        // setSelectedIndex(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [links, selectedIndex]);

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-2xl mx-auto mt-8 mb-8 z-10">
      <div className="flex flex-wrap justify-center gap-x-8 gap-y-3">
        <AnimatePresence mode="popLayout">
          {links.map((link, index) => (
            <motion.div
              key={link.id}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="group relative"
            >
              <a
                href={link.url}
                onClick={() => handleLinkClick(link.id)}
                className={`transition-colors text-sm tracking-wider uppercase font-light flex items-center gap-2 ${
                  selectedIndex === index
                    ? "text-cyan-400 font-normal scale-110"
                    : "text-zinc-500 hover:text-zinc-200"
                }`}
              >
                {selectedIndex === index && (
                  <motion.span
                    layoutId="cursor"
                    className="absolute -left-3 text-cyan-500"
                  >
                    ›
                  </motion.span>
                )}
                {link.title}
              </a>
              {/* Delete button (visible on hover) */}
              <button
                onClick={(e) => deleteLink(e, link.id)}
                className="absolute -right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 text-zinc-700 hover:text-red-400 transition-all text-xs px-1"
                title="Remove"
              >
                ×
              </button>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Add Button */}
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="text-zinc-700 hover:text-zinc-500 transition-colors text-sm"
          title="Add Link"
        >
          +
        </button>
      </div>

      {/* Add Link Form */}
      <AnimatePresence>
        {isAdding && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={addNewLink}
            className="flex gap-2 items-center bg-zinc-900/50 p-2 rounded-lg border border-zinc-800 backdrop-blur-sm overflow-hidden"
          >
            <input
              type="text"
              placeholder="Name"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="bg-transparent border-none text-zinc-300 placeholder-zinc-600 text-sm focus:ring-0 w-24"
              autoFocus
            />
            <div className="w-px h-4 bg-zinc-700" />
            <input
              type="text"
              placeholder="URL"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              className="bg-transparent border-none text-zinc-300 placeholder-zinc-600 text-sm focus:ring-0 w-48"
            />
            <button
              type="submit"
              className="text-cyan-500 hover:text-cyan-400 text-xs uppercase font-bold px-2"
            >
              Add
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
