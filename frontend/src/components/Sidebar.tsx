"use client";

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home, Compass, LayoutGrid, User, ArrowUpRight, Download, Plus, LineChart, Bell, Globe, BookOpen, Trophy, Clock } from 'lucide-react';

export default function Sidebar() {
    const pathname = usePathname();
    const [isHomeHovered, setIsHomeHovered] = useState(false);
    const [isDiscoverHovered, setIsDiscoverHovered] = useState(false);

    const isActive = (path: string) => pathname === path;

    return (
        <aside className="fixed left-0 top-0 h-screen w-[80px] bg-[#202020] flex flex-col items-center py-4 z-50">
            <Link href="/" className="mb-6 flex flex-col items-center gap-1 ml-3 cursor-pointer">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo.jpg" alt="Perplexity Logo" className="w-16 h-16 object-contain rounded-lg" />
            </Link>

            <div className="mb-6 flex flex-col items-center gap-1 cursor-pointer group">
                <div className="p-2 rounded-full bg-zinc-800 group-hover:bg-zinc-700 transition-colors">
                    <Plus size={24} className="text-zinc-400 group-hover:text-white" />
                </div>
                <span className="text-[10px] text-zinc-500 font-medium">New</span>
            </div>

            <nav className="flex flex-col gap-2 w-full items-center">
                <div
                    className="relative flex flex-col items-center gap-1 cursor-pointer group w-full py-1"
                    onMouseEnter={() => setIsHomeHovered(true)}
                    onMouseLeave={() => setIsHomeHovered(false)}
                >
                    <Link href="/" className="flex flex-col items-center gap-1">
                        <div className={`p-1.5 rounded-full transition-colors ${isActive('/') ? 'bg-zinc-800 text-white' : 'bg-transparent text-zinc-500 group-hover:bg-zinc-800/50 group-hover:text-zinc-300'}`}>
                            <Home size={24} strokeWidth={1.5} className={isActive('/') ? 'text-white' : 'text-zinc-500 group-hover:text-zinc-300'} />
                        </div>
                        <span className={`text-[10px] font-medium ${isActive('/') ? 'text-white' : 'text-zinc-500 group-hover:text-zinc-300'}`}>Home</span>
                    </Link>

                    {/* Hover Menu */}
                    {isHomeHovered && (
                        <div className="fixed left-[80px] top-0 h-screen w-64 bg-[#202020] border-r border-zinc-800 shadow-xl p-4 z-50 flex flex-col gap-4">
                            {/* Home Section */}
                            <div className="mt-2">
                                <div className="flex items-center justify-between mb-2 px-2">
                                    <span className="text-sm font-medium text-zinc-200">Home</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <div className="flex items-center gap-3 p-2 hover:bg-zinc-800 rounded-md cursor-pointer text-zinc-400 hover:text-zinc-200 transition-colors">
                                        <Globe size={18} />
                                        <span className="text-sm">Travel</span>
                                    </div>
                                    <div className="flex items-center gap-3 p-2 hover:bg-zinc-800 rounded-md cursor-pointer text-zinc-400 hover:text-zinc-200 transition-colors">
                                        <BookOpen size={18} />
                                        <span className="text-sm">Academic</span>
                                    </div>
                                    <div className="flex items-center gap-3 p-2 hover:bg-zinc-800 rounded-md cursor-pointer text-zinc-400 hover:text-zinc-200 transition-colors">
                                        <Trophy size={18} />
                                        <span className="text-sm">Sports</span>
                                    </div>
                                </div>
                            </div>

                            <div className="h-px bg-zinc-800 w-full" />

                            {/* Library Section */}
                            <div className="flex-1 overflow-y-auto">
                                <div className="flex items-center justify-between mb-2 px-2">
                                    <span className="text-sm font-medium text-zinc-400">Library</span>
                                    <Plus size={16} className="text-zinc-500 cursor-pointer hover:text-zinc-300" />
                                </div>
                                <div className="flex flex-col gap-1">
                                    {[
                                        "cristianod ronaldo",
                                        "cristiando ronaldo",
                                        "ananda rimal",
                                        "i want ti study the top 20",
                                        "npl news today",
                                        "can you give me best old",
                                        "hello",
                                        "current tesla price"
                                    ].map((item, index) => (
                                        <div key={index} className="px-2 py-1.5 hover:bg-zinc-800 rounded-md cursor-pointer text-zinc-400 hover:text-zinc-200 transition-colors truncate text-sm">
                                            {item}
                                        </div>
                                    ))}
                                    <div className="px-2 py-1.5 text-xs text-zinc-500 hover:text-zinc-300 cursor-pointer mt-1">
                                        View All
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div
                    className="relative flex flex-col items-center gap-1 cursor-pointer group w-full py-1"
                    onMouseEnter={() => setIsDiscoverHovered(true)}
                    onMouseLeave={() => setIsDiscoverHovered(false)}
                >
                    <Link href="/discover" className="flex flex-col items-center gap-1">
                        <div className={`p-1.5 rounded-full transition-colors ${isActive('/discover') ? 'bg-zinc-800 text-white' : 'bg-transparent text-zinc-500 group-hover:bg-zinc-800/50 group-hover:text-zinc-300'}`}>
                            <Compass size={24} strokeWidth={1.5} className={isActive('/discover') ? 'text-white' : 'text-zinc-500 group-hover:text-zinc-300'} />
                        </div>
                        <span className={`text-[10px] font-medium ${isActive('/discover') ? 'text-white' : 'text-zinc-500 group-hover:text-zinc-300'}`}>Discover</span>
                    </Link>

                    {/* Discover Hover Menu */}
                    {isDiscoverHovered && (
                        <div className="fixed left-[80px] top-0 h-auto w-48 bg-[#202020] border border-zinc-800 shadow-xl p-2 z-50 flex flex-col gap-1 rounded-r-xl mt-[88px]">
                            <div className="flex items-center gap-3 p-2 hover:bg-zinc-800 rounded-md cursor-pointer text-zinc-400 hover:text-zinc-200 transition-colors">
                                <Compass size={18} />
                                <span className="text-sm">For You</span>
                            </div>
                            <div className="flex items-center gap-3 p-2 hover:bg-zinc-800 rounded-md cursor-pointer text-zinc-400 hover:text-zinc-200 transition-colors">
                                <Trophy size={18} />
                                <span className="text-sm">Top</span>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex flex-col items-center gap-1 cursor-pointer group">
                    <div className="p-1.5 rounded-full group-hover:bg-zinc-800/50 transition-colors">
                        <LayoutGrid size={24} strokeWidth={1.5} className="text-zinc-500 group-hover:text-zinc-300 transition-colors" />
                    </div>
                    <span className="text-[10px] text-zinc-500 group-hover:text-zinc-300 font-medium">Spaces</span>
                </div>

                <div className="flex flex-col items-center gap-1 cursor-pointer group">
                    <div className="p-1.5 rounded-full group-hover:bg-zinc-800/50 transition-colors">
                        <LineChart size={24} strokeWidth={1.5} className="text-zinc-500 group-hover:text-zinc-300 transition-colors" />
                    </div>
                    <span className="text-[10px] text-zinc-500 group-hover:text-zinc-300 font-medium">Finance</span>
                </div>


            </nav>

            <div className="flex-grow" />

            <div className="flex flex-col gap-3 w-full items-center pb-8">
                <div className="flex flex-col items-center gap-1 cursor-pointer group">
                    <Bell size={24} strokeWidth={1.5} className="text-zinc-500 group-hover:text-zinc-300 transition-colors" />
                </div>

                <div className="flex flex-col items-center gap-1 cursor-pointer group">
                    <User size={24} strokeWidth={1.5} className="text-zinc-500 group-hover:text-zinc-300 transition-colors" />
                    <span className="text-[10px] text-zinc-500 group-hover:text-zinc-300 font-medium">Account</span>
                </div>

                <div className="flex flex-col items-center gap-1 cursor-pointer group">
                    <ArrowUpRight size={24} strokeWidth={1.5} className="text-zinc-500 group-hover:text-zinc-300 transition-colors" />
                    <span className="text-[10px] text-zinc-500 group-hover:text-zinc-300 font-medium">Upgrade</span>
                </div>

                <div className="flex flex-col items-center gap-1 cursor-pointer group relative">
                    <div className="relative">
                        <Download size={24} strokeWidth={1.5} className="text-zinc-500 group-hover:text-zinc-300 transition-colors" />
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
                    </div>
                    <span className="text-[10px] text-zinc-500 group-hover:text-zinc-300 font-medium">Install</span>
                </div>
            </div>
        </aside>
    );
}
