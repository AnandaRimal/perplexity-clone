from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import List
import json
import asyncio
from langchain_core.messages import HumanMessage, AIMessage
from Backend.agent import create_graph

app = FastAPI(title="Perplexity Clone API")

# Allow CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize the graph
agent_app = create_graph()

class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[Message]

@app.post("/api/chat")
async def chat_endpoint(request: ChatRequest):
    async def event_generator():
        try:
            # We'll use the last message as the input
            if not request.messages:
                return

            latest_message = request.messages[-1]
            input_message = HumanMessage(content=latest_message.content)
            
            # Use a static thread_id for now to maintain session state
            config = {"configurable": {"thread_id": "1"}}
            
            async for event in agent_app.astream_events(
                {"messages": [input_message]},
                config=config,
                version="v1"
            ):
                kind = event["event"]
                
                # Stream Text Tokens
                if kind == "on_chat_model_stream":
                    content = event["data"]["chunk"].content
                    if content:
                        # Protocol Type 0: Text
                        yield f"0:{json.dumps(content)}\n"
                
                # Handle Tool Outputs (Sources/Images)
                elif kind == "on_tool_end":
                    if event["name"] == "tavily_search":
                        output = event["data"].get("output")
                        if output and isinstance(output, list):
                            sources = []
                            images = []
                            
                            for item in output:
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
                            
                            # Protocol Type 2: Sources
                            if sources:
                                yield f"2:{json.dumps(sources)}\n"
                            
                            # Protocol Type 3: Images
                            if images:
                                yield f"3:{json.dumps(images)}\n"

        except Exception as e:
            print(f"Error generating stream: {e}")
            yield f"0:{json.dumps(f'Error: {str(e)}')}\n"

    return StreamingResponse(event_generator(), media_type="text/plain")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
