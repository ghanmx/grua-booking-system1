import React from 'react';
import { Box, Button, Heading, Text, VStack, HStack, Container, Image, SimpleGrid, Icon } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useSupabaseAuth } from '../integrations/supabase/auth';
import { isAdmin } from '../utils/adminUtils';
import { FaTruck, FaMapMarkedAlt, FaCalendarAlt, FaCheckCircle } from 'react-icons/fa';

const FeatureCard = ({ icon, title, description }) => (
  <VStack
    bg="rgba(255,255,255,0.1)"
    p={6}
    borderRadius="lg"
    align="start"
    spacing={4}
    backdropFilter="blur(10px)"
    transition="all 0.3s"
    _hover={{ transform: 'translateY(-5px)', boxShadow: 'lg' }}
  >
    <Icon as={icon} boxSize={10} color="blue.400" />
    <Heading size="md">{title}</Heading>
    <Text>{description}</Text>
  </VStack>
);

const Index = () => {
  const { session } = useSupabaseAuth();
  const [userIsAdmin, setUserIsAdmin] = React.useState(false);

  React.useEffect(() => {
    const checkAdminStatus = async () => {
      if (session?.user?.id) {
        const adminStatus = await isAdmin(session.user.id);
        setUserIsAdmin(adminStatus);
      }
    };
    checkAdminStatus();
  }, [session]);

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={12} align="stretch">
        <Box textAlign="center">
          <Heading as="h1" size="2xl" mb={4}>
            Welcome to MRGruas Towing Services
          </Heading>
          <Text fontSize="xl">
            Your reliable partner for all your towing needs.
          </Text>
        </Box>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
          <VStack align="start" spacing={6}>
            <Heading as="h2" size="xl">
              Why Choose MRGruas?
            </Heading>
            <Text fontSize="lg">
              MRGruas offers professional towing services with a focus on reliability, speed, and customer satisfaction. Our state-of-the-art booking system ensures a seamless experience from request to delivery.
            </Text>
            <HStack spacing={4}>
              <Button as={Link} to="/booking" colorScheme="blue" size="lg">
                Book a Service
              </Button>
              {userIsAdmin && (
                <Button as={Link} to="/admin" colorScheme="green" size="lg">
                  Admin Panel
                </Button>
              )}
            </HStack>
          </VStack>
          <Box>
            <Image src="/mr-gruas-hero.jpg" alt="MRGruas Tow Truck" borderRadius="lg" />
          </Box>
        </SimpleGrid>

        <Box>
          <Heading as="h2" size="xl" mb={6} textAlign="center">
            How It Works
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={10}>
            <FeatureCard
              icon={FaTruck}
              title="Choose Your Service"
              description="Select from our range of towing services tailored to your needs."
            />
            <FeatureCard
              icon={FaMapMarkedAlt}
              title="Set Your Location"
              description="Easily input your pickup and drop-off locations for accurate pricing."
            />
            <FeatureCard
              icon={FaCalendarAlt}
              title="Schedule the Pickup"
              description="Choose a convenient date and time for your towing service."
            />
            <FeatureCard
              icon={FaCheckCircle}
              title="Confirm and Relax"
              description="Review your booking, confirm, and we'll take care of the rest."
            />
          </SimpleGrid>
        </Box>

        <Box textAlign="center">
          <Heading as="h2" size="xl" mb={4}>
            Ready to Get Started?
          </Heading>
          <Text fontSize="lg" mb={6}>
            Experience the ease and reliability of MRGruas towing services today.
          </Text>
          <Button as={Link} to="/booking" colorScheme="blue" size="lg">
            Book Your Tow Now
          </Button>
        </Box>
      </VStack>
    </Container>
  );
};

export default Index;