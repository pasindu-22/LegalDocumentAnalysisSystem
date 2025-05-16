from fastapi import APIRouter, Body, Depends, HTTPException
from langchain_core.messages import HumanMessage, SystemMessage
from dependencies.auth import get_current_user
from db import get_session
from models.user import User
from agents.chatbot import query_or_respond  # assuming your function is in this module

router = APIRouter(prefix="/chat", tags=["Chat"])

# @router.get("/")
# def get_chat_history(
#     user: User = Depends(get_current_user),
#     db: Session = Depends(get_session)
# ) -> List[ChatQuery]:
#     statement = select(ChatQuery).where(ChatQuery.user_id == user.id).order_by(ChatQuery.created_at.desc())
#     results = db.exec(statement).all()
#     return results


@router.post("/ask")
async def chat_with_bot(
    question: str = Body(..., embed=True),
    user: User = Depends(get_current_user) # Optional: track who asked
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
