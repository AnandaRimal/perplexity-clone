import os
from dotenv import load_dotenv
from langchain_core.messages import HumanMessage
from Backend.agent import create_graph

# Force reload of .env
load_dotenv(override=True)

print("Starting agent test...")
try:
    app = create_graph()
    print("Graph created.")
    
    # Test with a query that triggers the tool
    query = "What is the share price of Tesla?"
    print(f"Invoking agent with query: {query}")
    
    response = app.invoke({"messages": [HumanMessage(content=query)]})
    
    print("Agent response:")
    print(response["messages"][-1].content)
    
except Exception as e:
    print(f"Agent execution failed: {e}")
