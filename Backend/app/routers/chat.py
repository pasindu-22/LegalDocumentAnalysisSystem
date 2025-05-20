import logging
from fastapi import APIRouter, Body, Depends, HTTPException, FastAPI, UploadFile, File
import tempfile
import shutil
import whisper
from langchain_core.messages import HumanMessage, SystemMessage, AIMessage
from dependencies.auth import get_current_user
from db import get_session
from models.user import User
from agents.chatbot import query_or_respond  # assuming your function is in this module
import httpx
from sqlmodel import Session, select
import traceback
from models.chat_query import ChatQuery  # adjust path if needed
from typing import List


router = APIRouter(prefix="/chat", tags=["Chat"])

@router.get("/")
def get_chat_history(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_session)
) -> List[ChatQuery]:
    statement = (
        select(ChatQuery)
        .where(ChatQuery.user_id == user.id)
        .order_by(ChatQuery.timestamp.desc())  # Use `timestamp` instead of `created_at`
    )
    results = db.exec(statement).all()
    return results

# @router.get("/")
# def get_chat_history(
#     user: User = Depends(get_current_user),
#     db: Session = Depends(get_session)
# ) -> List[ChatQuery]:
#     statement = select(ChatQuery).where(ChatQuery.user_id == user.id).order_by(ChatQuery.created_at.desc())
#     results = db.exec(statement).all()
#     return results

model = whisper.load_model("tiny") 

# @router.post("/transcribe")
# async def transcribe(file: UploadFile = File(...)):
#     with tempfile.NamedTemporaryFile(delete=False, suffix=".webm") as tmp:
#         content = await file.read()
#         tmp.write(content)
#         tmp_path = tmp.name

#     result = model.transcribe(tmp_path)
#     print("FFMPEG exists:", shutil.which("ffmpeg")) 
#     return {"text": result["text"]}


@router.post("/transcribe")
async def transcribe(file: UploadFile = File(...)):
    with tempfile.NamedTemporaryFile(delete=False, suffix=".webm") as tmp:
        content = await file.read()
        tmp.write(content)
        tmp_path = tmp.name

    result = model.transcribe(tmp_path)
    transcribed_text = result["text"]
    print("FFMPEG exists:", shutil.which("ffmpeg"))
    return {"transcription": transcribed_text}

@router.post("/ask")
async def chat_with_bot(
    question: str = Body(..., embed=True),
    user: User = Depends(get_current_user),
    db: Session = Depends(get_session),
):
    try:
        # Fetch the 5 most recent messages by this user (descending timestamp)
        recent_queries = (
            db.query(ChatQuery)
            .filter(ChatQuery.user_id == user.id)
            .order_by(ChatQuery.timestamp.desc())
            .limit(5)
            .all()
        )

        # Build the chat history: alternate Human -> Assistant messages
        history = []
        for query in reversed(recent_queries):  # reverse to get chronological order
            history.append(HumanMessage(content=query.question))
            history.append(AIMessage(content=query.response))

        # Append the current question
        history.append(HumanMessage(content=question))

        # Insert system prompt at the beginning
        messages = [
            SystemMessage(content="""You are a helpful assistant. If you're unsure or need more context, use the retrieve tool.""")
        ] + history

        # Query the LLM
        response = await query_or_respond(messages)

        # Save the new query
        chat_query = ChatQuery(
            user_id=user.id,
            question=question,
            response=response,
            query_type="legal"
        )
        db.add(chat_query)
        db.commit()
        db.refresh(chat_query)

        return {"response": response}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat error: {str(e)}")


# @router.post("/ask")
# async def chat_with_bot(
#     question: str = Body(..., embed=True),
#     user: User = Depends(get_current_user), # Optional: track who asked
#     db: Session = Depends(get_session),
# ):
#     try:
#         messages = [
#             SystemMessage(content="""
#                 You are a helpful assistant.
#                 If you're unsure or need more context, use the retrieve tool.
#             """),
#             HumanMessage(content=question)
#         ]

#         response = await query_or_respond(messages)
#         chat_query = ChatQuery(
#             user_id=user.id,
#             question=question,
#             response=response,
#             query_type="legal"  # adjust if you support multiple types
#         )
#         print(f"Chat query: {chat_query}")
#         db.add(chat_query)
#         db.commit()
#         db.refresh(chat_query)
#         return {"response": response}
    
#     except Exception as e:
#         traceback.print_exc()  # ✅ This shows the real error in the console
#         raise HTTPException(status_code=500, detail=f"Chat error: {str(e)}")
