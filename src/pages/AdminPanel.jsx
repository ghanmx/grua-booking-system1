import React from 'react';
import { Box, VStack, Heading } from "@chakra-ui/react";
import { useSupabaseAuth } from '../integrations/supabase/auth';
import UserManagement from '../components/UserManagement';

const AdminPanel = () => {
  const { session } = useSupabaseAuth();

  if (!session?.user) {
    return <Box p={4}><Heading as="h1" size="xl">Access Denied</Heading></Box>;
  }

  return (
    <Box p={4}>
      <VStack spacing={8} align="stretch">
        <Heading as="h1" size="xl">Admin Panel</Heading>
        <UserManagement />
      </VStack>
    </Box>
  );
};

export default AdminPanel;