import pytest

def test_document_verification_flow(authenticated_client, test_doc_path):
    # First upload a document
    with open(test_doc_path, "rb") as pdf:
        response = authenticated_client.post(
            "/documents/upload",
            files={"file": ("test.pdf", pdf, "application/pdf")}
        )
    document_id = response.json()["document_id"]
    
    # Request document verification
    response = authenticated_client.post(f"/documents/verify/{document_id}")
    assert response.status_code == 200
    data = response.json()
    assert "verification_id" in data
    verification_id = data["verification_id"]
    
    # Check verification status
    response = authenticated_client.get(f"/documents/verify/status/{verification_id}")
    assert response.status_code == 200
    status = response.json()
    assert "status" in status
    assert status["status"] in ["pending", "completed", "failed"]
    
    # Get document hash
    response = authenticated_client.get(f"/documents/{document_id}/hash")
    assert response.status_code == 200
    assert "hash" in response.json()