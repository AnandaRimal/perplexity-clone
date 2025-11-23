from typing import List, Dict, Any, Tuple
import json

def process_tavily_images(tavily_output: List[Dict[str, Any]]) -> Tuple[List[Dict[str, str]], List[str]]:
    """
    Extracts sources and images from Tavily search output.

    Args:
        tavily_output: The raw output list from Tavily search tool.

    Returns:
        A tuple containing:
        - List of sources (dictionaries with 'url' and 'title')
        - List of image URLs
    """
    sources = []
    images = []

    if not tavily_output or not isinstance(tavily_output, list):
        return sources, images

    for item in tavily_output:
        # Extract Source
        if isinstance(item, dict):
            url = item.get("url")
            content = item.get("content", "")
            # Use content snippet as title if title missing
            title = item.get("title") or (content[:50] + "..." if content else url)
            
            if url:
                sources.append({"url": url, "title": title})
            
            # Check for images (Tavily response structure varies based on options)
            # If 'images' are returned as a list of URLs
            if "images" in item and isinstance(item["images"], list):
                images.extend(item["images"])
    
    return sources, images
