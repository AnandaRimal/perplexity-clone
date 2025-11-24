"use client";

import { useState, useRef, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import SearchBar from "@/components/SearchBar";
import ThreadView from "@/components/ThreadView";
import { ArrowUp } from "lucide-react";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState<string | null>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const scrollToTop = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (container.scrollTop > 200) {
        setShowScrollButton(true);
      } else {
        setShowScrollButton(false);
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main className="flex min-h-screen bg-zinc-900 text-zinc-100 font-sans">
      <Sidebar />
      <div
        ref={scrollContainerRef}
        className="flex-1 ml-[80px] flex flex-col h-screen overflow-y-auto relative scroll-smooth"
      >
        {searchQuery ? (
          <ThreadView query={searchQuery} onSearch={handleSearch} />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-4 -mt-20">
            <h1 className="text-[2.5rem] font-serif font-medium text-zinc-300 mb-12 tracking-tight">perplexity</h1>
            <SearchBar onSearch={handleSearch} />
          </div>
        )}

        {/* Scroll to Top Button */}
        <button
          onClick={scrollToTop}
          className={`fixed bottom-24 right-8 p-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 rounded-full shadow-lg border border-zinc-700/50 transition-all duration-300 z-50 ${showScrollButton ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
            }`}
          aria-label="Scroll to top"
        >
          <ArrowUp size={20} />
        </button>
      </div>
    </main>
  );
}
