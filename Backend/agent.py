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
You are a smart research assistant. Today's date is {current_date}.

Your goal is to provide accurate, comprehensive, and cited answers.

Instructions:
1. **Analyze the User's Request**: Understand what the user is asking.
2. **Formulate Search Queries**: If the request requires external knowledge (news, facts, data), generate specific and optimized search queries for the `tavily_search` tool. Do not just repeat the user's input if a better query exists.
3. **Synthesize Answers**:
   - When you receive search results, analyze them carefully.
   - Synthesize a coherent answer that directly addresses the user's question.
   - **Cite your sources** using the format [1], [2], etc., corresponding to the order of sources returned.
   - If the search results are insufficient, state that clearly or ask for clarification.
4. **Casual Chat**: For simple greetings or questions about yourself, answer naturally without searching.

Always prioritize accuracy and helpfulness.
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
