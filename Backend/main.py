from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from langchain_core.messages import HumanMessage
from Backend.agent import create_graph

app = FastAPI(title="Perplexity Clone API")

# Initialize the graph
agent_app = create_graph()

class ChatRequest(BaseModel):
    message: str
    thread_id: str = "1"

class ChatResponse(BaseModel):
    response: str

@app.get("/")
def read_root():
    return {"message": "Welcome to Perplexity Clone API"}

@app.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest):
    try:
        config = {"configurable": {"thread_id": request.thread_id}}
        
        response = agent_app.invoke(
            {"messages": [HumanMessage(content=request.message)]},
            config=config
        )
        
        return ChatResponse(response=response["messages"][-1].content)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
