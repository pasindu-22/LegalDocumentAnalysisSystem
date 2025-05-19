from fastapi import APIRouter, Body, Depends, HTTPException, FastAPI, UploadFile, File
import tempfile
import shutil
import whisper
from langchain_core.messages import HumanMessage, SystemMessage
from dependencies.auth import get_current_user
from db import get_session
from models.user import User
from agents.chatbot import query_or_respond  # assuming your function is in this module
import httpx


router = APIRouter(prefix="/chat", tags=["Chat"])

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

    # Automatically send transcribed text to /ask
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                "http://127.0.0.1:8000/chat/ask",
                json={"question": transcribed_text}
            )
            response.raise_for_status()
            answer = response.json()
            return {
                "transcription": transcribed_text,
                "chat_response": answer
            }
        except httpx.HTTPStatusError as e:
            raise HTTPException(status_code=500, detail=f"Failed to get response from /ask: {e}")


@router.post("/ask")
async def chat_with_bot(
    question: str = Body(..., embed=True),
    #user: User = Depends(get_current_user) # Optional: track who asked
    # db: AsyncSession = Depends(get_session)
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
        # chat_query = ChatQuery(
        #     user_id=user.id,
        #     question=question,
        #     response=response,
        #     query_type="legal"  # adjust if you support multiple types
        # )
        # db.add(chat_query)
        # await db.commit()
        return {"response": response}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat error: {str(e)}")
