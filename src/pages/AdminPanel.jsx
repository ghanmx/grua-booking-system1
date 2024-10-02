import React from 'react';
import { Box, VStack, Heading, Tabs, TabList, TabPanels, Tab, TabPanel, useToast } from "@chakra-ui/react";
import { useSupabaseAuth } from '../integrations/supabase/auth';
import UserManagement from '../components/UserManagement';
import ServiceManagement from '../components/ServiceManagement';
import BookingManagement from '../components/BookingManagement';
import AnalyticsDashboard from '../components/AnalyticsDashboard';
import { ROLES } from '../constants/roles';

const AdminPanel = () => {
  const { session } = useSupabaseAuth();
  const toast = useToast();

  if (!session || session.user.role !== ROLES.ADMIN) {
    return <Box p={4}><Heading as="h2" size="lg">You do not have admin privileges.</Heading></Box>;
  }

  return (
    <Box p={4}>
      <VStack spacing={8} align="stretch">
        <Heading as="h1" size="xl">Admin Panel</Heading>
        <Tabs isFitted variant="enclosed">
          <TabList mb="1em">
            <Tab>Analytics Dashboard</Tab>
            <Tab>Booking Management</Tab>
            <Tab>Service Management</Tab>
            <Tab>User Management</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <AnalyticsDashboard />
            </TabPanel>
            <TabPanel>
              <BookingManagement
                showNotification={(title, description, status) => 
                  toast({ title, description, status, duration: 3000, isClosable: true })}
              />
            </TabPanel>
            <TabPanel>
              <ServiceManagement
                showNotification={(title, description, status) => 
                  toast({ title, description, status, duration: 3000, isClosable: true })}
              />
            </TabPanel>
            <TabPanel>
              <UserManagement 
                showNotification={(title, description, status) => 
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