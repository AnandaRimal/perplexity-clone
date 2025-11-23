import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
import { tavily } from '@tavily/core';

export const maxDuration = 30;

interface Source {
    title: string;
    url: string;
    content: string;
}

export async function POST(req: Request) {
    const { messages } = await req.json();
    const latestMessage = messages[messages.length - 1].content;

    let context = "";
    let sources: Source[] = [];

    try {
        const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });
        const searchResult = await tvly.search(latestMessage, {
            search_depth: "basic",
            max_results: 5,
        });

        sources = searchResult.results.map((result: any) => ({
            title: result.title,
            url: result.url,
            content: result.content,
        }));

        context = sources.map((source: Source) =>
            `Title: ${source.title}\nURL: ${source.url}\nContent: ${source.content}`
        ).join("\n\n");
    } catch (error) {
        console.error("Search failed:", error);
        context = "Search failed. Please answer based on your knowledge.";
    }

    const systemPrompt = `You are a helpful AI assistant like Perplexity.
  You have access to the following real-time search results:
  ${context}
  
  Cite your sources using [1], [2], etc. matching the order of the sources provided.
  Answer the user's question comprehensively and accurately based on the sources.
  If the sources don't contain the answer, state that clearly.`;

    try {
        const result = await streamText({
            model: google('gemini-1.5-flash'),
            system: systemPrompt,
            messages,
        });

        return result.toTextStreamResponse({
            headers: {
                'x-sources': JSON.stringify(sources),
            }
        });
    } catch (error: any) {
        console.error("AI Error:", error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}
