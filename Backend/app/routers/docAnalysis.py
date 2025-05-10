from  tools.file_reader import extract_text
from services.spacy_analyzer import analyze_legal_text
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from tools.spacy_loader import load_spacy_model
from services.llama_analyzer import analyze_legal_text_with_llama
import os
from dotenv import load_dotenv
load_dotenv()


router=APIRouter()
nlp=load_spacy_model()
model="llama-3.3-70b-versatile"


@router.post("/analyze/file/")
async def analyze_file(file: UploadFile = File(...)):
    try:
        # Get file extension
        _, extension = os.path.splitext(file.filename)
        extension = extension.lower()
        
        # Check if file format is supported
        if extension not in [".txt", ".pdf", ".docx"]:
            raise HTTPException(status_code=400, detail="Unsupported file format. Please upload .txt, .pdf, or .docx")
        
        # Read file content
        content = await file.read()
        
        # Extract text from file
        text = extract_text(content, extension) 
        
        # Analyze text
        analysis_result = analyze_legal_text(text,nlp)
        llama_result = analyze_legal_text_with_llama(text, model)
        
        return {
            "filename": file.filename,
            "analysis": analysis_result,
            "llama_summary": llama_result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# API endpoint for text input
@router.post("/analyze/text/")
async def analyze_text(text: str = Form(...)):
    try:
        if not text or len(text.strip()) == 0:
            raise HTTPException(status_code=400, detail="Text input cannot be empty")
        
        # Analyze text
        analysis_result = analyze_legal_text(text,nlp)
        llama_result = analyze_legal_text_with_llama(text,model)
        
        return {
            "analysis": analysis_result,
            "llama_summary": llama_result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Health check endpoint
@router.get("/health")
def health_check():
    return {"status": "ok", "spacy_model": nlp.meta["name"] if nlp else "Not loaded"}
