import React from "react";
import { ChakraProvider, Box, ColorModeScript } from "@chakra-ui/react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { SupabaseProvider } from './integrations/supabase';
import { SupabaseAuthProvider } from './integrations/supabase/auth';
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import Navbar from "./components/Navbar";
import Index from "./pages/Index";
import About from "./pages/About";
import Contact from "./pages/Contact";
import BookingForm from "./pages/BookingForm";
import BillingProcess from "./pages/BillingProcess";
import Confirmation from "./pages/Confirmation";
import Payment from "./pages/Payment";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import theme from "./theme";
import ErrorBoundary from "./components/ErrorBoundary";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <SupabaseProvider>
          <SupabaseAuthProvider>
            <ChakraProvider theme={theme}>
              <ColorModeScript initialColorMode={theme.config.initialColorMode} />
              <Router>
                <Box minHeight="100vh" bg="gray.50">
                  <Navbar />
                  <Box p={4}>
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="/booking" element={
                        <ProtectedRoute>
                          <BookingForm />
                        </ProtectedRoute>
                      } />
                      <Route path="/billing" element={
                        <ProtectedRoute>
                          <BillingProcess />
                        </ProtectedRoute>
                      } />
                      <Route path="/payment" element={
                        <ProtectedRoute>
                          <Elements stripe={stripePromise}>
                            <Payment />
                          </Elements>
                        </ProtectedRoute>
                      } />
                      <Route path="/confirmation" element={
                        <ProtectedRoute>
                          <Confirmation />
                        </ProtectedRoute>
                      } />
                      <Route path="/login" element={<Login />} />
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </Box>
                </Box>
              </Router>
            </ChakraProvider>
          </SupabaseAuthProvider>
        </SupabaseProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
