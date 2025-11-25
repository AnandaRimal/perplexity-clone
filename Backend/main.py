from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import List
import json
import asyncio
from langchain_core.messages import HumanMessage, AIMessage
from agent import create_graph

app = FastAPI(title="Perplexity")

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
            
            # Use a static thread_id for session state
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
                
                # Stream Tool Output (Sources & Images)
                elif kind == "on_tool_end":
                    output = event["data"].get("output")
                    
                    tool_result = None
                    if hasattr(output, "content"):
                        try:
                            tool_result = json.loads(output.content)
                        except:
                            pass
                    elif isinstance(output, dict) and "results" in output:
                         tool_result = output
                    
                    if tool_result:
                        # Stream Images
                        if "images" in tool_result and tool_result["images"]:
                            yield f"3:{json.dumps(tool_result['images'])}\n"
                        
                        # Stream Sources
                        if "results" in tool_result and tool_result["results"]:
                            yield f"2:{json.dumps(tool_result['results'])}\n"
                


        except Exception as e:
            print(f"Error generating stream: {e}")
            yield f"0:{json.dumps(f'Error: {str(e)}')}\n"

    return StreamingResponse(event_generator(), media_type="text/plain")

from discover import get_discover_content

@app.get("/api/discover")
async def discover_endpoint(category: str = "for_you"):
    data = get_discover_content(category)
    return data

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
