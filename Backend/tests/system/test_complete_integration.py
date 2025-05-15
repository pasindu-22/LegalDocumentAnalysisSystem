import pytest

def test_complete_system_flow(authenticated_client, test_doc_path):
    """
    Test a complete document processing flow from upload to analysis, 
    prediction, verification and querying.
    """
    # 1. Upload document
    with open(test_doc_path, "rb") as pdf:
        response = authenticated_client.post(
            "/documents/upload",
            files={"file": ("test.pdf", pdf, "application/pdf")}
        )
    assert response.status_code == 200
    document_id = response.json()["document_id"]
    
    # 2. Analyze document
    response = authenticated_client.post(f"/docAnalysis/analyze/{document_id}")
    assert response.status_code == 200
    
    # 3. Get case prediction
    response = authenticated_client.get(f"/predict/case/{document_id}")
    assert response.status_code == 200
    prediction = response.json()["prediction"]
    
    # 4. Submit for blockchain verification
    response = authenticated_client.post(f"/documents/verify/{document_id}")
    assert response.status_code == 200
    
    # 5. Query the document
    response = authenticated_client.post(
        f"/chat/query/{document_id}",
        json={"query": f"Is this document a {prediction}?"}
    )
    assert response.status_code == 200
    assert "response" in response.json()
    
    # 6. Check document metadata
    response = authenticated_client.get(f"/documents/{document_id}")
    assert response.status_code == 200
    metadata = response.json()
    assert metadata["id"] == document_id
    
    # This verifies that all major system components work together