import { Container, Text, VStack, Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  const handleBookNow = () => {
    navigate("/booking");
  };

  return (
    <Container centerContent maxW="container.md" height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
      <VStack spacing={4}>
        <Text fontSize="2xl">Welcome to Tow Service Booking</Text>
        <Text>Start by selecting a service or navigating through the menu.</Text>
      <Button colorScheme="blue" onClick={handleBookNow}>Book Now</Button>
      </VStack>
    </Container>
  );
};

export default Index;