import React, { createContext, useState, useContext, useEffect } from 'react';

const ChatContext = createContext();

export const useChatContext = () => useContext(ChatContext);

export const ChatContextProvider = ({ children }) => {
  const API_URL = process.env.REACT_APP_API_URL || 'http://89.116.122.39:8000';
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [isFetchingHistory, setIsFetchingHistory] = useState(false);
  const token = localStorage.getItem("authToken");

  // Fetch chat history when component mounts
  useEffect(() => {
    fetchChatHistory();
  }, []);

  const fetchChatHistory = async () => {
    try {
      setIsFetchingHistory(true);
      const response = await fetch('/chat/');
      if (!response.ok) {
        throw new Error('Failed to fetch chat history');
      }
      const data = await response.json();
      console.log(data)
      setChatHistory(data);
      setIsFetchingHistory(false);
    } catch (err) {
      console.error('Error fetching chat history:', err);
      setError('Failed to load chat history');
      setIsFetchingHistory(false);
    }
  };

  const loadChatById = async (chatId) => {
    try {
      setIsLoading(true);
      // Find the chat in history or fetch from backend if needed
      const chat = chatHistory.find(chat => chat.id === chatId);
      
      if (chat) {
        // Convert the chat history item to message format
        const userMessage = {
          id: chat.id + '-question',
          text: chat.question,
          isUser: true,
          timestamp: chat.timestamp
        };
        
        const botMessage = {
          id: chat.id + '-response',
          text: chat.response,
          isUser: false,
          timestamp: chat.timestamp
        };
        
        setMessages([userMessage, botMessage]);
      } else {
        // If not in cached history, could fetch from backend
        setError('Chat not found');
      }
      setIsLoading(false);
    } catch (err) {
      setError('Failed to load chat');
      setIsLoading(false);
    }
  };

  const sendMessage = async (text, attachment = null) => {
    try {
      // Add user message
      const userMessage = { 
        id: Date.now(), 
        text, 
        isUser: true, 
        timestamp: new Date().toISOString()
      };
      console.log(token);
      
      setMessages(prev => [...prev, userMessage]);
      setIsLoading(true);
      
      // Call backend API
      const response = await fetch(`${API_URL}/chat/ask`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ question: text }),
      });
      
      if (!response.ok) {
        const errorText = await response.text(); // Read raw response text
  console.error('Backend error response:', errorText); // Log server message
  throw new Error(`Server responded with status ${response.status}`);
      }
      
      const data = await response.json();
      
      const botMessage = {
        id: Date.now() + 1,
        text: data.response,
        isUser: false,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, botMessage]);
      
      // Refresh chat history to include new chat
      fetchChatHistory();
      
      setIsLoading(false);
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to get response');
      setIsLoading(false);
    }
  };
  
  const clearChat = () => setMessages([]);

  return (
    <ChatContext.Provider value={{ 
      messages, 
      isLoading, 
      error, 
      sendMessage,
      clearChat,
      chatHistory,
      isFetchingHistory,
      loadChatById
    }}>
      {children}
    </ChatContext.Provider>
  );
};