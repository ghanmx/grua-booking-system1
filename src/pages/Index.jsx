import React, { useEffect, useState } from 'react';
import { Box, Button, Heading, Text, VStack } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useSupabaseAuth } from '../integrations/supabase/auth';
import { isAdmin } from '../utils/adminUtils';

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
    <Box p={8}>
      <VStack spacing={6} align="stretch">
        <Heading as="h1" size="2xl" textAlign="center">
          Welcome to Tow Truck Services
        </Heading>
        <Text fontSize="xl" textAlign="center">
          Your reliable partner for all your towing needs.
        </Text>
        <Box textAlign="center">
          <Button as={Link} to="/booking" colorScheme="blue" size="lg" mr={4}>
            Book a Service
          </Button>
          {userIsAdmin && (
            <Button as={Link} to="/admin" colorScheme="green" size="lg">
              Admin Panel
            </Button>
          )}
        </Box>
      </VStack>
    </Box>
  );
};

export default Index;