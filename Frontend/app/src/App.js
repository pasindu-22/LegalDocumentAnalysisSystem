import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { theme } from './theme';

// Page Components
import Dashboard from './pages/Dashboard';
import ChatInterface from './pages/ChatInterface';
import DocumentAnalysis from './pages/DocumentAnalysis';
import Settings from './pages/Settings';

// Layout Component
import AppLayout from './components/layout/AppLayout';

// Context
import { ChatContextProvider } from './context/ChatContext';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ChatContextProvider>
        <BrowserRouter>
          <AppLayout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/chat" element={<ChatInterface />} />
              <Route path="/documents" element={<DocumentAnalysis />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </AppLayout>
        </BrowserRouter>
      </ChatContextProvider>
    </ThemeProvider>
  );
}

export default App;