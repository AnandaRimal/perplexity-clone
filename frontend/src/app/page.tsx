"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import SearchBar from "@/components/SearchBar";
import ThreadView from "@/components/ThreadView";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState<string | null>(null);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <main className="flex min-h-screen bg-zinc-900 text-zinc-100 font-sans">
      <Sidebar />
      <div className="flex-1 ml-[80px] flex flex-col h-screen overflow-hidden">
        {searchQuery ? (
          <ThreadView query={searchQuery} onSearch={handleSearch} />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-4 -mt-20">
            <h1 className="text-[2.5rem] font-serif font-medium text-zinc-300 mb-12 tracking-tight">perplexity</h1>
            <SearchBar onSearch={handleSearch} />
          </div>
        )}
      </div>
    </main>
  );
}
