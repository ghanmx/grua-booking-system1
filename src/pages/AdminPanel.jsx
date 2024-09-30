import React from 'react';
import { Box, VStack, Heading, useToast } from "@chakra-ui/react";
import { useSupabaseAuth } from '../integrations/supabase/auth';
import UserManagement from '../components/UserManagement';
import BookingManagement from '../components/BookingManagement';

const AdminPanel = () => {
  const { session } = useSupabaseAuth();
  const toast = useToast();

  if (!session?.user) {
    return <Box p={4}><Heading as="h1" size="xl">Access Denied</Heading></Box>;
  }

  const showNotification = (title, description, status) => {
    toast({
      title,
      description,
      status,
      duration: 5000,
      isClosable: true,
    });
  };

  return (
    <Box p={4}>
      <VStack spacing={8} align="stretch">
        <Heading as="h1" size="xl">Admin Panel</Heading>
        <UserManagement showNotification={showNotification} />
        <BookingManagement showNotification={showNotification} />
      </VStack>
    </Box>
  );
};

export default AdminPanel;