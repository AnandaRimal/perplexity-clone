"use client";

import React, { useEffect, useState } from 'react';
import { Compass, Star, LayoutGrid, ChevronDown, Cpu, DollarSign, Palette, Trophy, Tv } from 'lucide-react';

interface Article {
    title: string;
    url: string;
    content: string;
    score: number;
    raw_content: string | null;
}

interface DiscoverData {
    results: Article[];
    images: string[];
    last_updated?: number;
}

export default function DiscoverPage() {
    const [data, setData] = useState<DiscoverData | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('for_you');
    const [showTopicsDropdown, setShowTopicsDropdown] = useState(false);

    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
    const [isRefreshing, setIsRefreshing] = useState(false);

    useEffect(() => {
        const fetchData = async (isBackground = false) => {
            if (!isBackground) setLoading(true);
            else setIsRefreshing(true);

            try {
                // Add timestamp to prevent caching
                const res = await fetch(`http://localhost:8000/api/discover?category=${activeTab}&t=${new Date().getTime()}`);
                const json = await res.json();
                setData(json);
                if (json.last_updated) {
                    setLastUpdated(new Date(json.last_updated * 1000));
                } else {
                    setLastUpdated(new Date());
                }
            } catch (error) {
                console.error("Failed to fetch discover content", error);
            } finally {
                setLoading(false);
                setIsRefreshing(false);
            }
        };

        // Initial fetch
        fetchData();

        // Auto-refresh every 60 seconds
        const intervalId = setInterval(() => {
            if (document.visibilityState === 'visible') {
                fetchData(true);
            }
        }, 60000);

        // Refresh when tab becomes visible if it was backgrounded
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                fetchData(true);
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            clearInterval(intervalId);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [activeTab]);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-[#191919] text-zinc-400">
                Loading Discover...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#191919] text-zinc-200 pl-[80px]">
            <div className="max-w-6xl mx-auto p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <h1 className="text-3xl font-serif">Discover</h1>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setActiveTab('for_you')}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-colors ${activeTab === 'for_you' ? 'bg-zinc-800 text-cyan-400 border border-cyan-900/30' : 'hover:bg-zinc-800 text-zinc-400'}`}
                            >
                                <Compass size={16} />
                                <span>For You</span>
                            </button>
                            <button
                                onClick={() => setActiveTab('top')}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-colors ${activeTab === 'top' ? 'bg-zinc-800 text-cyan-400 border border-cyan-900/30' : 'hover:bg-zinc-800 text-zinc-400'}`}
                            >
                                <Star size={16} />
                                <span>Top</span>
                            </button>
                            <div className="relative">
                                <button
                                    onClick={() => setShowTopicsDropdown(!showTopicsDropdown)}
                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-colors ${['tech_science', 'finance', 'arts_culture', 'sports', 'entertainment'].includes(activeTab) ? 'bg-zinc-800 text-cyan-400 border border-cyan-900/30' : 'hover:bg-zinc-800 text-zinc-400'}`}
                                >
                                    <LayoutGrid size={16} />
                                    <span>Topics</span>
                                    <ChevronDown size={14} className={`transition-transform ${showTopicsDropdown ? 'rotate-180' : ''}`} />
                                </button>

                                {showTopicsDropdown && (
                                    <div className="absolute top-full left-0 mt-2 w-48 bg-[#191919] border border-zinc-800 rounded-xl shadow-xl z-50 py-1 overflow-hidden">
                                        <button
                                            onClick={() => { setActiveTab('tech_science'); setShowTopicsDropdown(false); }}
                                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-300 hover:bg-zinc-800/50 transition-colors text-left"
                                        >
                                            <Cpu size={16} />
                                            <span>Tech & Science</span>
                                        </button>
                                        <button
                                            onClick={() => { setActiveTab('finance'); setShowTopicsDropdown(false); }}
                                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-300 hover:bg-zinc-800/50 transition-colors text-left"
                                        >
                                            <DollarSign size={16} />
                                            <span>Finance</span>
                                        </button>
                                        <button
                                            onClick={() => { setActiveTab('arts_culture'); setShowTopicsDropdown(false); }}
                                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-300 hover:bg-zinc-800/50 transition-colors text-left"
                                        >
                                            <Palette size={16} />
                                            <span>Arts & Culture</span>
                                        </button>
                                        <button
                                            onClick={() => { setActiveTab('sports'); setShowTopicsDropdown(false); }}
                                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-300 hover:bg-zinc-800/50 transition-colors text-left"
                                        >
                                            <Trophy size={16} />
                                            <span>Sports</span>
                                        </button>
                                        <button
                                            onClick={() => { setActiveTab('entertainment'); setShowTopicsDropdown(false); }}
                                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-300 hover:bg-zinc-800/50 transition-colors text-left"
                                        >
                                            <Tv size={16} />
                                            <span>Entertainment</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Last updated indicator */}
                    <div className="flex items-center gap-4">
                        {lastUpdated && (
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-zinc-500">
                                    Last updated: {lastUpdated.toLocaleTimeString()}
                                </span>
                                {isRefreshing && (
                                    <div className="w-3 h-3 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Featured Article (First item) - Spans 2 columns */}
                    {data?.results && data.results.length > 0 && (
                        <a
                            href={data.results[0].url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="md:col-span-2 relative group overflow-hidden rounded-xl bg-zinc-900 border border-zinc-800/50 flex flex-col md:flex-row hover:border-zinc-700 transition-colors"
                        >
                            <div className="p-6 flex-1 flex flex-col justify-center">
                                <div className="flex items-center gap-2 mb-3">
                                    {data.images && data.images[0] && (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={data.images[0]} alt="Source" className="w-4 h-4 rounded-full object-cover" />
                                    )}
                                    <span className="text-xs text-zinc-400">{new URL(data.results[0].url).hostname.replace('www.', '')}</span>
                                    <span className="text-xs text-zinc-600">•</span>
                                    <span className="text-xs text-zinc-500">Just now</span>
                                </div>
                                <h2 className="text-2xl font-serif font-medium text-zinc-100 mb-3 line-clamp-3 group-hover:text-cyan-400 transition-colors">
                                    {data.results[0].title}
                                </h2>
                                <p className="text-zinc-400 text-sm line-clamp-3 mb-4">
                                    {data.results[0].content}
                                </p>
                                <div className="flex gap-4 mt-auto">
                                    <div className="text-zinc-500 hover:text-zinc-300 transition-colors">
                                        <LayoutGrid size={18} />
                                    </div>
                                    <div className="text-zinc-500 hover:text-zinc-300 transition-colors">
                                        <Star size={18} />
                                    </div>
                                </div>
                            </div>
                            {
                                data.images && data.images[0] && (
                                    <div className="w-full md:w-2/5 h-64 md:h-auto relative">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={data.images[0]}
                                            alt="Featured"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                )
                            }
                        </a >
                    )
                    }

                    {/* Right Column Widgets */}
                    <div className="space-y-6">
                        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-medium text-zinc-200">Make it yours</h3>
                                    <p className="text-xs text-zinc-500 mt-1">Select topics and interests to customize your Discover experience</p>
                                </div>
                                <button className="text-zinc-500 hover:text-zinc-300">×</button>
                            </div>
                            <div className="flex flex-wrap gap-2 mb-4">
                                {['Tech & Science', 'Finance', 'Arts & Culture', 'Sports', 'Entertainment'].map(tag => (
                                    <span key={tag} className="px-2 py-1 bg-zinc-800 rounded-md text-xs text-zinc-400 border border-zinc-700">{tag}</span>
                                ))}
                            </div>
                            <button className="w-full py-2 bg-cyan-900/20 text-cyan-400 rounded-md text-sm font-medium hover:bg-cyan-900/30 transition-colors">
                                Save Interests
                            </button>
                        </div>
                    </div>

                    {/* Remaining Articles Grid */}
                    {
                        data?.results?.slice(1).map((article, idx) => (
                            <a
                                key={idx}
                                href={article.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-zinc-900/30 border border-zinc-800/50 rounded-xl overflow-hidden hover:bg-zinc-900/50 transition-colors flex flex-col h-full group"
                            >
                                {/* Image on top */}
                                {data.images && data.images[idx + 1] && (
                                    <div className="h-40 w-full overflow-hidden">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={data.images[idx + 1]}
                                            alt={article.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                )}
                                <div className="p-4 flex-1 flex flex-col">
                                    <div className="flex items-center gap-2 mb-2">
                                        {data.images && data.images[idx + 1] && (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img src={data.images[idx + 1]} alt="Source" className="w-3 h-3 rounded-full object-cover" />
                                        )}
                                        <span className="text-[10px] text-zinc-400 truncate">{new URL(article.url).hostname.replace('www.', '')}</span>
                                        <span className="text-[10px] text-zinc-600">•</span>
                                        <span className="text-[10px] text-zinc-500">2h ago</span>
                                    </div>
                                    <h3 className="text-base font-medium text-zinc-200 mb-2 line-clamp-2 leading-snug group-hover:text-cyan-400 transition-colors">{article.title}</h3>
                                    <p className="text-xs text-zinc-400 line-clamp-2 mb-3 flex-1">{article.content}</p>

                                    <div className="flex items-center justify-between mt-auto pt-2 border-t border-zinc-800/50">
                                        <div className="flex gap-3">
                                            <div className="text-zinc-600 hover:text-zinc-400"><LayoutGrid size={14} /></div>
                                            <div className="text-zinc-600 hover:text-zinc-400"><Star size={14} /></div>
                                        </div>
                                        <div className="text-zinc-600 hover:text-zinc-400">
                                            <Compass size={14} />
                                        </div>
                                    </div>
                                </div>
                            </a>
                        ))
                    }
                </div >
            </div >
        </div >
    );
}
