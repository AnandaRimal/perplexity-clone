import os
from dotenv import load_dotenv
from langchain_community.utilities import GoogleSearchAPIWrapper

# Force reload of .env
load_dotenv(override=True)

print(f"GOOGLE_API_KEY present: {'GOOGLE_API_KEY' in os.environ}")
print(f"GOOGLE_CSE_ID present: {'GOOGLE_CSE_ID' in os.environ}")

try:
    search = GoogleSearchAPIWrapper()
    results = search.run("Tesla share price")
    print("Search successful!")
    print(results[:200] + "...")
except Exception as e:
    print(f"Search failed: {e}")
