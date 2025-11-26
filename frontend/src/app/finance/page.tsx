"use client";

import React, { useEffect, useState } from 'react';
import { Search, Bell, Share2, Plus, MoreHorizontal, ArrowUpRight, ArrowDownRight, RefreshCw } from 'lucide-react';

interface SearchResult {
    title: string;
    url: string;
    content: string;
    score: number;
}

interface PoliticianTransaction {
    name: string;
    party: string;
    state: string;
    ticker: string;
    ticker_name: string;
    type: string;
    owner: string;
    date: string;
    filed_after: string;
    amount: string;
    image: string;
}

interface FinanceData {
    indices: SearchResult[];
    market_summary: SearchResult[];
    gainers: SearchResult[];
    screener_results?: SearchResult[];
    transactions?: PoliticianTransaction[];
    type?: 'standard' | 'crypto' | 'earnings' | 'screener' | 'politicians';
}

export default function FinancePage() {
    const [data, setData] = useState<FinanceData | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('US Markets');
    const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const tabs = [
        { name: 'US Markets', id: 'us_markets' },
        { name: 'Crypto', id: 'crypto' },
        { name: 'Earnings', id: 'earnings' },
        { name: 'Screener', id: 'screener' },
        { name: 'Politicians', id: 'politicians' }
    ];

    const fetchData = async (showLoader: boolean = true) => {
        if (showLoader) {
            setLoading(true);
        } else {
            setIsRefreshing(true);
        }

        try {
            const currentTabId = tabs.find(t => t.name === activeTab)?.id || 'us_markets';
            const response = await fetch(`http://localhost:8000/api/finance?category=${currentTabId}`);
            const result = await response.json();
            setData(result);
            setLastUpdate(new Date());
        } catch (error) {
            console.error("Error fetching finance data:", error);
        } finally {
            setLoading(false);
            setIsRefreshing(false);
        }
    };

    // Initial fetch and tab change
    useEffect(() => {
        fetchData(true);
    }, [activeTab]);

    // Auto-refresh every 60 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            // Only refresh if page is visible
            if (document.visibilityState === 'visible') {
                fetchData(false);
            }
        }, 60000); // 60 seconds

        return () => clearInterval(interval);
    }, [activeTab]);

    const handleManualRefresh = () => {
        fetchData(false);
    };

    const getTimeAgo = (date: Date | null) => {
        if (!date) return 'Never';
        const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
        if (seconds < 60) return 'Just now';
        const minutes = Math.floor(seconds / 60);
        if (minutes === 1) return '1 minute ago';
        return `${minutes} minutes ago`;
    };

    return (
        <div className="flex h-screen bg-[#191919] text-zinc-200 overflow-hidden">
            {/* Main Content */}
            <main className="flex-1 flex flex-col h-full overflow-y-auto ml-[80px]">
                {/* Header */}
                <header className="flex items-center justify-between px-8 py-4 border-b border-zinc-800/50 sticky top-0 bg-[#191919] z-10">
                    <div className="flex items-center gap-4 text-sm text-zinc-400">
                        <div className="flex items-center gap-2">
                            <span className="font-medium text-zinc-200">Perplexity Finance</span>
                            <span className="text-zinc-600">›</span>
                            <span>{activeTab}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                            <div className={`w-2 h-2 rounded-full ${isRefreshing ? 'bg-cyan-500 animate-pulse' : 'bg-green-500'}`}></div>
                            <span className="text-zinc-500">Updated {getTimeAgo(lastUpdate)}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                            <input
                                type="text"
                                placeholder="Search for stocks, crypto, and more..."
                                className="w-full bg-[#202020] border border-zinc-800 rounded-full py-2 pl-10 pr-4 text-sm text-zinc-200 focus:outline-none focus:border-zinc-700"
                            />
                        </div>
                        <button
                            onClick={handleManualRefresh}
                            disabled={isRefreshing}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-zinc-700 hover:bg-zinc-800 text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
                            Refresh
                        </button>
                        <button className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-zinc-700 hover:bg-zinc-800 text-xs font-medium transition-colors">
                            <Bell size={14} />
                            Price Alert
                        </button>
                        <button className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-zinc-700 hover:bg-zinc-800 text-xs font-medium transition-colors">
                            <Share2 size={14} />
                            Share
                        </button>
                    </div>
                </header>

                <div className="p-8 max-w-[1600px] mx-auto w-full">
                    {/* Tabs */}
                    <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
                        {tabs.map((tab) => (
                            <button
                                key={tab.name}
                                onClick={() => setActiveTab(tab.name)}
                                className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${activeTab === tab.name ? 'bg-zinc-800 text-cyan-400 border border-zinc-700' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'}`}
                            >
                                {tab.name}
                            </button>
                        ))}
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center h-64">
                            <RefreshCw className="animate-spin text-zinc-500" />
                        </div>
                    ) : (
                        <>
                            {data?.type === 'crypto' ? (
                                // Crypto View
                                <div className="flex flex-col gap-6">
                                    {/* Top Cards */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                        {['Bitcoin', 'Ethereum', 'Solana', 'Coin 50'].map((coin, i) => (
                                            <div key={i} className="bg-[#202020] p-4 rounded-xl border border-zinc-800/50 hover:border-zinc-700 transition-colors">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <h3 className="font-medium text-zinc-200">{coin}</h3>
                                                        <span className="text-xs text-zinc-500 uppercase">{coin.substring(0, 3)}USD • CRYPTO</span>
                                                    </div>
                                                    <span className="text-xs text-red-400 bg-red-400/10 px-1.5 py-0.5 rounded flex items-center gap-1">
                                                        <ArrowDownRight size={12} />
                                                        0.69%
                                                    </span>
                                                </div>
                                                <div className="text-2xl font-semibold text-zinc-100 mb-1">
                                                    ${(Math.random() * 50000 + 1000).toFixed(2)}
                                                </div>
                                                {/* Sparkline Placeholder */}
                                                <div className="h-8 w-full bg-gradient-to-r from-transparent via-red-500/20 to-transparent relative overflow-hidden rounded-sm">
                                                    <svg className="absolute bottom-0 left-0 w-full h-full" preserveAspectRatio="none">
                                                        <path d="M0,30 Q20,5 40,25 T80,15 T120,20 T160,5 V32 H0 Z" fill="none" stroke="#ef4444" strokeWidth="2" />
                                                    </svg>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                        {/* Leaderboard Table */}
                                        <div className="lg:col-span-2 bg-[#202020] rounded-xl border border-zinc-800/50 overflow-hidden">
                                            <div className="p-4 border-b border-zinc-800/50 flex items-center justify-between">
                                                <div>
                                                    <h3 className="font-medium text-zinc-200">Leaderboard</h3>
                                                    <p className="text-xs text-zinc-500">Data from spot transactions on Coinbase</p>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-zinc-400 bg-zinc-800 px-2 py-1 rounded-md cursor-pointer">
                                                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                                    Coinbase
                                                </div>
                                            </div>
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-sm text-left">
                                                    <thead className="text-xs text-zinc-500 border-b border-zinc-800/50">
                                                        <tr>
                                                            <th className="px-4 py-3 font-medium">Name</th>
                                                            <th className="px-4 py-3 font-medium text-right">Vol 24H</th>
                                                            <th className="px-4 py-3 font-medium text-right">Vol Chg 24H</th>
                                                            <th className="px-4 py-3 font-medium text-right">Price</th>
                                                            <th className="px-4 py-3 font-medium text-right">Price Chg 24H</th>
                                                            <th className="px-4 py-3 font-medium text-right">Funding Rate</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {['Bitcoin', 'Ethereum', 'XRP', 'Monad', 'Solana'].map((coin, i) => (
                                                            <tr key={i} className="border-b border-zinc-800/50 hover:bg-zinc-800/50 transition-colors">
                                                                <td className="px-4 py-3">
                                                                    <div className="flex items-center gap-3">
                                                                        <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center text-xs font-bold text-zinc-300">
                                                                            {coin[0]}
                                                                        </div>
                                                                        <div>
                                                                            <div className="font-medium text-zinc-200">{coin}</div>
                                                                            <div className="text-xs text-zinc-500 uppercase">{coin.substring(0, 3)}USD</div>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td className="px-4 py-3 text-right text-zinc-300">$1.1B</td>
                                                                <td className="px-4 py-3 text-right text-cyan-400">13.98%</td>
                                                                <td className="px-4 py-3 text-right text-zinc-300">$88K</td>
                                                                <td className="px-4 py-3 text-right text-cyan-400">2.02%</td>
                                                                <td className="px-4 py-3 text-right text-cyan-400">0%</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div className="p-4 border-t border-zinc-800/50">
                                                <div className="relative">
                                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                                                    <input
                                                        type="text"
                                                        placeholder="Ask anything about crypto"
                                                        className="w-full bg-[#191919] border border-zinc-800 rounded-lg py-3 pl-10 pr-4 text-sm text-zinc-200 focus:outline-none focus:border-zinc-700"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right Sidebar - Watchlist/Sectors */}
                                        <div className="space-y-6">
                                            {/* Watchlist (Same as before) */}
                                            <div className="bg-[#202020] rounded-xl border border-zinc-800/50 overflow-hidden">
                                                <div className="p-4 border-b border-zinc-800/50 flex items-center justify-between">
                                                    <h3 className="font-medium text-zinc-200">Create Watchlist</h3>
                                                    <MoreHorizontal size={16} className="text-zinc-500" />
                                                </div>
                                                <div className="p-2">
                                                    {['Realty Income', 'Meta Platforms', 'NVIDIA Corp', 'Alphabet Inc', 'Apple Inc'].map((stock, i) => (
                                                        <div key={i} className="flex items-center justify-between p-3 hover:bg-zinc-800 rounded-lg cursor-pointer group">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-8 h-8 rounded bg-zinc-700 flex items-center justify-center text-xs font-bold text-zinc-300">
                                                                    {stock[0]}
                                                                </div>
                                                                <div>
                                                                    <div className="text-sm font-medium text-zinc-200 truncate w-24">{stock}</div>
                                                                    <div className="text-xs text-zinc-500">NASDAQ</div>
                                                                </div>
                                                            </div>
                                                            <div className="text-right">
                                                                <div className="text-sm font-medium text-zinc-200">$123.45</div>
                                                                <div className="text-xs text-green-400">+1.2%</div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Equity Sectors */}
                                            <div className="bg-[#202020] rounded-xl border border-zinc-800/50 overflow-hidden">
                                                <div className="p-4 border-b border-zinc-800/50">
                                                    <h3 className="font-medium text-zinc-200">Equity Sectors</h3>
                                                </div>
                                                <div className="p-2">
                                                    {['Technology', 'Energy', 'Discretionary', 'Staples', 'Communications', 'Industrials', 'Financials', 'Utilities'].map((sector, i) => (
                                                        <div key={i} className="flex items-center justify-between p-3 hover:bg-zinc-800 rounded-lg cursor-pointer">
                                                            <span className="text-sm text-zinc-300">{sector}</span>
                                                            <div className="flex items-center gap-4">
                                                                <span className="text-sm text-zinc-400">$279.71</span>
                                                                <span className={`text-xs px-1.5 py-0.5 rounded ${i % 2 === 0 ? 'bg-green-400/10 text-green-400' : 'bg-red-400/10 text-red-400'}`}>
                                                                    {i % 2 === 0 ? '↗ 2.38%' : '↘ 0.28%'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : data?.type === 'earnings' ? (
                                // Earnings View
                                <div className="flex flex-col gap-6">
                                    {/* Earnings Calendar */}
                                    <div className="flex items-center justify-between mb-2">
                                        <h2 className="text-zinc-400 font-medium">Earnings Calendar</h2>
                                        <div className="flex items-center gap-2">
                                            <button className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400"><Search size={16} /></button>
                                            <button className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400">{'<'}</button>
                                            <button className="px-3 py-1 rounded bg-zinc-800 text-zinc-200 text-sm font-medium">Today</button>
                                            <button className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400">{'>'}</button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-7 gap-2 mb-6">
                                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => {
                                            const date = new Date();
                                            date.setDate(date.getDate() - date.getDay() + i);
                                            const isToday = i === new Date().getDay();

                                            return (
                                                <div key={day} className={`flex flex-col items-center p-3 rounded-xl border ${isToday ? 'bg-zinc-800/50 border-cyan-500/50' : 'bg-[#202020] border-zinc-800/50'}`}>
                                                    <span className="text-xs text-zinc-500 mb-1">{day}</span>
                                                    <span className={`text-sm font-medium mb-2 ${isToday ? 'text-cyan-400' : 'text-zinc-200'}`}>
                                                        {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                    </span>
                                                    <div className="flex items-center gap-1">
                                                        {i % 3 === 0 ? (
                                                            <span className="text-[10px] text-zinc-500">No Calls</span>
                                                        ) : (
                                                            <div className="flex -space-x-1">
                                                                <div className="w-3 h-3 rounded-full bg-red-500 border border-[#202020]" />
                                                                <div className="w-3 h-3 rounded-full bg-yellow-500 border border-[#202020]" />
                                                                <div className="w-3 h-3 rounded-full bg-blue-500 border border-[#202020]" />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                        {/* Earnings List */}
                                        <div className="lg:col-span-2 space-y-4">
                                            {/* Placeholder Data for Earnings Reports */}
                                            {[
                                                { name: 'Alibaba Group Holding Limited', ticker: 'BABA', quarter: "Q2 '26", summary: "Alibaba reported 15% year-over-year revenue growth, with China e-commerce up 10% and cloud intelligence revenue rising 34%. AI-driven cloud demand accelerated external customer growth by 29%." },
                                                { name: 'NIO Inc.', ticker: 'NIO', quarter: "Q3 '25", summary: "Nio delivered 87,071 EVs in Q3 2025 (up 40.8% YoY), with Q4 delivery guidance of 120,000–125,000 units. Q3 revenue was 21.8B RMB (+16.7% YoY), vehicle margin rose to 14.7%." },
                                                { name: 'Atour Lifestyle Holdings Limited', ticker: 'ATAT', quarter: "Q3 '25", summary: "Atour reported Q3 2025 net revenue up 38.4% YoY to RMB 2.63B, driven by hotel network expansion and 76.4% YoY retail growth. Adjusted net income rose 27% YoY to RMB 488M." }
                                            ].map((company, i) => (
                                                <div key={i} className="bg-[#202020] p-5 rounded-xl border border-zinc-800/50 hover:border-zinc-700 transition-colors">
                                                    <div className="flex items-center justify-between mb-3">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded bg-orange-500 flex items-center justify-center text-white font-bold text-lg">
                                                                {company.ticker[0]}
                                                            </div>
                                                            <div>
                                                                <div className="font-medium text-zinc-200">{company.name}</div>
                                                                <div className="text-xs text-zinc-500">{company.ticker}</div>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-xs font-medium text-zinc-400">{company.quarter}</span>
                                                            <span className="text-[10px] font-bold bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded-full flex items-center gap-1">
                                                                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                                                                LIVE
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <p className="text-sm text-zinc-400 leading-relaxed">
                                                        {company.summary}
                                                    </p>
                                                </div>
                                            ))}

                                            {/* Dynamic Data from Backend (if available) */}
                                            {data?.market_summary.map((item, index) => (
                                                <div key={`dynamic-${index}`} className="bg-[#202020] p-5 rounded-xl border border-zinc-800/50 hover:border-zinc-700 transition-colors">
                                                    <h3 className="text-base font-medium text-zinc-200 mb-2">{item.title}</h3>
                                                    <p className="text-sm text-zinc-400 leading-relaxed line-clamp-3">{item.content}</p>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Right Sidebar - Watchlist/Gainers (Reused) */}
                                        <div className="space-y-6">
                                            <div className="bg-[#202020] rounded-xl border border-zinc-800/50 overflow-hidden">
                                                <div className="p-4 border-b border-zinc-800/50 flex items-center justify-between">
                                                    <h3 className="font-medium text-zinc-200">Create Watchlist</h3>
                                                    <MoreHorizontal size={16} className="text-zinc-500" />
                                                </div>
                                                <div className="p-2">
                                                    {['NVIDIA Corp', 'Apple Inc', 'Tesla Inc'].map((stock, i) => (
                                                        <div key={i} className="flex items-center justify-between p-3 hover:bg-zinc-800 rounded-lg cursor-pointer group">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-8 h-8 rounded bg-zinc-700 flex items-center justify-center text-xs font-bold text-zinc-300">
                                                                    {stock[0]}
                                                                </div>
                                                                <div>
                                                                    <div className="text-sm font-medium text-zinc-200">{stock}</div>
                                                                    <div className="text-xs text-zinc-500">NASDAQ</div>
                                                                </div>
                                                            </div>
                                                            <div className="text-right">
                                                                <div className="text-sm font-medium text-zinc-200">$123.45</div>
                                                                <div className="text-xs text-green-400">+1.2%</div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="bg-[#202020] rounded-xl border border-zinc-800/50 overflow-hidden">
                                                <div className="flex border-b border-zinc-800/50">
                                                    <button className="flex-1 py-3 text-sm font-medium text-zinc-200 border-b-2 border-zinc-200">Gainers</button>
                                                    <button className="flex-1 py-3 text-sm font-medium text-zinc-500 hover:text-zinc-300">Losers</button>
                                                    <button className="flex-1 py-3 text-sm font-medium text-zinc-500 hover:text-zinc-300">Active</button>
                                                </div>
                                                <div className="p-2">
                                                    {data?.gainers.slice(0, 5).map((item, index) => (
                                                        <div key={index} className="flex items-center justify-between p-3 hover:bg-zinc-800 rounded-lg cursor-pointer">
                                                            <div className="flex items-center gap-3 overflow-hidden">
                                                                <div className="w-8 h-8 rounded-full bg-zinc-700 flex-shrink-0 flex items-center justify-center text-xs">
                                                                    {index + 1}
                                                                </div>
                                                                <div className="truncate">
                                                                    <div className="text-sm font-medium text-zinc-200 truncate" title={item.title}>{item.title}</div>
                                                                    <div className="text-xs text-zinc-500 truncate">{item.url}</div>
                                                                </div>
                                                            </div>
                                                            <div className="text-right flex-shrink-0">
                                                                <div className="text-sm font-medium text-green-400">+15.4%</div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : data?.type === 'politicians' ? (
                                // Politicians View
                                <div className="flex flex-col gap-6">
                                    {/* Trading Activity Header */}
                                    <div>
                                        <div className="flex items-center gap-2 mb-4">
                                            <h2 className="text-zinc-400 font-medium">Trading Activity</h2>
                                            <span className="text-[10px] font-bold bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded border border-zinc-700">BETA</span>
                                        </div>

                                        {/* Search Bar for Politicians */}
                                        <div className="relative mb-6">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                                            <input
                                                type="text"
                                                placeholder="Select politician..."
                                                className="w-full bg-[#202020] border border-zinc-800 rounded-lg py-3 pl-10 pr-4 text-sm text-zinc-200 focus:outline-none focus:border-zinc-700"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                        {/* Transactions Table */}
                                        <div className="lg:col-span-2 bg-[#202020] rounded-xl border border-zinc-800/50 overflow-hidden">
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-sm text-left">
                                                    <thead className="text-xs text-zinc-400 border-b border-zinc-800/50">
                                                        <tr>
                                                            <th className="px-4 py-3 font-medium">Recent Transactions</th>
                                                            <th className="px-4 py-3 font-medium">Transaction</th>
                                                            <th className="px-4 py-3 font-medium text-center">Type</th>
                                                            <th className="px-4 py-3 font-medium text-center">Filed After ⓘ</th>
                                                            <th className="px-4 py-3 font-medium text-right">Amount ⓘ</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {data.transactions?.map((tx, i) => (
                                                            <tr key={i} className="border-b border-zinc-800/50 hover:bg-zinc-800/50 transition-colors">
                                                                <td className="px-4 py-3">
                                                                    <div className="flex items-center gap-3">
                                                                        <div className="w-10 h-10 rounded-full bg-zinc-700 overflow-hidden flex-shrink-0">
                                                                            <img src={tx.image} alt={tx.name} className="w-full h-full object-cover" />
                                                                        </div>
                                                                        <div>
                                                                            <div className="font-medium text-zinc-200">{tx.name}</div>
                                                                            <div className="flex items-center gap-1.5 mt-0.5">
                                                                                <span className={`text-[10px] font-bold px-1 rounded ${tx.party === 'D' ? 'bg-blue-900 text-blue-300' : 'bg-red-900 text-red-300'}`}>
                                                                                    {tx.party}
                                                                                </span>
                                                                                <span className="text-xs text-zinc-500">{tx.state}</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td className="px-4 py-3">
                                                                    <div className="flex items-center gap-2">
                                                                        {tx.ticker !== 'Other' && (
                                                                            <div className="w-6 h-6 rounded bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-400 border border-zinc-700">
                                                                                {tx.ticker[0]}
                                                                            </div>
                                                                        )}
                                                                        <div>
                                                                            <div className="font-medium text-zinc-200">{tx.ticker}</div>
                                                                            <div className="text-xs text-zinc-500">{tx.date}</div>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td className="px-4 py-3 text-center">
                                                                    <div className="text-zinc-200">{tx.type}</div>
                                                                    <div className="text-xs text-zinc-500">{tx.owner}</div>
                                                                </td>
                                                                <td className="px-4 py-3 text-center">
                                                                    <div className="text-zinc-200">{tx.filed_after}</div>
                                                                    <div className="text-xs text-zinc-500">days</div>
                                                                </td>
                                                                <td className="px-4 py-3 text-right">
                                                                    <div className="text-zinc-200">{tx.amount}</div>
                                                                    <div className="flex justify-end gap-0.5 mt-0.5">
                                                                        <div className="w-3 h-3 rounded-full border border-cyan-500/50 flex items-center justify-center text-[8px] text-cyan-500">$</div>
                                                                        <div className="w-3 h-3 rounded-full border border-cyan-500/50 flex items-center justify-center text-[8px] text-cyan-500">$</div>
                                                                        <div className="w-3 h-3 rounded-full border border-zinc-700 flex items-center justify-center text-[8px] text-zinc-600">$</div>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>

                                            {/* Chat Input for Politicians */}
                                            <div className="p-4 border-t border-zinc-800/50">
                                                <div className="relative">
                                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                                                    <input
                                                        type="text"
                                                        placeholder="Ask anything about US politician stock trades"
                                                        className="w-full bg-[#191919] border border-zinc-800 rounded-lg py-3 pl-10 pr-4 text-sm text-zinc-200 focus:outline-none focus:border-zinc-700"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right Sidebar - Watchlist/Gainers (Reused) */}
                                        <div className="space-y-6">
                                            <div className="bg-[#202020] rounded-xl border border-zinc-800/50 overflow-hidden">
                                                <div className="p-4 border-b border-zinc-800/50 flex items-center justify-between">
                                                    <h3 className="font-medium text-zinc-200">Create Watchlist</h3>
                                                    <MoreHorizontal size={16} className="text-zinc-500" />
                                                </div>
                                                <div className="p-2">
                                                    {['Realty Income Corp', 'Meta Platforms, Inc.', 'NVIDIA Corporation', 'Alphabet Inc.', 'Apple Inc.'].map((stock, i) => (
                                                        <div key={i} className="flex items-center justify-between p-3 hover:bg-zinc-800 rounded-lg cursor-pointer group">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-8 h-8 rounded bg-zinc-700 flex items-center justify-center text-xs font-bold text-zinc-300">
                                                                    {stock[0]}
                                                                </div>
                                                                <div className="overflow-hidden">
                                                                    <div className="text-sm font-medium text-zinc-200 truncate w-32" title={stock}>{stock}</div>
                                                                    <div className="text-xs text-zinc-500">NASDAQ</div>
                                                                </div>
                                                            </div>
                                                            <div className="text-right flex-shrink-0">
                                                                <div className="text-sm font-medium text-zinc-200">$123.45</div>
                                                                <div className={`text-xs ${i === 0 ? 'text-red-400' : 'text-green-400'}`}>
                                                                    {i === 0 ? '-0.32%' : '+3.16%'}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="bg-[#202020] rounded-xl border border-zinc-800/50 overflow-hidden">
                                                <div className="flex border-b border-zinc-800/50">
                                                    <button className="flex-1 py-3 text-sm font-medium text-zinc-200 border-b-2 border-zinc-200">Gainers</button>
                                                    <button className="flex-1 py-3 text-sm font-medium text-zinc-500 hover:text-zinc-300">Losers</button>
                                                    <button className="flex-1 py-3 text-sm font-medium text-zinc-500 hover:text-zinc-300">Active</button>
                                                </div>
                                                <div className="p-2">
                                                    {data?.gainers.slice(0, 3).map((item, index) => (
                                                        <div key={index} className="flex items-center justify-between p-3 hover:bg-zinc-800 rounded-lg cursor-pointer">
                                                            <div className="flex items-center gap-3 overflow-hidden">
                                                                <div className="w-8 h-8 rounded-full bg-zinc-700 flex-shrink-0 flex items-center justify-center text-xs">
                                                                    {item.title ? item.title[0] : 'S'}
                                                                </div>
                                                                <div className="truncate">
                                                                    <div className="text-sm font-medium text-zinc-200 truncate" title={item.title}>{item.title}</div>
                                                                    <div className="text-xs text-zinc-500 truncate">{item.url}</div>
                                                                </div>
                                                            </div>
                                                            <div className="text-right flex-shrink-0">
                                                                <div className="text-sm font-medium text-green-400">+{(Math.random() * 50 + 10).toFixed(2)}%</div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : data?.type === 'screener' ? (
                                // Screener View
                                <div className="flex flex-col gap-6">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-zinc-400 font-medium">Stock Screener</h2>
                                        <div className="flex items-center gap-2">
                                            <button className="px-3 py-1.5 rounded-md bg-zinc-800 text-xs font-medium text-zinc-200 border border-zinc-700">Filters</button>
                                            <button className="px-3 py-1.5 rounded-md bg-zinc-800 text-xs font-medium text-zinc-200 border border-zinc-700">Export</button>
                                        </div>
                                    </div>

                                    <div className="bg-[#202020] rounded-xl border border-zinc-800/50 overflow-hidden">
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-sm text-left">
                                                <thead className="text-xs text-zinc-500 border-b border-zinc-800/50">
                                                    <tr>
                                                        <th className="px-4 py-3 font-medium">Company</th>
                                                        <th className="px-4 py-3 font-medium text-right">Market Cap</th>
                                                        <th className="px-4 py-3 font-medium text-right">Price</th>
                                                        <th className="px-4 py-3 font-medium text-right">Change</th>
                                                        <th className="px-4 py-3 font-medium text-right">P/E</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {data?.screener_results?.map((stock, i) => (
                                                        <tr key={i} className="border-b border-zinc-800/50 hover:bg-zinc-800/50 transition-colors">
                                                            <td className="px-4 py-3">
                                                                <div className="font-medium text-zinc-200">{stock.title}</div>
                                                                <div className="text-xs text-zinc-500 truncate max-w-[200px]">{stock.url}</div>
                                                            </td>
                                                            <td className="px-4 py-3 text-right text-zinc-300">-</td>
                                                            <td className="px-4 py-3 text-right text-zinc-300">-</td>
                                                            <td className="px-4 py-3 text-right text-zinc-300">-</td>
                                                            <td className="px-4 py-3 text-right text-zinc-300">-</td>
                                                        </tr>
                                                    ))}
                                                    {(!data?.screener_results || data.screener_results.length === 0) && (
                                                        <tr>
                                                            <td colSpan={5} className="px-4 py-8 text-center text-zinc-500">
                                                                No results found
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                // Standard View (US Markets, etc.)
                                <div className="flex flex-col gap-6">
                                    {/* Indices Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                        {(data?.indices || []).slice(0, 4).map((item, index) => (
                                            <div key={index} className="bg-[#202020] p-4 rounded-xl border border-zinc-800/50 hover:border-zinc-700 transition-colors">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h3 className="font-medium text-zinc-200 truncate pr-2" title={item.title}>{item.title}</h3>
                                                    <span className="text-xs text-red-400 bg-red-400/10 px-1.5 py-0.5 rounded flex items-center gap-1">
                                                        <ArrowDownRight size={12} />
                                                        0.15%
                                                    </span>
                                                </div>
                                                <div className="text-2xl font-semibold text-zinc-100 mb-1">
                                                    {/* Placeholder value since we don't have structured data */}
                                                    4,123.45
                                                </div>
                                                <p className="text-xs text-zinc-500 line-clamp-2">{item.content}</p>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                        {/* Market Summary */}
                                        <div className="lg:col-span-2 space-y-6">
                                            <div className="flex items-center justify-between">
                                                <h2 className="text-lg font-medium text-zinc-200">Market Summary</h2>
                                                <span className="text-xs text-zinc-500">Updated just now</span>
                                            </div>

                                            <div className="space-y-4">
                                                {data?.market_summary?.map((item, index) => (
                                                    <div key={index} className="bg-[#202020] p-5 rounded-xl border border-zinc-800/50 hover:border-zinc-700 transition-colors group cursor-pointer">
                                                        <h3 className="text-base font-medium text-zinc-200 mb-2 group-hover:text-cyan-400 transition-colors">{item.title}</h3>
                                                        <p className="text-sm text-zinc-400 leading-relaxed line-clamp-3">{item.content}</p>
                                                        <div className="mt-3 flex items-center gap-2">
                                                            <div className="w-4 h-4 rounded-full bg-zinc-700" />
                                                            <span className="text-xs text-zinc-500">{new URL(item.url).hostname}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Right Sidebar - Watchlist/Gainers */}
                                        <div className="space-y-6">
                                            <div className="bg-[#202020] rounded-xl border border-zinc-800/50 overflow-hidden">
                                                <div className="p-4 border-b border-zinc-800/50 flex items-center justify-between">
                                                    <h3 className="font-medium text-zinc-200">Create Watchlist</h3>
                                                    <MoreHorizontal size={16} className="text-zinc-500" />
                                                </div>
                                                <div className="p-2">
                                                    {['NVIDIA Corp', 'Apple Inc', 'Tesla Inc'].map((stock, i) => (
                                                        <div key={i} className="flex items-center justify-between p-3 hover:bg-zinc-800 rounded-lg cursor-pointer group">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-8 h-8 rounded bg-zinc-700 flex items-center justify-center text-xs font-bold text-zinc-300">
                                                                    {stock[0]}
                                                                </div>
                                                                <div>
                                                                    <div className="text-sm font-medium text-zinc-200">{stock}</div>
                                                                    <div className="text-xs text-zinc-500">NASDAQ</div>
                                                                </div>
                                                            </div>
                                                            <div className="text-right">
                                                                <div className="text-sm font-medium text-zinc-200">$123.45</div>
                                                                <div className="text-xs text-green-400">+1.2%</div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="bg-[#202020] rounded-xl border border-zinc-800/50 overflow-hidden">
                                                <div className="flex border-b border-zinc-800/50">
                                                    <button className="flex-1 py-3 text-sm font-medium text-zinc-200 border-b-2 border-zinc-200">Gainers</button>
                                                    <button className="flex-1 py-3 text-sm font-medium text-zinc-500 hover:text-zinc-300">Losers</button>
                                                    <button className="flex-1 py-3 text-sm font-medium text-zinc-500 hover:text-zinc-300">Active</button>
                                                </div>
                                                <div className="p-2">
                                                    {(data?.gainers || []).slice(0, 5).map((item, index) => (
                                                        <div key={index} className="flex items-center justify-between p-3 hover:bg-zinc-800 rounded-lg cursor-pointer">
                                                            <div className="flex items-center gap-3 overflow-hidden">
                                                                <div className="w-8 h-8 rounded-full bg-zinc-700 flex-shrink-0 flex items-center justify-center text-xs">
                                                                    {index + 1}
                                                                </div>
                                                                <div className="truncate">
                                                                    <div className="text-sm font-medium text-zinc-200 truncate" title={item.title}>{item.title}</div>
                                                                    <div className="text-xs text-zinc-500 truncate">{item.url}</div>
                                                                </div>
                                                            </div>
                                                            <div className="text-right flex-shrink-0">
                                                                <div className="text-sm font-medium text-green-400">+15.4%</div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>
        </div>
    );
}
