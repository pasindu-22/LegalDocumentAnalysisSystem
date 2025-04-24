from langchain_postgres import PGVector
from langchain_huggingface import HuggingFaceEmbeddings

embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-mpnet-base-v2")

vector_store = PGVector(
    embeddings=embeddings,
    collection_name="Legal_docs",
    connection="postgresql+psycopg://postgres:Thinklife@localhost:5432/LDAS"
)
