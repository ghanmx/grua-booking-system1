import React from 'react';
import { Box } from "@chakra-ui/react";
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <Box
      minHeight="100vh"
      display="flex"
      flexDirection="column"
      background="linear-gradient(135deg, #0f2027, #203a43, #2c5364)"
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