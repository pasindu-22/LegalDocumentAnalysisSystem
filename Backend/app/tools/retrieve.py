from langchain_core.tools import tool
from services.vector_store import vector_store
from langchain_core.documents import Document
from typing import List, Tuple


@tool(response_format="content_and_artifact")
def retrieve(query: str) -> Tuple[str, List[Document]]:
    """
    Retrieve relevant legal document chunks for a given query.
    
    Returns:
        A combined string of sources and content (for prompting),
        and the original list of Document objects (for optional tool use).
    """
    try:
        retrieved_docs = vector_store.similarity_search(query, k=4)

        if not retrieved_docs:
            return "No documents found relevant to the query.", []

        formatted = "\n\n".join(
            f"📄 Source: {doc.metadata.get('title', 'Unknown') or doc.metadata}\n📝 Content: {doc.page_content.strip()}"
            for doc in retrieved_docs
        )

        return formatted, retrieved_docs

    except Exception as e:
        return f"Error retrieving documents: {str(e)}", []
