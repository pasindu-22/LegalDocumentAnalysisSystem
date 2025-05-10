from fastapi import APIRouter, Depends, File, UploadFile, HTTPException
from sqlalchemy.orm import Session
from utils.calculate_hash import calculate_hash
print("import issue")
from services.ethereum import verify_document_on_blockchain
print("not an issue")
router = APIRouter(prefix="/verification", tags=["verification"])

@router.post("/verify")
async def verify_document_api(
    file: UploadFile = File(...),
):
    """Verify a document against the blockchain"""
    try:
        # Read the file content
        await file.seek(0) 
        file_content = await file.read()
        
        # Calculate hash
        
        doc_hash = calculate_hash(file_content)
        print(doc_hash)
        # Verify on Ethereum blockchain
        eth_result = verify_document_on_blockchain(doc_hash)
        print(eth_result)
        # Document is verified on Ethereum blockchain
        verified = eth_result.get("verified", False)
        print(verified)
        # Verify document
        result = {
            "doc_hash": doc_hash,
            "verified": verified,
            "ethereum_info": eth_result,
        }
        
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))