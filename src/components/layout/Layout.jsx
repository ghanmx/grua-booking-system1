import React from 'react';
import { Box, keyframes } from "@chakra-ui/react";
import Navbar from './Navbar';
import Footer from './Footer';

const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const Layout = ({ children }) => {
  return (
    <Box
      minHeight="100vh"
      display="flex"
      flexDirection="column"
      background="linear-gradient(135deg, #0f2027, #203a43, #2c5364, #0f2027)"
      backgroundSize="400% 400%"
      animation={`${gradientAnimation} 15s ease infinite`}
      color="white"
    >
      <Navbar />
      <Box flex="1" padding="4">
        {children}
      </Box>
      <Footer />
    </Box>
  );
};

export default Layout;