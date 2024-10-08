import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CustomNavbar from './components/layout/CustomNavbar';
import CustomFooter from './components/layout/CustomFooter';
import Index from './pages/Index';
import Login from './pages/Login';
import BookingForm from './pages/BookingForm';
import AdminPanel from './pages/AdminPanel';
import ProtectedRoute from './components/common/ProtectedRoute';
import { SupabaseProvider } from './integrations/supabase';
import { SupabaseAuthProvider } from './integrations/supabase/auth';

function App() {
  return (
    <ChakraProvider>
      <SupabaseProvider>
        <SupabaseAuthProvider>
          <Router>
            <CustomNavbar />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/booking" element={<ProtectedRoute><BookingForm /></ProtectedRoute>} />
              <Route path="/admin" element={<ProtectedRoute adminOnly><AdminPanel /></ProtectedRoute>} />
            </Routes>
            <CustomFooter />
          </Router>
        </SupabaseAuthProvider>
      </SupabaseProvider>
    </ChakraProvider>
  );
}

export default App;