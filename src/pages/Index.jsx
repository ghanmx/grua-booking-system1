import { Box, Container, Text, VStack, Button, Heading, SimpleGrid, Icon, Input, FormControl, FormLabel } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { FaTruck, FaMapMarkedAlt, FaPhoneAlt } from "react-icons/fa";

const Feature = ({ title, icon, children }) => {
  return (
    <VStack>
      <Icon as={icon} w={10} h={10} color="#AE1100" />
      <Text fontWeight="bold">{title}</Text>
      <Text textAlign="center">{children}</Text>
    </VStack>
  );
};

const Index = () => {
  const navigate = useNavigate();

  const handleBookNow = () => {
    navigate("/booking");
  };

  return (
    <Box bg="#EBECF0" minHeight="calc(100vh - 60px)">
      <Container maxW="container.xl" py={10}>
        <VStack spacing={12} align="stretch">
          <Box textAlign="center">
            <Heading as="h1" size="2xl" mb={4} color="#61677C" textShadow="1px 1px 1px #FFF">
              Welcome to Tow Service Booking
            </Heading>
            <Text fontSize="xl" color="#BABECC" textShadow="1px 1px 1px #FFF">
              Fast, reliable towing services at your fingertips
            </Text>
          </Box>

          <Box as="form" width="320px" margin="0 auto" padding="16px">
            <VStack spacing={4} align="stretch">
              <Heading as="h2" size="lg" textAlign="center">Sign up</Heading>
              <FormControl>
                <FormLabel srOnly>Email Address</FormLabel>
                <Input type="text" placeholder="Email Address" bg="#EBECF0" boxShadow="inset 2px 2px 5px #BABECC, inset -5px -5px 10px #FFF" border="none" _focus={{ boxShadow: "inset 1px 1px 2px #BABECC, inset -1px -1px 2px #FFF" }} />
              </FormControl>
              <FormControl>
                <FormLabel srOnly>Password</FormLabel>
                <Input type="password" placeholder="Password" bg="#EBECF0" boxShadow="inset 2px 2px 5px #BABECC, inset -5px -5px 10px #FFF" border="none" _focus={{ boxShadow: "inset 1px 1px 2px #BABECC, inset -1px -1px 2px #FFF" }} />
              </FormControl>
              <Button bg="#EBECF0" color="#AE1100" fontWeight="bold" boxShadow="-5px -5px 20px #FFF, 5px 5px 20px #BABECC" _hover={{ boxShadow: "-2px -2px 5px #FFF, 2px 2px 5px #BABECC" }} _active={{ boxShadow: "inset 1px 1px 2px #BABECC, inset -1px -1px 2px #FFF" }} width="100%">
                Log in
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
            <Text fontSize="lg" textAlign="center" color="#BABECC" textShadow="1px 1px 1px #FFF">
              Need a tow? We've got you covered. Our professional towing service is just a click away.
            </Text>
            <Button
              bg="#EBECF0"
              color="#AE1100"
              fontWeight="bold"
              boxShadow="-5px -5px 20px #FFF, 5px 5px 20px #BABECC"
              _hover={{
                boxShadow: "-2px -2px 5px #FFF, 2px 2px 5px #BABECC"
              }}
              _active={{
                boxShadow: "inset 1px 1px 2px #BABECC, inset -1px -1px 2px #FFF"
              }}
              size="lg"
              onClick={handleBookNow}
              width="100%"
            >
              Book Now
            </Button>
          </VStack>
        </VStack>
      </Container>
    </Box>
  );
};

export default Index;