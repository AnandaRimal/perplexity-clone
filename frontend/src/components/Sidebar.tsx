import React from 'react';
import { Home, Compass, LayoutGrid, User, ArrowUpRight, Download, Plus, LineChart, Bell } from 'lucide-react';

export default function Sidebar() {
    return (
        <aside className="fixed left-0 top-0 h-screen w-[80px] bg-[#202020] flex flex-col items-center py-4 z-50">
            <div className="mb-6 flex flex-col items-center gap-1 ml-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo.jpg" alt="Perplexity Logo" className="w-16 h-16 object-contain rounded-lg" />
            </div>

            <div className="mb-6 flex flex-col items-center gap-1 cursor-pointer group">
                <div className="p-2 rounded-full bg-zinc-800 group-hover:bg-zinc-700 transition-colors">
                    <Plus size={24} className="text-zinc-400 group-hover:text-white" />
                </div>
                <span className="text-[10px] text-zinc-500 font-medium">New</span>
            </div>

            <nav className="flex flex-col gap-2 w-full items-center">
                <div className="flex flex-col items-center gap-1 cursor-pointer group">
                    <div className="p-1.5 rounded-full bg-zinc-800/50 text-white">
                        <Home size={24} strokeWidth={1.5} />
                    </div>
                    <span className="text-[10px] text-white font-medium">Home</span>
                </div>

                <div className="flex flex-col items-center gap-1 cursor-pointer group">
                    <div className="p-1.5 rounded-full group-hover:bg-zinc-800/50 transition-colors">
                        <Compass size={24} strokeWidth={1.5} className="text-zinc-500 group-hover:text-zinc-300 transition-colors" />
                    </div>
                    <span className="text-[10px] text-zinc-500 group-hover:text-zinc-300 font-medium">Discover</span>
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
