// import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { theme } from './theme';

// Page Components
import Dashboard from './pages/Dashboard';
import ChatInterface from './pages/ChatInterface';
import DocumentAnalysis from './pages/DocumentAnalysis';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Signin from './pages/Signin';

// Layout Component
import AppLayout from './components/layout/AppLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Context
import { ChatContextProvider } from './context/ChatContext';
import { AuthProvider } from './context/AuthContext';
import DocumentVerification from './pages/DocumentVerification';
import PredictCase from './pages/PredictCase';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <ChatContextProvider>
          <BrowserRouter>
            <Routes>

              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/signin" element={<Signin />} />

              {/* Protected routes */}
              <Route element={<ProtectedRoute />}>
                <Route
                  path="/*"
                  element={
                    <AppLayout>
                      <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/chat" element={<ChatInterface />} />
                        <Route path="/documents" element={<DocumentAnalysis />} />
                        <Route path="/verification" element={<DocumentVerification />} />
                        <Route path="/predict-case" element={ <PredictCase />} />
                        <Route path="/settings" element={<Settings />} />
                      </Routes>
                    </AppLayout>
                  }
                />
              </Route>
              
              {/* Redirect to login as default route */}
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </BrowserRouter>
        </ChatContextProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}


export default App;