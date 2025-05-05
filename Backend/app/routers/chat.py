# from fastapi import APIRouter, Body
# from app.agents.chatbot import run_chat

# router = APIRouter()

# @router.post("/chat")
# def chat(query: str = Body(..., embed=True)):
#     response = run_chat(query)
#     return {"response": response}