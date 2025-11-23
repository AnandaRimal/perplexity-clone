import os
from dotenv import load_dotenv

load_dotenv()

google_key = os.getenv("GOOGLE_API_KEY")
tavily_key = os.getenv("TAVILY_API_KEY")

print(f"Google Key Loaded: {'Yes' if google_key else 'No'}")
if google_key:
    print(f"Google Key Start: {google_key[:4]}...")
    print(f"Google Key End: ...{google_key[-4:]}")

print(f"Tavily Key Loaded: {'Yes' if tavily_key else 'No'}")
if tavily_key:
    print(f"Tavily Key Start: {tavily_key[:4]}...")
