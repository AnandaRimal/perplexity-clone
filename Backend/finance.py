import os
from fastapi import APIRouter, HTTPException
from tavily import TavilyClient
from dotenv import load_dotenv
import asyncio

load_dotenv()

router = APIRouter()
tavily_client = TavilyClient(api_key=os.environ.get("TAVILY_API_KEY"))

async def fetch_tavily(query: str, topic: str = "general"):
    try:
        # Run in a thread pool since TavilyClient is synchronous
        return await asyncio.to_thread(
            tavily_client.search,
            query=query,
            topic=topic,
            max_results=5,
            include_images=True
        )
    except Exception as e:
        print(f"Error fetching {query}: {e}")
        return None

@router.get("/api/finance")
async def get_finance_dashboard(category: str = "us_markets"):
    """
    Aggregates data for the Finance dashboard based on category.
    """
    
    if category == "crypto":
        # Specific queries for the Crypto UI
        top_coins_query = "current price 24h change Bitcoin Ethereum Solana Coin50"
        leaderboard_query = "top cryptocurrencies by 24h volume with price change and funding rate"
        sectors_query = "crypto market sectors performance today" # For the right sidebar
        
        results = await asyncio.gather(
            fetch_tavily(top_coins_query, topic="finance"),
            fetch_tavily(leaderboard_query, topic="finance"),
            fetch_tavily(sectors_query, topic="finance")
        )
        
        top_coins_data, leaderboard_data, sectors_data = results
        
        return {
            "indices": top_coins_data.get("results", []) if top_coins_data else [], # Reusing 'indices' for Top Cards
            "market_summary": leaderboard_data.get("results", []) if leaderboard_data else [], # Reusing 'market_summary' for Leaderboard
            "gainers": sectors_data.get("results", []) if sectors_data else [], # Reusing 'gainers' for Sectors
            "type": "crypto" # Flag to tell frontend to render crypto view
        }

    elif category == "earnings":
        # Specific queries for Earnings UI
        calendar_query = "earnings calendar this week companies reporting dates"
        reports_query = "latest quarterly earnings reports summaries major companies today"
        gainers_query = "stocks with biggest post-earnings moves today"
        
        results = await asyncio.gather(
            fetch_tavily(calendar_query, topic="finance"),
            fetch_tavily(reports_query, topic="finance"),
            fetch_tavily(gainers_query, topic="finance")
        )
        calendar_data, reports_data, gainers_data = results
        
        return {
            "indices": calendar_data.get("results", []) if calendar_data else [], # Reusing 'indices' for Calendar
            "market_summary": reports_data.get("results", []) if reports_data else [], # Reusing 'market_summary' for Reports List
            "gainers": gainers_data.get("results", []) if gainers_data else [],
            "type": "earnings" # Flag to tell frontend to render earnings view
        }
        
    elif category == "screener":
        # Specific query for the Screener UI - mimicking "Stocks with market cap over $2T"
        # We'll try to get real data, but for the UI clone, we might need to rely on the frontend to render it prettily.
        screener_query = "companies with market cap over 2 trillion dollars current price and PE ratio"
        
        results = await fetch_tavily(screener_query, topic="finance")
        
        return {
            "screener_results": results.get("results", []) if results else [],
            "type": "screener"
        }

    elif category == "politicians":
        indices_query = "recent stock trades by US congress members"
        news_query = "nancy pelosi stock trades latest news"
        gainers_query = "stocks heavily traded by politicians recently"
        
        results = await asyncio.gather(
            fetch_tavily(indices_query, topic="finance"),
            fetch_tavily(news_query, topic="news"),
            fetch_tavily(gainers_query, topic="finance")
        )
        indices_data, news_data, gainers_data = results
        
        # Mock data for the "Recent Transactions" table to match the design
        transactions = [
            {
                "name": "Jake Auchincloss",
                "party": "D",
                "state": "MA-4",
                "ticker": "STT",
                "ticker_name": "State Street",
                "type": "Sell",
                "owner": "Spouse",
                "date": "11/17/2025",
                "filed_after": "2 days",
                "amount": "$15K-$50K",
                "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Jake_Auchincloss_117th_U.S_Congress_portrait.jpg/440px-Jake_Auchincloss_117th_U.S_Congress_portrait.jpg"
            },
            {
                "name": "Cleo Fields",
                "party": "D",
                "state": "LA-6",
                "ticker": "AAPL",
                "ticker_name": "Apple Inc.",
                "type": "Buy",
                "owner": "Undisclosed",
                "date": "11/13/2025",
                "filed_after": "7 days",
                "amount": "$1K-$15K",
                "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Cleo_Fields.jpg/440px-Cleo_Fields.jpg"
            },
            {
                "name": "Marjorie Taylor Greene",
                "party": "R",
                "state": "GA-14",
                "ticker": "Other",
                "ticker_name": "Other",
                "type": "Buy",
                "owner": "Undisclosed",
                "date": "11/13/2025",
                "filed_after": "7 days",
                "amount": "$50K-$100K",
                "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Marjorie_Taylor_Greene_117th_U.S._Congress_portrait.jpg/440px-Marjorie_Taylor_Greene_117th_U.S._Congress_portrait.jpg"
            },
            {
                "name": "David J. Taylor",
                "party": "R",
                "state": "OH-2",
                "ticker": "V",
                "ticker_name": "Visa Inc.",
                "type": "Buy",
                "owner": "Undisclosed",
                "date": "11/12/2025",
                "filed_after": "7 days",
                "amount": "$1K-$15K",
                "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/David_Taylor_%28Ohio_politician%29.jpg/440px-David_Taylor_%28Ohio_politician%29.jpg"
            },
            {
                "name": "Marjorie Taylor Greene",
                "party": "R",
                "state": "GA-14",
                "ticker": "ADP",
                "ticker_name": "ADP",
                "type": "Buy",
                "owner": "Undisclosed",
                "date": "11/12/2025",
                "filed_after": "2 days",
                "amount": "$15K-$50K",
                "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Marjorie_Taylor_Greene_117th_U.S._Congress_portrait.jpg/440px-Marjorie_Taylor_Greene_117th_U.S._Congress_portrait.jpg"
            },
            {
                "name": "Marjorie Taylor Greene",
                "party": "R",
                "state": "GA-14",
                "ticker": "PAYX",
                "ticker_name": "Paychex",
                "type": "Buy",
                "owner": "Undisclosed",
                "date": "11/12/2025",
                "filed_after": "2 days",
                "amount": "$15K-$50K",
                "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Marjorie_Taylor_Greene_117th_U.S._Congress_portrait.jpg/440px-Marjorie_Taylor_Greene_117th_U.S._Congress_portrait.jpg"
            },
             {
                "name": "David J. Taylor",
                "party": "R",
                "state": "OH-2",
                "ticker": "RPM",
                "ticker_name": "RPM Int",
                "type": "Buy",
                "owner": "Undisclosed",
                "date": "11/11/2025",
                "filed_after": "8 days",
                "amount": "$1K-$15K",
                "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/David_Taylor_%28Ohio_politician%29.jpg/440px-David_Taylor_%28Ohio_politician%29.jpg"
            }
        ]
        
        return {
            "indices": indices_data.get("results", []) if indices_data else [],
            "market_summary": news_data.get("results", []) if news_data else [],
            "gainers": gainers_data.get("results", []) if gainers_data else [],
            "transactions": transactions,
            "type": "politicians"
        }

    else: # us_markets
        indices_query = "current value and percentage change S&P 500, NASDAQ, Dow Jones Industrial Average, VIX today"
        news_query = "financial market summary today top stories"
        gainers_query = "top stock gainers US market today with price and percentage"
    
        # Execute in parallel
        results = await asyncio.gather(
            fetch_tavily(indices_query, topic="finance"),
            fetch_tavily(news_query, topic="news"),
            fetch_tavily(gainers_query, topic="finance")
        )
        
        indices_data, news_data, gainers_data = results
        
        return {
            "indices": indices_data.get("results", []) if indices_data else [],
            "market_summary": news_data.get("results", []) if news_data else [],
            "gainers": gainers_data.get("results", []) if gainers_data else [],
            "type": "standard"
        }
