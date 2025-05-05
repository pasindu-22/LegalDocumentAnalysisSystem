import docx2txt
import PyPDF2
import io
import tempfile
import os
from fastapi import HTTPException


def extract_text(content: bytes, extension: str) -> str:
    if extension == ".txt":
        return content.decode("utf-8")
    elif extension == ".pdf":
        pdf_reader = PyPDF2.PdfReader(io.BytesIO(content))
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text() + "\n"
        return text
    elif extension == ".docx":
        with tempfile.NamedTemporaryFile(delete=False, suffix=".docx") as temp_file:
            temp_file.write(content)
            temp_file_path = temp_file.name
        
        text = docx2txt.process(temp_file_path)
        os.unlink(temp_file_path)
        return text
    else:
        raise HTTPException(status_code=400, detail="Unsupported file format")