import React from "react";
import { ChakraProvider, Box, VStack, Heading, Text } from "@chakra-ui/react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
                  <Route path="/confirmation" element={<Confirmation />} />
                  <Route path="/payment" element={<Payment />} />
                  <Route path="/login" element={<Login />} />
                </Routes>
              </Box>
              <VStack p={4} bg="gray.100">
                <Heading size="md">Tow Service App</Heading>
                <Text>© 2023 All rights reserved</Text>
              </VStack>
            </Box>
          </Router>
        </SupabaseAuthProvider>
      </SupabaseProvider>
    </ChakraProvider>
  );
}

export default App;
