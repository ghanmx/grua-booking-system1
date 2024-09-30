import React from 'react';
import { Box, Container, Text, Image, Flex } from "@chakra-ui/react";

const Footer = () => {
  return (
    <Box bg="gray.800" color="white" py={8}>
      <Container maxW="container.xl">
        <Flex direction={{ base: "column", md: "row" }} justify="space-between" align="center">
          <Image src="/mr-gruas-logo-footer.png" alt="M.R. Gruas Logo" h="60px" mb={{ base: 4, md: 0 }} />
          <Text textAlign={{ base: "center", md: "right" }}>
            © 2023 M.R. Gruas. All rights reserved.
          </Text>
        </Flex>
      </Container>
    </Box>
  );
};

export default Footer;