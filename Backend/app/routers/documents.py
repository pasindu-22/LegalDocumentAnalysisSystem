from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from services.load_pdf2 import extract_text_from_upload, save_pdf_to_assets
from dependencies.auth import get_current_user
from models.user import User

router = APIRouter(prefix="/documents", tags=["Documents"])

@router.post("/upload-test")
def upload_and_extract_text(
    file: UploadFile = File(...),
    user: User = Depends(get_current_user)
):
    # Step 1: Extract text directly from in-memory PDF
    try:
        content = extract_text_from_upload(file)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to read PDF: {e}")
    
    # Step 2: Save PDF for backup
    file_path = save_pdf_to_assets(file, user_id=str(user.id))

    # Step 3: Return preview
    return {
        "message": "PDF uploaded and text extracted successfully.",
        "file_path": file_path,
        "text_preview": content[:500]  # Show first 500 chars only
    }
