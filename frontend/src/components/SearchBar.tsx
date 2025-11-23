"use client";

import React, { useState, useRef } from 'react';
import { ArrowRight, Paperclip, Globe, Mic, Search, Cpu, Layers, Lightbulb, AudioLines } from 'lucide-react';

interface SearchBarProps {
    onSearch: (query: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
    const [query, setQuery] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setQuery(e.target.value);
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (query.trim()) {
                onSearch(query);
            }
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto px-4">
            <div className="relative bg-[#202020] border border-[#333] rounded-xl p-2 shadow-lg transition-all focus-within:border-zinc-600">
                <textarea
                    ref={textareaRef}
                    className="w-full bg-transparent text-zinc-200 placeholder-zinc-500 text-lg resize-none focus:outline-none min-h-[44px] max-h-[200px] overflow-y-auto custom-scrollbar"
                    placeholder="Ask anything. Type @ for mentions."
                    value={query}
                    onChange={handleInput}
                    onKeyDown={handleKeyDown}
                    rows={1}
                />

                <div className="flex items-center justify-between mt-2 pt-2">
                    <div className="flex items-center gap-2">
                        <button className="flex items-center justify-center w-8 h-8 rounded-lg bg-teal-500/10 text-teal-500 hover:bg-teal-500/20 transition-colors border border-teal-500/20">
                            <Search size={16} />
                        </button>
                        <button className="flex items-center justify-center w-8 h-8 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-colors">
                            <Layers size={16} />
                        </button>
                        <button className="flex items-center justify-center w-8 h-8 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-colors">
                            <Lightbulb size={16} />
                        </button>
                    </div>

                    <div className="flex items-center gap-2">
                        <button className="flex items-center justify-center w-8 h-8 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-colors">
                            <Globe size={16} />
                        </button>
                        <button className="flex items-center justify-center w-8 h-8 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-colors">
                            <Cpu size={16} />
                        </button>
                        <button className="flex items-center justify-center w-8 h-8 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-colors">
                            <Paperclip size={16} />
                        </button>
                        <button className="flex items-center justify-center w-8 h-8 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-colors">
                            <Mic size={16} />
                        </button>
                        {query.trim() ? (
                            <button
                                className="flex items-center justify-center w-8 h-8 rounded-lg bg-teal-500 text-white shadow-[0_0_15px_rgba(20,184,166,0.3)] hover:bg-teal-400 transition-all duration-200 ml-2"
                                onClick={() => onSearch(query)}
                            >
                                <ArrowRight size={18} />
                            </button>
                        ) : (
                            <button className="flex items-center justify-center w-8 h-8 rounded-lg bg-teal-500 text-zinc-900 hover:bg-teal-400 transition-colors ml-2">
                                <AudioLines size={16} />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
