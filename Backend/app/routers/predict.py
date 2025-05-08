from fastapi import APIRouter,Depends,HTTPException
from services.case_prediction import predict_from_raw_text
from sqlmodel import Session,select
from models import User,Document
from db import get_session
from dependencies.auth import get_current_user

router = APIRouter(prefix="/documents", tags=["Documents"])

@router.post("/predict-case")
def predict_latest_uploaded_case(
    db: Session = Depends(get_session),
    user: User = Depends(get_current_user)
):
    statement = (
    select(Document)
    .where(Document.user_id == user.id)
    .order_by(Document.created_at.desc())
    .limit(1)
    )

    doc = db.exec(statement).first()
    if not doc:
        raise HTTPException(status_code=404, detail="No documents found for user")

    result = predict_from_raw_text(doc.content)
    return result
