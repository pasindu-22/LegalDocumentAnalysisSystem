from fastapi import APIRouter, Body, Depends, HTTPException
from langchain_core.messages import HumanMessage, SystemMessage
from dependencies.auth import get_current_user
from models.user import User
from agents.chatbot import query_or_respond  # assuming your function is in this module

router = APIRouter(prefix="/chat", tags=["Chat"])

@router.post("/ask")
async def chat_with_bot(
    question: str = Body(..., embed=True),
    user: User = Depends(get_current_user)  # Optional: track who asked
):
    try:
        messages = [
            SystemMessage(content="""
                You are a helpful assistant.
                If you're unsure or need more context, use the retrieve tool.
            """),
            HumanMessage(content=question)
        ]

        response = await query_or_respond(messages)
        return {"response": response}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat error: {str(e)}")
