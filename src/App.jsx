import React from "react";
import { ChakraProvider, Box, VStack } from "@chakra-ui/react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Index from "./pages/Index";
import About from "./pages/About";
import Contact from "./pages/Contact";
import BookingForm from "./pages/BookingForm";
import Confirmation from "./pages/Confirmation";
import Payment from "./pages/Payment";
import Login from "./pages/Login";
import { SupabaseProvider } from './integrations/supabase';
import { SupabaseAuthProvider } from './integrations/supabase/auth';

function App() {
  return (
    <ChakraProvider>
      <SupabaseProvider>
        <SupabaseAuthProvider>
          <Router>
            <Box minHeight="100vh" bg="gray.50">
              <Navbar />
              <Box p={4}>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/booking" element={<BookingForm />} />
                  <Route path="/payment" element={<Payment />} />
                  <Route path="/confirmation" element={<Confirmation />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Box>
              <VStack p={4} bg="gray.100">
                <Box as="footer" width="100%" textAlign="center">
                  © 2023 Tow Service App. All rights reserved.
                </Box>
              </VStack>
            </Box>
          </Router>
        </SupabaseAuthProvider>
      </SupabaseProvider>
    </ChakraProvider>
  );
}

export default App;
