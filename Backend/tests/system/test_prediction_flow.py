import pytest

def test_case_prediction_flow(authenticated_client, test_doc_path):
    # First upload a document
    with open(test_doc_path, "rb") as pdf:
        response = authenticated_client.post(
            "/documents/upload",
            files={"file": ("test.pdf", pdf, "application/pdf")}
        )
    document_id = response.json()["document_id"]
    
    # Test case prediction
    response = authenticated_client.get(f"/predict/case/{document_id}")
    assert response.status_code == 200
    data = response.json()
    assert "prediction" in data
    assert "confidence" in data
    assert "features" in data
    assert isinstance(data["confidence"], float)
    assert data["confidence"] >= 0 and data["confidence"] <= 1

def test_text_based_prediction(authenticated_client):
    # Test direct text prediction
    test_text = """
    This Agreement is entered into as of July 1, 2023, by and between ABC Corp,
    a Delaware corporation with offices at 123 Main Street, and XYZ LLC, a limited
    liability company with offices at 456 Oak Avenue. The parties agree to the following
    terms and conditions...
    """
    
    response = authenticated_client.post(
        "/predict/text",
        json={"text": test_text}
    )
    assert response.status_code == 200
    data = response.json()
    assert "prediction" in data
    assert "confidence" in data
    # Since this looks like a contract, check prediction
    assert data["prediction"] == "Contract" or "Agreement" in data["prediction"]