import React, { useEffect, useState, useRef } from 'react';
import { AlignLeft, Layers, Plus, ArrowRight, Globe, Share2, MoreHorizontal, Image as ImageIcon, Sparkles, MessageSquare, ThumbsUp, ThumbsDown, Copy } from 'lucide-react';

interface ThreadViewProps {
    query: string;
    onSearch: (query: string) => void;
}

interface Source {
    url: string;
    title: string;
}

interface Message {
    role: string;
    content: string;
}

export default function ThreadView({ query, onSearch }: ThreadViewProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [sources, setSources] = useState<Source[]>([]);
    const [images, setImages] = useState<string[]>([]);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const hasFetchedRef = useRef(false);
    const queryRef = useRef(query);

    // Handle initial query and prop updates
    useEffect(() => {
        if (query && (query !== queryRef.current || !hasFetchedRef.current)) {
            queryRef.current = query;
            hasFetchedRef.current = true;
            setSources([]);
            setImages([]);
            setErrorMsg(null);

            // Call backend
            fetchAnswer(query);
        }
    }, [query]);

    const fetchAnswer = async (userQuery: string) => {
        setIsLoading(true);
        setMessages([{ role: 'user', content: userQuery }]);

        try {
            const response = await fetch('http://localhost:8000/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messages: [{ role: 'user', content: userQuery }]
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();
            let assistantContent = '';

            if (reader) {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    const chunk = decoder.decode(value);
                    const lines = chunk.split('\n');

                    for (const line of lines) {
                        if (!line.trim()) continue;

                        // Parse Data Stream Protocol
                        const colonIndex = line.indexOf(':');
                        if (colonIndex === -1) continue;

                        const type = line.substring(0, colonIndex);
                        const data = line.substring(colonIndex + 1);

                        if (type === '0') {
                            // Text chunk
                            try {
                                const text = JSON.parse(data);
                                assistantContent += text;
                                setMessages([
                                    { role: 'user', content: userQuery },
                                    { role: 'assistant', content: assistantContent }
                                ]);
                            } catch (e) {
                                console.error('Failed to parse text chunk:', e);
                            }
                        } else if (type === '2') {
                            // Data chunk (sources)
                            try {
                                const sourcesData = JSON.parse(data);
                                if (Array.isArray(sourcesData)) {
                                    setSources(sourcesData);
                                }
                            } catch (e) {
                                console.error('Failed to parse sources:', e);
                            }
                        } else if (type === '3') {
                            // Image chunk
                            try {
                                const imagesData = JSON.parse(data);
                                if (Array.isArray(imagesData)) {
                                    setImages(imagesData);
                                }
                            } catch (e) {
                                console.error('Failed to parse images:', e);
                            }
                        }
                    }
                }
            }

            setMessages([
                { role: 'user', content: userQuery },
                { role: 'assistant', content: assistantContent }
            ]);
        } catch (error: unknown) {
            console.error('Chat error:', error);
            if (error instanceof Error) {
                setErrorMsg(error.message);
            } else {
                setErrorMsg('Unknown error');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const getHostname = (url: string) => {
        try {
            return new URL(url).hostname.replace('www.', '');
        } catch {
            return url;
        }
    };

    const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null;
    const isAnswer = lastMessage && lastMessage.role === 'assistant';

    return (
        <div className="flex flex-col w-full max-w-3xl mx-auto px-4 py-8 pb-32">
            {/* Top Navigation */}
            <div className="flex items-center gap-6 mb-8 border-b border-zinc-800/50 pb-1">
                <div className="flex items-center gap-2 text-teal-400 border-b-2 border-teal-400 pb-3 px-1 cursor-pointer">
                    <Sparkles size={18} />
                    <span className="font-medium text-sm">Answer</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-500 hover:text-zinc-300 pb-3 px-1 cursor-pointer transition-colors">
                    <Globe size={18} />
                    <span className="font-medium text-sm">Links</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-500 hover:text-zinc-300 pb-3 px-1 cursor-pointer transition-colors">
                    <ImageIcon size={18} />
                    <span className="font-medium text-sm">Images</span>
                </div>
            </div>

            {/* Title */}
            <h1 className="text-4xl font-serif font-medium text-zinc-100 mb-8">{query}</h1>

            {/* Images Grid */}
            {images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
                    {images.slice(0, 4).map((img, idx) => (
                        <div key={idx} className="aspect-video relative rounded-xl overflow-hidden bg-zinc-800 border border-zinc-700/50 group cursor-pointer">
                            <img src={img} alt={`Result ${idx + 1}`} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
                        </div>
                    ))}
                </div>
            )}

            {/* Answer Content */}
            <div className="mb-12">
                <div className="prose prose-invert prose-zinc max-w-none">
                    <div className="text-zinc-300 leading-relaxed text-lg space-y-4">
                        {errorMsg ? (
                            <p className="text-red-400">Error: {errorMsg}</p>
                        ) : isAnswer && lastMessage ? (
                            lastMessage.content.split('\n').map((paragraph, idx) => (
                                <p key={idx} className="mb-4">{paragraph}</p>
                            ))
                        ) : (
                            <div className="space-y-3 animate-pulse">
                                <div className="h-4 bg-zinc-800 rounded w-full"></div>
                                <div className="h-4 bg-zinc-800 rounded w-[90%]"></div>
                                <div className="h-4 bg-zinc-800 rounded w-[95%]"></div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sources & Actions Footer */}
                {sources.length > 0 && (
                    <div className="flex items-center justify-between mt-8 pt-6 border-t border-zinc-800/50">
                        <div className="flex items-center gap-3">
                            <div className="flex -space-x-2">
                                {sources.slice(0, 3).map((source, i) => (
                                    <div key={i} className="w-6 h-6 rounded-full bg-zinc-800 border border-zinc-900 flex items-center justify-center text-[10px] text-zinc-400 font-medium">
                                        {source.title.charAt(0)}
                                    </div>
                                ))}
                                {sources.length > 3 && (
                                    <div className="w-6 h-6 rounded-full bg-zinc-800 border border-zinc-900 flex items-center justify-center text-[10px] text-zinc-400 font-medium">
                                        +{sources.length - 3}
                                    </div>
                                )}
                            </div>
                            <span className="text-zinc-500 text-sm font-medium hover:text-zinc-300 cursor-pointer transition-colors">
                                {sources.length} sources
                            </span>
                        </div>

                        <div className="flex items-center gap-1">
                            <button className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-500 hover:text-zinc-300 transition-colors">
                                <Copy size={18} />
                            </button>
                            <button className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-500 hover:text-zinc-300 transition-colors">
                                <Share2 size={18} />
                            </button>
                            <div className="w-px h-4 bg-zinc-800 mx-1" />
                            <button className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-500 hover:text-zinc-300 transition-colors">
                                <ThumbsUp size={18} />
                            </button>
                            <button className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-500 hover:text-zinc-300 transition-colors">
                                <ThumbsDown size={18} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Related Section */}
            {sources.length > 0 && (
                <div className="mb-24">
                    <h3 className="text-xl font-medium text-zinc-200 mb-6">Related</h3>
                    <div className="flex flex-col gap-3">
                        {['What are Cristiano Ronaldo\'s career statistics?', 'Which major awards has Ronaldo won?', 'How does Ronaldo compare to Messi?'].map((item, i) => (
                            <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-zinc-800/30 hover:bg-zinc-800/50 cursor-pointer transition-all border border-zinc-800/50 group">
                                <div className="flex items-center gap-4">
                                    <ArrowRight size={18} className="text-zinc-500 group-hover:text-teal-400 transition-colors" />
                                    <span className="text-zinc-300 font-medium group-hover:text-zinc-100 transition-colors">{item}</span>
                                </div>
                                <Plus size={18} className="text-zinc-500 group-hover:text-zinc-300 transition-colors" />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Follow-up Input */}
            <div className="fixed bottom-0 left-[80px] right-0 p-6 bg-gradient-to-t from-[#191919] via-[#191919] to-transparent z-10">
                <div className="max-w-3xl mx-auto relative">
                    <input
                        type="text"
                        placeholder="Ask a follow-up"
                        className="w-full bg-zinc-800/50 border border-zinc-700/50 rounded-full py-3.5 pl-5 pr-24 text-zinc-200 placeholder-zinc-500 focus:outline-none focus:bg-zinc-800 focus:border-zinc-600 transition-all shadow-lg"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                                onSearch(e.currentTarget.value);
                                e.currentTarget.value = '';
                            }
                        }}
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                        <button className="p-2 rounded-full hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 transition-colors">
                            <Globe size={18} />
                        </button>
                        <button
                            className="p-2 rounded-full bg-zinc-700 hover:bg-zinc-600 text-zinc-300 transition-colors shadow-md"
                            onClick={(e) => {
                                const input = e.currentTarget.parentElement?.previousElementSibling as HTMLInputElement;
                                if (input && input.value.trim()) {
                                    onSearch(input.value);
                                    input.value = '';
                                }
                            }}
                        >
                            <ArrowRight size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
