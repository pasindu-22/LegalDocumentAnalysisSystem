from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlmodel import Session
from models.document import Document
from dependencies.auth import get_current_user
from models.user import User
from db import get_session
from services.load_pdf2 import extract_text_from_upload, save_pdf_to_assets
from datetime import datetime,timezone

router = APIRouter(prefix="/documents", tags=["Documents"])

@router.post("/upload-test")
def upload_and_extract_text(
    file: UploadFile = File(...),
    user: User = Depends(get_current_user),
    db: Session = Depends(get_session)
):
    # Step 1: Extract text
    try:
        content = extract_text_from_upload(file)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to read PDF: {e}")
    
    # Step 2: Save PDF to disk
    file_path = save_pdf_to_assets(file, user_id=str(user.id))

    # Step 3: Save document to DB
    document = Document(
        user_id=user.id,
        title=file.filename,
        content=content,
        created_at=datetime.now(timezone.utc),
        type="pdf"
    )
    db.add(document)
    db.commit()
    db.refresh(document)

    # Step 4: Return response
    return {
        "message": "Document saved successfully.",
        "document_id": str(document.id),
        "file_path": file_path,
        "text_preview": content[:500]
    }
