import React, { useEffect, useState } from 'react';
import { Box, Button, Heading, Text, VStack, HStack, Container } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useSupabaseAuth } from '../integrations/supabase/auth';
import { isAdmin } from '../utils/adminUtils';
import CustomNavbar from '../components/layout/CustomNavbar';
import CustomFooter from '../components/layout/CustomFooter';

const Index = () => {
  const { session } = useSupabaseAuth();
  const [userIsAdmin, setUserIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (session?.user?.id) {
        const adminStatus = await isAdmin(session.user.id);
        setUserIsAdmin(adminStatus);
      }
    };
    checkAdminStatus();
  }, [session]);

  return (
    <Box>
      <CustomNavbar />
      <Container maxW="container.xl" py={8}>
        <VStack spacing={8} align="stretch">
          <Heading as="h1" size="2xl" textAlign="center">
            Welcome to Tow Truck Services
          </Heading>
          <Text fontSize="xl" textAlign="center">
            Your reliable partner for all your towing needs.
          </Text>
          <HStack spacing={4} justify="center">
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
      </Container>
      <CustomFooter />
    </Box>
  );
};

export default Index;