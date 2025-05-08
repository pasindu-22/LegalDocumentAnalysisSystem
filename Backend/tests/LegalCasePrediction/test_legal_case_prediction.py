import pytest
import json
import os
import asyncio
import numpy as np
import scipy.sparse
from unittest.mock import patch, MagicMock

from app.services.legal_case_prediction import (
    extract_case_details_sync,
    utils_preprocess_text,
    setup_one_hot_encoders,
    main
)

class TestLegalCasePrediction:
    
    # @patch('app.services.legal_case_prediction.PyPDF2.PdfReader')
    # def test_extract_text_from_pdf(self, mock_reader):
    #     # Setup mock
    #     mock_page1 = MagicMock()
    #     mock_page1.extract_text.return_value = "Text from page 1"
    #     mock_page2 = MagicMock()
    #     mock_page2.extract_text.return_value = "Text from page 2"
        
    #     mock_reader_instance = MagicMock()
    #     mock_reader_instance.pages = [mock_page1, mock_page2]
    #     mock_reader.return_value = mock_reader_instance
        
    #     # Call function
    #     result = extract_text_from_pdf("fake_path.pdf")
        
    #     # Verify
    #     assert result == "Text from page 1 Text from page 2"
    #     mock_reader.assert_called_once_with(mock_reader.return_value)
        
    @patch('app.services.legal_case_prediction.process_pdf')
    @patch('app.services.legal_case_prediction.asyncio')
    def test_extract_case_details_sync(self, mock_asyncio, mock_process_pdf):
        # Setup
        mock_loop = MagicMock()
        mock_asyncio.get_event_loop.return_value = mock_loop
        mock_loop.is_closed.return_value = False
        
        expected_result = {"decision_type": "majority opinion"}
        mock_loop.run_until_complete.return_value = expected_result
        
        # Call
        result = extract_case_details_sync("fake_path.pdf")
        
        # Verify
        assert result == expected_result
        mock_asyncio.get_event_loop.assert_called_once()
        mock_loop.run_until_complete.assert_called_once()
        
    def test_utils_preprocess_text(self):
        # Test basic cleaning
        result = utils_preprocess_text("This is a TEST! with 123 numbers.")
        assert result == "this is a test with 123 number"
        
        # Test with stopwords
        stopwords = ["is", "a", "with"]
        result = utils_preprocess_text("This is a TEST with numbers.", lst_stopwords=stopwords)
        assert result == "this test number"
        
        # # Test with lemmatization
        # result = utils_preprocess_text("The cats are running quickly", flg_lemm=True)
        # assert "cat" in result  # "cats" should be lemmatized to "cat"
        # assert "are" not in result  # Function doesn't lemmatize verbs without POS tagging
        
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
        
    @patch('app.services.legal_case_prediction.joblib')
    @patch('app.services.legal_case_prediction.extract_case_details_sync')
    @patch('app.services.legal_case_prediction.nltk.corpus.stopwords.words')
    def test_main_pipeline(self, mock_stopwords, mock_extract, mock_joblib):
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
        mock_extract.return_value = {
            "first_party": "United States",
            "second_party": "Jones",
            "decision_type": "majority opinion",
            "disposition": "affirmed",
            "facts": "Sample case facts"
        }
        
        # Mock stopwords
        mock_stopwords.return_value = ["a", "the"]
        
        # Run the function
        result = main("fake_path.pdf")
        
        # Verify results
        assert result["prediction"] == 1
        assert len(result["probability"]) == 2
        assert result["features"]["first_party"] == "United States"
        assert result["features"]["second_party"] == "Jones"
        
        # Verify mock calls
        mock_extract.assert_called_once_with("fake_path.pdf")
        assert mock_joblib.load.call_count == 3
        mock_vectorizer.transform.assert_called_once()
        mock_lda.transform.assert_called_once()
        mock_model.predict.assert_called_once()
        mock_model.predict_proba.assert_called_once()

