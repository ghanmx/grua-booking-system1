import { Box, Container, Text, VStack, Button, Image, Heading, SimpleGrid, Icon } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { FaTruck, FaMapMarkedAlt, FaPhoneAlt } from "react-icons/fa";

const Feature = ({ title, icon, children }) => {
  return (
    <VStack>
      <Icon as={icon} w={10} h={10} color="blue.500" />
      <Text fontWeight="bold">{title}</Text>
      <Text textAlign="center">{children}</Text>
    </VStack>
  );
};

const Index = () => {
  const navigate = useNavigate();

  const handleBookNow = () => {
    navigate("/billing");
  };

  return (
    <Box bg="gray.50" minHeight="calc(100vh - 60px)">
      <Container maxW="container.xl" py={10}>
        <VStack spacing={12} align="stretch">
          <Box textAlign="center">
            <Heading as="h1" size="2xl" mb={4}>
              Welcome to Tow Service Booking
            </Heading>
            <Text fontSize="xl" color="gray.600">
              Fast, reliable towing services at your fingertips
            </Text>
          </Box>

          <Box position="relative" height={["200px", "300px", "400px"]}>
            <Image
              src="https://images.unsplash.com/photo-1590361232060-61b9a025a068?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
              alt="Tow truck"
              objectFit="cover"
              width="100%"
              height="100%"
              borderRadius="md"
            />
            <Box
              position="absolute"
              top="0"
              left="0"
              right="0"
              bottom="0"
              bg="rgba(0,0,0,0.4)"
              borderRadius="md"
            />
            <VStack
              position="absolute"
              top="50%"
              left="50%"
              transform="translate(-50%, -50%)"
              textAlign="center"
              color="white"
              spacing={4}
            >
              <Heading as="h2" size="xl">
                24/7 Towing Service
              </Heading>
              <Button colorScheme="blue" size="lg" onClick={handleBookNow}>
                Book Now
              </Button>
            </VStack>
          </Box>

          <SimpleGrid columns={[1, null, 3]} spacing={10}>
            <Feature icon={FaTruck} title="24/7 Service">
              Our tow trucks are available round the clock for your convenience.
            </Feature>
            <Feature icon={FaMapMarkedAlt} title="Wide Coverage">
              We cover a large area to ensure we can reach you wherever you are.
            </Feature>
            <Feature icon={FaPhoneAlt} title="Quick Response">
              Our team is always ready to respond quickly to your call.
            </Feature>
          </SimpleGrid>

          <VStack spacing={4} align="center">
            <Text fontSize="lg" textAlign="center">
              Need a tow? We've got you covered. Our professional towing service is just a click away.
            </Text>
            <Button colorScheme="blue" size="lg" onClick={handleBookNow}>
              Book Now
            </Button>
          </VStack>
        </VStack>
      </Container>
    </Box>
  );
};

export default Index;
