import React, { lazy, Suspense } from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import CustomNavbar from './components/layout/CustomNavbar';
import CustomFooter from './components/layout/CustomFooter';
import { SupabaseProvider, SupabaseAuthProvider } from './integrations/supabase';
import ProtectedRoute from './components/common/ProtectedRoute';

const Index = lazy(() => import('./pages/Index'));
const Login = lazy(() => import('./pages/Login'));
const BookingForm = lazy(() => import('./pages/BookingForm'));
const AdminPanel = lazy(() => import('./pages/AdminPanel'));

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider>
        <SupabaseProvider>
          <SupabaseAuthProvider>
            <Router>
              <CustomNavbar />
              <Suspense fallback={<div>Loading...</div>}>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/booking" element={<ProtectedRoute><BookingForm /></ProtectedRoute>} />
                  <Route path="/admin" element={<ProtectedRoute adminOnly><AdminPanel /></ProtectedRoute>} />
                </Routes>
              </Suspense>
              <CustomFooter />
            </Router>
          </SupabaseAuthProvider>
        </SupabaseProvider>
      </ChakraProvider>
    </QueryClientProvider>
  );
}

export default App;