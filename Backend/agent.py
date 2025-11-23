import os
from typing import TypedDict, Annotated, List
from dotenv import load_dotenv
from datetime import datetime

from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import BaseMessage, HumanMessage, SystemMessage
from langchain_community.tools.tavily_search import TavilySearchResults

from langgraph.graph import StateGraph, END
from langgraph.graph.message import add_messages
from langgraph.prebuilt import ToolNode
from langgraph.checkpoint.memory import MemorySaver

# ---------------------------------------------------------
# Load Environment
# ---------------------------------------------------------
load_dotenv()

# ---------------------------------------------------------
# Agent State
# ---------------------------------------------------------
class AgentState(TypedDict):
    messages: Annotated[List[BaseMessage], add_messages]

# ---------------------------------------------------------
# LLM Setup
# ---------------------------------------------------------
llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    temperature=0.2,
    convert_system_message_to_human=True,
)

# ---------------------------------------------------------
# Tools
# ---------------------------------------------------------
search_tool = TavilySearchResults(max_results=2)
search_tool.name = "tavily_search"

tools = [search_tool]
llm_with_tools = llm.bind_tools(tools)

# ---------------------------------------------------------
# Agent Node
# ---------------------------------------------------------
def agent_node(state: AgentState):
    current_date = datetime.now().strftime("%Y-%m-%d")
    
    system_prompt = SystemMessage(f"""
You are a helpful AI assistant. Today's date is {current_date}.

- For casual chat, answer normally.
- For factual questions, news, or anything requiring updated information,
  CALL the `tavily_search` tool.
""")

    messages = [system_prompt] + state["messages"]
    ai_reply = llm_with_tools.invoke(messages)

    return {"messages": [ai_reply]}

# ---------------------------------------------------------
# Should Continue (Tool or End)
# ---------------------------------------------------------
def should_continue(state: AgentState):
    last = state["messages"][-1]
    return "tools" if last.tool_calls else "__end__"

# ---------------------------------------------------------
# Create Graph
# ---------------------------------------------------------
def create_graph():
    graph = StateGraph(AgentState)

    graph.add_node("agent", agent_node)
    graph.add_node("tools", ToolNode(tools))

    graph.set_entry_point("agent")

    graph.add_conditional_edges(
        "agent",
        should_continue,
        {
            "tools": "tools",
            "__end__": END
        }
    )

    graph.add_edge("tools", "agent")

    # Initialize MemorySaver
    memory = MemorySaver()

    # Compile with checkpointer
    return graph.compile(checkpointer=memory)

# ---------------------------------------------------------
# Main Execution
# ---------------------------------------------------------
if __name__ == "__main__":
    app = create_graph()
    print("Graph created successfully.")

