import pytest
import json
import os
import asyncio
import numpy as np
import scipy.sparse
from unittest.mock import patch, MagicMock, AsyncMock

from app.services.case_prediction import (
    preprocess_text,
    setup_one_hot_encoders,
    predict_from_raw_text
)

class TestCasePrediction:
        
    def test_preprocess_text(self):
        # Test basic cleaning
        result = preprocess_text("This is a TEST! with 123 numbers.")
        assert result == "this is a test with 123 numbers"
        
        # Test with stopwords
        stopwords = ["is", "a", "with"]
        result = preprocess_text("This is a TEST with numbers.", stopwords)
        assert result == "this test numbers"
        
        # Test with lemmatization
        result = preprocess_text("The cats are running quickly")
        assert "cat" in result  # "cats" should be lemmatized to "cat"
        assert "running" in result  # Our function doesn't lemmatize verbs
        
    def test_setup_one_hot_encoders(self):
        # Call function
        decision_encoder, disposition_encoder = setup_one_hot_encoders()
        
        # Test decision type encoder
        decision_result = decision_encoder.transform([["majority opinion"]])
        assert decision_result.shape[1] > 0
        assert 1.0 in decision_result[0]  # One-hot encoding should have a 1.0
        
        # Test disposition encoder
        disposition_result = disposition_encoder.transform([["affirmed"]])
        assert disposition_result.shape[1] > 0
        assert 1.0 in disposition_result[0]
        
    @patch('app.services.case_prediction.joblib')
    @patch('app.services.case_prediction.asyncio.run')
    @patch('app.services.case_prediction.nltk.corpus.stopwords.words')
    @patch('app.services.case_prediction.process_raw_text')
    def test_predict_from_raw_text(self, mock_process_raw_text, mock_stopwords, mock_asyncio_run, mock_joblib):
        # Setup mocks
        mock_vectorizer = MagicMock()
        mock_vectorizer.transform.return_value = scipy.sparse.csr_matrix(np.array([[1, 2, 3]]))
        
        mock_lda = MagicMock()
        mock_lda.transform.return_value = np.array([[0.1, 0.2, 0.3]])
        mock_lda.components_.shape = (3, 3)
        
        mock_model = MagicMock()
        mock_model.predict.return_value = np.array([1])
        mock_model.predict_proba.return_value = np.array([[0.3, 0.7]])
        mock_model.n_features_in_ = 3
        
        # Set up joblib to return our mock models
        mock_joblib.load.side_effect = [mock_vectorizer, mock_lda, mock_model]
        
        # Mock the extraction result
        extracted_features = {
            "first_party": "United States",
            "second_party": "Jones",
            "decision_type": "majority opinion",
            "disposition": "affirmed",
            "facts": "Sample case facts"
        }
        mock_process_raw_text.return_value = AsyncMock(return_value=extracted_features)
        mock_asyncio_run.return_value = extracted_features
        
        # Mock stopwords
        mock_stopwords.return_value = ["a", "the"]
        
        # Run the function
        result = predict_from_raw_text("This is some sample text from a legal document")
        
        # Verify results
        assert result["prediction"] == 1
        assert len(result["probability"]) == 2
        assert result["features"]["first_party"] == "United States"
        assert result["features"]["second_party"] == "Jones"
        
        # Verify mock calls
        mock_asyncio_run.assert_called_once()
        assert mock_joblib.load.call_count == 3
        mock_vectorizer.transform.assert_called_once()
        mock_lda.transform.assert_called_once()
        mock_model.predict.assert_called_once()
        mock_model.predict_proba.assert_called_once()
    
    @patch('app.services.case_prediction.process_raw_text')
    @patch('app.services.case_prediction.asyncio')
    def test_predict_from_raw_text_extraction_failure(self, mock_asyncio, mock_process_raw_text):
        # Setup for testing error handling
        error_result = {"error": "Could not extract facts"}
        mock_asyncio.run.return_value = error_result
        
        # Run the function
        result = predict_from_raw_text("Invalid text")
        
        # Verify error handling
        assert "error" in result
        assert result["error"] == "Extraction failed"
        assert result["details"] == error_result