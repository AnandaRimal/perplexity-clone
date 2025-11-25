import os
from tavily import TavilyClient
from dotenv import load_dotenv

load_dotenv()

tavily_client = TavilyClient(api_key=os.environ.get("TAVILY_API_KEY"))

def get_discover_content(category: str = "for_you"):
    """
    Fetches trending content for the Discover section using Tavily.
    """
    if category == "top":
        query = "top breaking news headlines world"
    elif category == "tech_science":
         query = "latest news technology science"
    elif category == "finance":
         query = "latest finance news market updates"
    elif category == "arts_culture":
         query = "latest news arts culture"
    elif category == "sports":
         query = "latest sports news scores"
    elif category == "entertainment":
         query = "latest entertainment news movies music"
    else: # for_you
        query = "trending news technology science finance sports entertainment"

    try:
        response = tavily_client.search(query, topic="news", max_results=10, include_images=True)
        return {"results": response.get("results", []), "images": response.get("images", [])}
    except Exception as e:
        print(f"Error fetching discover content: {e}")
        return {"results": [], "images": [], "error": str(e)}
