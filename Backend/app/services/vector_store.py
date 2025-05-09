from langchain_postgres import PGVector
from langchain_huggingface import HuggingFaceEmbeddings
import os

embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-mpnet-base-v2")

vector_store = PGVector(
    embeddings=embeddings,
    collection_name="Legal_docs",
    connection=os.getenv("DATABASE_URL")
)
