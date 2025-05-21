from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from uuid import uuid4
from pathlib import Path
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_postgres import PGVector
from dependencies.auth import get_current_user  
from models.user import User
from dotenv import load_dotenv
import os

router = APIRouter(prefix="/chat", tags=["Chat"])
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
UPLOAD_DIR = "assets/uploads"
Path(UPLOAD_DIR).mkdir(parents=True, exist_ok=True)

embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-mpnet-base-v2")
vectorstore = PGVector(
    connection=DATABASE_URL,
    collection_name="legal_docs",
    embeddings=embeddings
)

@router.post("/upload")
async def chat_upload(
    file: UploadFile = File(...),
    user: User = Depends(get_current_user),
):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")

    # Save to disk (optional for traceability)
    user_folder = Path(UPLOAD_DIR) / str(user.id)
    user_folder.mkdir(parents=True, exist_ok=True)
    file_path = user_folder / file.filename

    with open(file_path, "wb") as f:
        f.write(await file.read())

    # Load and split
    loader = PyPDFLoader(str(file_path))
    pages = loader.load()

    splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    splits = splitter.split_documents(pages)

    # Add metadata
    doc_id = str(uuid4())
    for doc in splits:
        doc.metadata.update({
            "user_id": str(user.id),
            "document_id": doc_id,
            "title": file.filename,
            "type": "pdf"
        })

    # Store embeddings
    vectorstore.add_documents(splits)

    return {
        "message": "PDF uploaded, embedded, and stored successfully.",
        "document_id": doc_id,
        "chunks_stored": len(splits)
    }
