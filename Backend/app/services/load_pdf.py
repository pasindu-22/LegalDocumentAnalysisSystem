from langchain_community.document_loaders import PyPDFLoader
from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter
from typing_extensions import List, TypedDict
import asyncio
from vector_store import vector_store

file_path = r"C:\Users\raguk\LDAS\LegalDocumentAnalysisSystem\Backend\app\assets\history_demo.pdf"

async def load_pdf_pages(file_path):
    loader = PyPDFLoader(file_path)
    pages = []
    async for page in loader.alazy_load():
        pages.append(page)
    return pages

async def main():
    pages = await load_pdf_pages(file_path)
    print(f"{pages[0].metadata}\n")
    print(pages[0].page_content)
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    all_splits = text_splitter.split_documents(pages)
    _ = vector_store.add_documents(documents=all_splits)
    

asyncio.run(main())