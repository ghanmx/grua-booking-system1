import { Box, Container, Text, VStack, Button, Image, Heading } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  const handleBookNow = () => {
    navigate("/booking");
  };

  return (
    <Box bg="gray.50" minHeight="calc(100vh - 60px)">
      <Container maxW="container.xl" py={10}>
        <VStack spacing={8} align="stretch">
          <Box textAlign="center">
            <Heading as="h1" size="2xl" mb={4}>Welcome to Tow Service Booking</Heading>
            <Text fontSize="xl" color="gray.600">Fast, reliable towing services at your fingertips</Text>
          </Box>
          <Image src="https://images.unsplash.com/photo-1562920618-5e5d3a1d0d5a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" alt="Tow truck" borderRadius="md" />
          <VStack spacing={4} align="center">
            <Text fontSize="lg" textAlign="center">
              Need a tow? We've got you covered. Our professional towing service is available 24/7.
            </Text>
            <Button colorScheme="blue" size="lg" onClick={handleBookNow}>Book Now</Button>
          </VStack>
        </VStack>
      </Container>
    </Box>
  );
};

export default Index;
