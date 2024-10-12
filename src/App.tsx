import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SupabaseProvider } from './integrations/supabase';
import { SupabaseAuthProvider } from './integrations/supabase/auth';
import Index from './pages/Index';
import About from './pages/About';
import Contact from './pages/Contact';
import AdminPanel from './pages/AdminPanel';
import ProtectedRoute from './components/common/ProtectedRoute';
import Login from './pages/Login';
import ErrorBoundary from './components/ErrorBoundary';
import BookingForm from './pages/BookingForm'; // Import the BookingForm component

const queryClient = new QueryClient();

const App = () => {
  return (
    <ChakraProvider>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <SupabaseProvider>
            <SupabaseAuthProvider>
              <Router>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/booking" element={<BookingForm />} /> {/* Add this line */}
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
          </SupabaseProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    </ChakraProvider>
  );
};

export default App;