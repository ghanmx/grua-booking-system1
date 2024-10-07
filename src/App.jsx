import React, { Suspense } from "react";
import { ChakraProvider, Box, ColorModeScript } from "@chakra-ui/react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { SupabaseProvider, SupabaseAuthProvider } from './integrations/supabase';
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import LoadingSpinner from "./components/LoadingSpinner";
import ErrorBoundary from "./components/common/ErrorBoundary";
import theme from "./theme";

// Lazy load components
const Index = React.lazy(() => import("./pages/Index"));
const About = React.lazy(() => import("./pages/About"));
const Contact = React.lazy(() => import("./pages/Contact"));
const BookingForm = React.lazy(() => import("./pages/BookingForm"));
const Confirmation = React.lazy(() => import("./pages/Confirmation"));
const Login = React.lazy(() => import("./pages/Login"));
const AdminPanel = React.lazy(() => import("./pages/AdminPanel"));
const ProtectedRoute = React.lazy(() => import("./components/common/ProtectedRoute"));

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
                <Box minHeight="100vh" display="flex" flexDirection="column">
                  <Navbar />
                  <Box flex="1">
                    <Suspense fallback={<LoadingSpinner />}>
                      <Routes>
                        <Route path="/" element={<Index />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/booking" element={
                          <ProtectedRoute>
                            <Elements stripe={stripePromise}>
                              <BookingForm />
                            </Elements>
                          </ProtectedRoute>
                        } />
                        <Route path="/confirmation" element={
                          <ProtectedRoute>
                            <Confirmation />
                          </ProtectedRoute>
                        } />
                        <Route path="/admin" element={
                          <ProtectedRoute adminOnly>
                            <AdminPanel />
                          </ProtectedRoute>
                        } />
                        <Route path="/login" element={<Login />} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                      </Routes>
                    </Suspense>
                  </Box>
                  <Footer />
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