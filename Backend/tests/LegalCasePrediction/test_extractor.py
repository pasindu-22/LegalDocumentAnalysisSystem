import pytest
import asyncio
import json
import os
from unittest.mock import patch, MagicMock, AsyncMock

from app.agents.extractor import (
    summarize_chunk, 
    extract_case_summary, 
    process_raw_text
)

class TestExtractor:
    
    @pytest.mark.asyncio
    @patch('app.agents.extractor.ChatGoogleGenerativeAI')
    async def test_summarize_chunk(self, mock_llm):
        # Setup mock response
        mock_instance = AsyncMock()
        mock_response = MagicMock()
        mock_response.content = "This is a summarized chunk."
        mock_instance.ainvoke.return_value = mock_response
        
        # Test with provided llm instance
        result = await summarize_chunk("This is some legal text", mock_instance)
        assert result == "This is a summarized chunk."
        mock_instance.ainvoke.assert_called_once()
        
        # Reset for next test
        mock_instance.reset_mock()
        
        # Test with global llm (should create one)
        with patch('app.agents.extractor.llm', mock_instance):
            result = await summarize_chunk("This is some legal text")
            assert result == "This is a summarized chunk."
            mock_instance.ainvoke.assert_called_once()

    @pytest.mark.asyncio
    @patch('app.agents.extractor.ChatGoogleGenerativeAI')
    async def test_extract_case_summary(self, mock_llm):
        # Setup mock response
        mock_instance = AsyncMock()
        mock_response = MagicMock()
        mock_response.content = """```json
        {
            "decision_type": "majority opinion",
            "disposition": "affirmed",
            "first_party": "United States",
            "second_party": "Jones",
            "facts": "Sample case facts"
        }
        ```"""
        mock_instance.ainvoke.return_value = mock_response
        
        # Test function
        result = await extract_case_summary("Some legal summary", mock_instance)
        
        # Verify result
        assert result["decision_type"] == "majority opinion"
        assert result["disposition"] == "affirmed"
        assert result["first_party"] == "United States"
        assert result["second_party"] == "Jones"
        assert result["facts"] == "Sample case facts"
        
    @pytest.mark.asyncio
    @patch('app.agents.extractor.Document')
    @patch('app.agents.extractor.text_splitter')
    @patch('app.agents.extractor.ChatGoogleGenerativeAI')
    @patch('app.agents.extractor.summarize_chunk')
    @patch('app.agents.extractor.extract_case_summary')
    async def test_process_raw_text(self, mock_extract_summary, mock_summarize, mock_llm, 
                              mock_splitter, mock_document):
        # Setup mocks
        mock_document_instance = MagicMock()
        mock_document.return_value = mock_document_instance
        
        mock_chunks = [MagicMock()]
        mock_chunks[0].page_content = "Sample legal text"
        
        mock_splitter.split_documents.return_value = mock_chunks
        mock_summarize.return_value = "Summarized text"
        
        expected_result = {
            "decision_type": "majority opinion",
            "disposition": "affirmed",
            "first_party": "United States",
            "second_party": "Jones",
            "facts": "Sample case facts"
        }
        mock_extract_summary.return_value = expected_result
        
        # Call the function
        result = await process_raw_text("Sample legal text content")
        
        # Verify results and interactions
        assert result == expected_result
        mock_document.assert_called_once_with(page_content="Sample legal text content")
        mock_splitter.split_documents.assert_called_once()
        mock_summarize.assert_called_once()
        mock_extract_summary.assert_called_once_with("Summarized text", mock_llm.return_value)