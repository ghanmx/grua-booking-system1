import React from 'react';
import { Box, Container, Text, Image, Flex, Link } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

const Footer = () => {
  return (
    <Box bg="rgba(255,255,255,0.1)" color="white" py={8} backdropFilter="blur(10px)">
      <Container maxW="container.xl">
        <Flex direction={{ base: "column", md: "row" }} justify="space-between" align="center">
          <Image src="/mr-gruas-logo-footer.png" alt="M.R. Gruas Logo" h="60px" mb={{ base: 4, md: 0 }} />
          <Flex direction={{ base: "column", md: "row" }} align={{ base: "center", md: "flex-start" }}>
            <Link as={RouterLink} to="/" mr={4} mb={{ base: 2, md: 0 }}>Home</Link>
            <Link as={RouterLink} to="/about" mr={4} mb={{ base: 2, md: 0 }}>About</Link>
            <Link as={RouterLink} to="/contact" mr={4} mb={{ base: 2, md: 0 }}>Contact</Link>
            <Link as={RouterLink} to="/booking" mb={{ base: 2, md: 0 }}>Book Now</Link>
          </Flex>
          <Text textAlign={{ base: "center", md: "right" }}>
            © 2023 M.R. Gruas. All rights reserved.
          </Text>
        </Flex>
      </Container>
    </Box>
  );
};

export default Footer;