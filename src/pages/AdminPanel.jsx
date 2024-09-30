import React, { useState, useEffect } from 'react';
import { Box, VStack, Heading, Tabs, TabList, TabPanels, Tab, TabPanel, useToast } from "@chakra-ui/react";
import { useSupabaseAuth } from '../integrations/supabase/auth';
import { isAdmin } from '../utils/adminUtils';
import UserManagement from '../components/UserManagement';
import ServiceManagement from '../components/ServiceManagement';
import CreateAdminUser from '../components/CreateAdminUser';
import BookingManagement from '../components/BookingManagement';

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
    return <Box p={4}><Heading as="h2" size="lg">You do not have admin privileges.</Heading></Box>;
  }

  return (
    <Box p={4}>
      <VStack spacing={8} align="stretch">
        <Heading as="h1" size="xl">Admin Panel</Heading>
        <Tabs isFitted variant="enclosed">
          <TabList mb="1em">
            <Tab>User Management</Tab>
            <Tab>Service Management</Tab>
            <Tab>Booking Management</Tab>
            <Tab>Create Admin</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <UserManagement showNotification={(title, description, status) => 
                toast({ title, description, status, duration: 3000, isClosable: true })}
              />
            </TabPanel>
            <TabPanel>
              <ServiceManagement showNotification={(title, description, status) => 
                toast({ title, description, status, duration: 3000, isClosable: true })}
              />
            </TabPanel>
            <TabPanel>
              <BookingManagement showNotification={(title, description, status) => 
                toast({ title, description, status, duration: 3000, isClosable: true })}
              />
            </TabPanel>
            <TabPanel>
              <CreateAdminUser showNotification={(title, description, status) => 
                toast({ title, description, status, duration: 3000, isClosable: true })}
              />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
    </Box>
  );
};

export default AdminPanel;