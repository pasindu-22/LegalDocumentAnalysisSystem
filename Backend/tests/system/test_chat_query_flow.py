import pytest

def test_document_query_flow(authenticated_client, test_doc_path):
    # First upload a document
    with open(test_doc_path, "rb") as pdf:
        response = authenticated_client.post(
            "/documents/upload",
            files={"file": ("test.pdf", pdf, "application/pdf")}
        )
    document_id = response.json()["document_id"]
    
    # Test document query
    query = "What are the main parties mentioned in this document?"
    response = authenticated_client.post(
        f"/chat/query/{document_id}",
        json={"query": query}
    )
    assert response.status_code == 200
    data = response.json()
    assert "response" in data
    assert len(data["response"]) > 0
    assert "context" in data

def test_chat_history_flow(authenticated_client, test_doc_path):
    # First upload a document
    with open(test_doc_path, "rb") as pdf:
        response = authenticated_client.post(
            "/documents/upload",
            files={"file": ("test.pdf", pdf, "application/pdf")}
        )
    document_id = response.json()["document_id"]
    
    # Start a chat session
    response = authenticated_client.post("/chat/session/start")
    assert response.status_code == 200
    chat_id = response.json()["chat_id"]
    
    # Send first message
    response = authenticated_client.post(
        f"/chat/message",
        json={
            "chat_id": chat_id,
            "document_id": document_id,
            "message": "What type of document is this?"
        }
    )
    assert response.status_code == 200
    assert "response" in response.json()
    
    # Send follow-up message that refers to previous context
    response = authenticated_client.post(
        f"/chat/message",
        json={
            "chat_id": chat_id,
            "message": "Who are the parties involved in it?"
        }
    )
    assert response.status_code == 200
    assert "response" in response.json()
    
    # Get chat history
    response = authenticated_client.get(f"/chat/history/{chat_id}")
    assert response.status_code == 200
    history = response.json()
    assert len(history) >= 2  # At least our two messages