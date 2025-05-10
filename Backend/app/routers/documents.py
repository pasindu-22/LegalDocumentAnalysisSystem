from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlmodel import Session
from models.document import Document
from dependencies.auth import get_current_user
from models.user import User
from db import get_session
from services.load_pdf2 import extract_text_from_upload, save_pdf_to_assets
from datetime import datetime,timezone
from utils.calculate_hash import calculate_hash
from services.ethereum import add_document_to_blockchain

router = APIRouter(prefix="/documents", tags=["Documents"])

@router.post("/upload-test")
async def upload_and_extract_text(
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
    await file.seek(0) #have to reset the pointer to read again
    ethereum_content=await file.read() #since chamoda uses just file.read() when adding to block chain I must to do the same heree
    # Step 3: Register on Ethereum blockchain
    doc_hash = calculate_hash(ethereum_content)
    print(doc_hash)
    metadata = {
        "user_id": str(user.id),
        "file_name": file.filename,
        "file_path": file_path,
        "timestamp": datetime.now(timezone.utc).isoformat()
    }
    eth_result = add_document_to_blockchain(doc_hash, metadata)
    print(eth_result)

    # Step 3: Save document to DB
    document = Document(
        user_id=user.id,
        title=file.filename,
        content=content,
        created_at=datetime.now(timezone.utc),
        type="pdf",
        ethereum_tx=eth_result.get("tx_hash"),
    )
    db.add(document)
    db.commit()
    db.refresh(document)

    # print("Saved document:", document.model_dump())


    # Step 4: Return response
    return {
        "message": "Document saved successfully.",
        "document_id": str(document.id),
        "file_path": file_path,
        "text_preview": content[:500],
        "ethereum_tx":eth_result.get("tx_hash")
    }
