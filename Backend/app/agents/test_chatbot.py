import unittest
from unittest.mock import AsyncMock, patch, MagicMock
from langchain_core.messages import HumanMessage, SystemMessage, ToolMessage
from app.agents.chatbot import query_or_respond

class TestQueryOrRespond(unittest.IsolatedAsyncioTestCase):
    
    def setUp(self):
        # Common mock setup can go here
        pass
    import unittest
from unittest.mock import AsyncMock, patch, MagicMock
from langchain_core.messages import HumanMessage, SystemMessage, ToolMessage

# Mock the retrieve module before importing chatbot
with patch.dict('sys.modules', {
    'app.tools.retrieve': MagicMock(),
    'app.services.vector_store': MagicMock()
}):
    from app.agents.chatbot import query_or_respond

class TestQueryOrRespond(unittest.IsolatedAsyncioTestCase):
    
    @patch("app.agents.chatbot.init_chat_model")
    @patch("app.agents.chatbot.retrieve")
    async def test_query_or_respond_no_tool_invoked(self, mock_retrieve, mock_init_chat_model):
        # Mock setup
        mock_llm = AsyncMock()
        mock_llm.bind_tools.return_value = mock_llm
        mock_llm.ainvoke.return_value = AsyncMock(
            tool_calls=[],
            content="This is a direct response."
        )
        mock_init_chat_model.return_value = mock_llm

        # Test data
        messages = [
            SystemMessage(content="You are a helpful assistant."),
            HumanMessage(content="What is the capital of France?")
        ]

        # Execute
        response = await query_or_respond(messages)

        # Verify
        self.assertEqual(response, "This is a direct response.")
        mock_llm.ainvoke.assert_called_once_with(messages)
        mock_retrieve.assert_not_called()
    
    # Add other test cases here...

if __name__ == "__main__":
    unittest.main()
    @patch("app.agents.chatbot.init_chat_model")
    @patch("app.agents.chatbot.retrieve")
    async def test_query_or_respond_no_tool_invoked(self, mock_retrieve, mock_init_chat_model):
        # Mock setup
        mock_llm = AsyncMock()
        mock_llm.bind_tools.return_value = mock_llm
        mock_llm.ainvoke.return_value = AsyncMock(
            tool_calls=[],
            content="This is a direct response."
        )
        mock_init_chat_model.return_value = mock_llm

        # Test data
        messages = [
            SystemMessage(content="You are a helpful assistant."),
            HumanMessage(content="What is the capital of France?")
        ]

        # Execute
        response = await query_or_respond(messages)

        # Verify
        self.assertEqual(response, "This is a direct response.")
        mock_llm.ainvoke.assert_called_once_with(messages)
        mock_retrieve.assert_not_called()
    
    @patch("app.agents.chatbot.init_chat_model")
    @patch("app.agents.chatbot.retrieve")
    async def test_query_or_respond_with_tool_invoked(self, mock_retrieve, mock_init_chat_model):
        # Create a mock tool call ID for verification
        tool_call_id = "call_123"
        
        # Setup mock LLM with side effect for two calls
        mock_llm = AsyncMock()
        mock_llm.bind_tools.return_value = mock_llm
        mock_llm.ainvoke.side_effect = [
            AsyncMock(
                tool_calls=[{
                    "name": "retrieve", 
                    "args": {"query": "five great debates"},
                    "id": tool_call_id
                }],
                content="Tool invocation response."
            ),
            AsyncMock(content="Final response based on context.")
        ]
        mock_init_chat_model.return_value = mock_llm

        # Mock the retrieve tool
        mock_retrieve.return_value = "Retrieved context about debates."

        # Test data
        messages = [
            SystemMessage(content="You are a helpful assistant."),
            HumanMessage(content="Tell me about the five great debates.")
        ]

        # Execute
        response = await query_or_respond(messages)

        # Verify
        self.assertEqual(response, "Final response based on context.")
        
        # Check retrieve was called correctly
        mock_retrieve.assert_called_once_with("five great debates")
        
        # Check LLM was called twice
        self.assertEqual(mock_llm.ainvoke.call_count, 2)
        
        # Verify second LLM call had the right message structure
        second_call_args = mock_llm.ainvoke.call_args_list[1][0][0]
        self.assertIsInstance(second_call_args[0], SystemMessage)
        self.assertIsInstance(second_call_args[1], HumanMessage)
        self.assertIsInstance(second_call_args[2], type(mock_llm.ainvoke.side_effect[0]))  # AIMessage
        self.assertIsInstance(second_call_args[3], ToolMessage)
        self.assertEqual(second_call_args[3].tool_call_id, tool_call_id)

if __name__ == "__main__":
    unittest.main()