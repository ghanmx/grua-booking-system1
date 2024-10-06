import React, { lazy, Suspense } from "react";
import { ChakraProvider, Box, ColorModeScript, Spinner, Text } from "@chakra-ui/react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { SupabaseAuthProvider } from './integrations/supabase';
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import ErrorBoundary from "./components/common/ErrorBoundary";
import theme from "./theme";

const Index = lazy(() => import("./pages/Index"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const BookingForm = lazy(() => import("./pages/BookingForm"));
const Confirmation = lazy(() => import("./pages/Confirmation"));
const Login = lazy(() => import("./pages/Login"));
const AdminPanel = lazy(() => import("./pages/AdminPanel"));
const ProtectedRoute = lazy(() => import("./components/common/ProtectedRoute"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

function App() {
  return (
    <ErrorBoundary fallback={<Text>Something went wrong. Please refresh the page.</Text>}>
      <QueryClientProvider client={queryClient}>
        <SupabaseAuthProvider>
          <ChakraProvider theme={theme}>
            <ColorModeScript initialColorMode={theme.config.initialColorMode} />
            <Router>
              <Box minHeight="100vh" display="flex" flexDirection="column">
                <Navbar />
                <Box flex="1">
                  <Suspense fallback={
                    <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                      <Spinner size="xl" />
                      <Text ml={4}>Loading...</Text>
                    </Box>
                  }>
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
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;