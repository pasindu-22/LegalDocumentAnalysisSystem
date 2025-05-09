from fastapi import APIRouter, Depends, File, UploadFile, HTTPException
from sqlalchemy.orm import Session
from utils import calculate_hash
from services.ethereum import verify_document_on_blockchain

router = APIRouter(prefix="/verification", tags=["verification"])

@router.post("/verify")
async def verify_document_api(
    file: UploadFile = File(...),
):
    """Verify a document against the blockchain"""
    try:
        # Read the file content
        file_content = await file.read()
        
        # Calculate hash
        doc_hash = calculate_hash(file_content)
        
        # Verify on Ethereum blockchain
        eth_result = verify_document_on_blockchain(doc_hash)
        
        # Document is verified on Ethereum blockchain
        verified = eth_result.get("verified", False)
        
        # Verify document
        result = {
            "doc_hash": doc_hash,
            "verified": verified,
            "ethereum_info": eth_result,
        }
        
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))