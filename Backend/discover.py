import os
import asyncio
from tavily import TavilyClient
from dotenv import load_dotenv
import time

load_dotenv()

tavily_client = TavilyClient(api_key=os.environ.get("TAVILY_API_KEY"))

# Cache to store discover content
CACHE = {}
CACHE_LOCK = asyncio.Lock()

CATEGORIES = [
    "for_you", "top", "tech_science", "finance", 
    "arts_culture", "sports", "entertainment"
]

import random

def get_query_for_category(category: str) -> str:
    # Use synonymous queries to ensure freshness without changing the topic drastically
    if category == "top":
        return random.choice([
            "top breaking news headlines world today",
            "latest global news headlines",
            "major world news events today",
            "current top news stories world"
        ])
    elif category == "tech_science":
         return random.choice([
             "latest technology and science news",
             "newest tech and science headlines",
             "breaking news in technology and science",
             "current trends in tech and science"
         ])
    elif category == "finance":
         return random.choice([
             "latest finance and market news",
             "breaking business and stock market news",
             "global economy and finance updates",
             "current financial market headlines"
         ])
    elif category == "arts_culture":
         return random.choice([
             "latest arts and culture news",
             "newest stories in arts and culture",
             "breaking news arts and entertainment",
             "current trends in arts and culture"
         ])
    elif category == "sports":
         return random.choice([
             "latest sports news and scores",
             "breaking sports headlines today",
             "newest updates in world sports",
             "current major sports events news"
         ])
    elif category == "entertainment":
         return random.choice([
             "latest entertainment and celebrity news",
             "breaking news in movies and music",
             "newest entertainment headlines today",
             "current pop culture and entertainment news"
         ])
    else: # for_you
        return random.choice([
            "top trending news across all topics",
            "latest viral and trending stories",
            "must read headlines today mixed topics",
            "current interesting news stories world"
        ])

async def fetch_category_content(category: str):
    query = get_query_for_category(category)
    print(f"Background fetching discover content for category: {category}")
    try:
        # Run the synchronous Tavily client in a thread pool
        response = await asyncio.to_thread(
            tavily_client.search,
            query,
            topic="news",
            max_results=10,
            include_images=True
        )
        results = response.get("results", [])
        if results:
            print(f"[{category}] First article: {results[0].get('title')}")
        
        return {
            "results": results, 
            "images": response.get("images", []),
            "last_updated": time.time()
        }
    except Exception as e:
        print(f"Error fetching discover content for {category}: {e}")
        return None

async def update_cache():
    """
    Background task to update the cache every 60 seconds.
    """
    while True:
        print("Starting cache update cycle...")
        for category in CATEGORIES:
            data = await fetch_category_content(category)
            if data:
                async with CACHE_LOCK:
                    CACHE[category] = data
        
        print("Cache update cycle complete. Sleeping for 60 seconds.")
        await asyncio.sleep(60)

async def get_discover_content(category: str = "for_you"):
    """
    Fetches trending content for the Discover section.
    Returns cached content if available, otherwise triggers an immediate fetch.
    """
    async with CACHE_LOCK:
        if category in CACHE:
            return CACHE[category]
    
    # If not in cache (e.g., startup), fetch immediately
    print(f"Cache miss for {category}, fetching immediately...")
    data = await fetch_category_content(category)
    if data:
        async with CACHE_LOCK:
            CACHE[category] = data
        return data
    
    return {"results": [], "images": [], "error": "Failed to fetch content"}
