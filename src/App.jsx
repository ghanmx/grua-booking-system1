import React, { useEffect } from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { SupabaseAuthProvider } from './integrations/supabase/auth';
import { initializeMonitoring, logPageView } from './utils/monitoring';
import { runAccessibilityChecks } from './utils/accessibility';
import { Helmet } from 'react-helmet';
import theme from './theme';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Index from './pages/Index';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import BookingForm from './pages/BookingForm';
import AdminPanel from './pages/AdminPanel';
import Confirmation from './pages/Confirmation';
import ErrorBoundary from './components/ErrorBoundary';

const queryClient = new QueryClient();

function AppContent() {
  const location = useLocation();

  useEffect(() => {
    logPageView(location.pathname);
  }, [location]);

  return (
    <>
      <Helmet>
        <title>M.R. Gruas - Towing Service</title>
        <meta name="description" content="Professional towing services in your area. Fast, reliable, and affordable." />
        <meta name="keywords" content="towing, roadside assistance, car towing, emergency towing" />
      </Helmet>
      <Navbar />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/booking" element={<BookingForm />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/confirmation" element={<Confirmation />} />
      </Routes>
      <Footer />
    </>
  );
}

function App() {
  useEffect(() => {
    initializeMonitoring();
    runAccessibilityChecks();
  }, []);

  return (
    <ErrorBoundary>
      <ChakraProvider theme={theme}>
        <SupabaseAuthProvider>
          <QueryClientProvider client={queryClient}>
            <Router>
              <AppContent />
            </Router>
            <ReactQueryDevtools initialIsOpen={false} />
          </QueryClientProvider>
        </SupabaseAuthProvider>
      </ChakraProvider>
    </ErrorBoundary>
  );
}

export default App;