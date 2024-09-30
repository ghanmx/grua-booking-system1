import React, { useState, useEffect } from 'react';
import { Box, VStack, Heading, Text, useToast } from "@chakra-ui/react";
import { useSupabaseAuth } from '../integrations/supabase/auth';
import { isAdmin } from '../utils/adminUtils';
import UserManagement from '../components/UserManagement';
import ServiceHistory from '../components/ServiceHistory';

const AdminPanel = () => {
  const { session } = useSupabaseAuth();
  const toast = useToast();
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

  if (!userIsAdmin) {
    return <Box p={4}><Text>You do not have admin privileges.</Text></Box>;
  }

  return (
    <Box p={4}>
      <VStack spacing={8} align="stretch">
        <Heading as="h1" size="xl">Admin Panel</Heading>
        <UserManagement showNotification={(title, description, status) => 
          toast({ title, description, status, duration: 3000, isClosable: true })}
        />
        <ServiceHistory />
      </VStack>
    </Box>
  );
};

export default AdminPanel;