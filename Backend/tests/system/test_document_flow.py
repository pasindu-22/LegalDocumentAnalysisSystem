import os
import pytest
from pathlib import Path

# Helper to create test documents folder
@pytest.fixture
def test_doc_path():
    test_dir = Path("tests/test_assets")
    test_dir.mkdir(exist_ok=True)
    
    # Create a simple test PDF if it doesn't exist
    test_pdf = test_dir / "sample_legal_doc.pdf"
    if not test_pdf.exists():
        pytest.skip("Test PDF not available at tests/test_assets/sample_legal_doc.pdf")
    
    return test_pdf

def test_document_upload_flow(authenticated_client, test_doc_path):
    # Test document upload
    with open(test_doc_path, "rb") as pdf:
        response = authenticated_client.post(
            "/documents/upload",
            files={"file": ("test.pdf", pdf, "application/pdf")}
        )
    assert response.status_code == 200
    data = response.json()
    assert "document_id" in data
    assert "filename" in data
    assert data["filename"] == "test.pdf"
    
    # Store document_id for subsequent tests
    document_id = data["document_id"]
    return document_id

def test_document_retrieval(authenticated_client, test_doc_path):
    # First upload a document
    document_id = test_document_upload_flow(authenticated_client, test_doc_path)
    
    # Test document retrieval
    response = authenticated_client.get(f"/documents/{document_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == document_id
    assert "filename" in data
    assert "upload_date" in data
    
    # Test document content retrieval
    response = authenticated_client.get(f"/documents/{document_id}/content")
    assert response.status_code == 200
    assert "content" in response.json()
    assert len(response.json()["content"]) > 0

def test_document_analysis(authenticated_client, test_doc_path):
    # First upload a document
    document_id = test_document_upload_flow(authenticated_client, test_doc_path)
    
    # Test document analysis
    response = authenticated_client.post(f"/docAnalysis/analyze/{document_id}")
    assert response.status_code == 200
    data = response.json()
    assert "document_id" in data
    assert "analysis_results" in data
    assert "entities" in data["analysis_results"]