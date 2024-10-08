import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { SupabaseAuthProvider } from './integrations/supabase/auth';
import Index from './pages/Index';
import About from './pages/About';
import Contact from './pages/Contact';
import AdminPanel from './pages/AdminPanel';
import ProtectedRoute from './components/common/ProtectedRoute';
import Login from './pages/Login';
import ErrorBoundary from './components/ErrorBoundary';

const App = () => {
  return (
    <ChakraProvider>
      <ErrorBoundary>
        <SupabaseAuthProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute adminOnly>
                    <AdminPanel />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </Router>
        </SupabaseAuthProvider>
      </ErrorBoundary>
    </ChakraProvider>
  );
};

export default App;