import React, { useEffect, useState } from 'react';
import { Box, VStack, Heading, Tabs, TabList, TabPanels, Tab, TabPanel, useToast } from "@chakra-ui/react";
import { useSupabaseAuth } from '../integrations/supabase/auth';
import { isAdmin, isSuperAdmin } from '../utils/adminUtils';
import UserManagement from '../components/admin/UserManagement';
import ServiceManagement from '../components/admin/ServiceManagement';
import BookingManagement from '../components/admin/BookingManagement';
import AnalyticsDashboard from '../components/admin/AnalyticsDashboard';
import SMTPSettingsForm from '../components/admin/SMTPSettingsForm';

const AdminPanel = () => {
  const { session } = useSupabaseAuth();
  const toast = useToast();
  const [hasAdminAccess, setHasAdminAccess] = useState(false);
  const [isSuperAdminUser, setIsSuperAdminUser] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAdminAccess = async () => {
      setIsLoading(true);
      if (session?.user?.id) {
        try {
          const adminStatus = await isAdmin(session.user.id);
          const superAdminStatus = await isSuperAdmin(session.user.id);
          setHasAdminAccess(adminStatus);
          setIsSuperAdminUser(superAdminStatus);
        } catch (error) {
          console.error('Error checking admin status:', error);
          toast({
            title: 'Error',
            description: 'Failed to verify admin status. Please try again.',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
        }
      }
      setIsLoading(false);
    };
    checkAdminAccess();
  }, [session, toast]);

  if (isLoading) {
    return <Box p={4}><Heading as="h2" size="lg">Loading...</Heading></Box>;
  }

  if (!hasAdminAccess) {
    return <Box p={4}><Heading as="h2" size="lg">You do not have admin privileges.</Heading></Box>;
  }

  const showNotification = (title, description, status) => {
    toast({ title, description, status, duration: 3000, isClosable: true });
  };

  return (
    <Box p={4}>
      <VStack spacing={8} align="stretch">
        <Heading as="h1" size="xl">Admin Panel {isSuperAdminUser ? '(Super Admin)' : ''}</Heading>
        <Tabs isFitted variant="enclosed">
          <TabList mb="1em">
            <Tab>Analytics Dashboard</Tab>
            <Tab>Booking Management</Tab>
            <Tab>Service Management</Tab>
            <Tab>User Management</Tab>
            {isSuperAdminUser && <Tab>SMTP Settings</Tab>}
          </TabList>
          <TabPanels>
            <TabPanel>
              <AnalyticsDashboard />
            </TabPanel>
            <TabPanel>
              <BookingManagement showNotification={showNotification} />
            </TabPanel>
            <TabPanel>
              <ServiceManagement showNotification={showNotification} />
            </TabPanel>
            <TabPanel>
              <UserManagement showNotification={showNotification} userRole={isSuperAdminUser ? 'super_admin' : 'admin'} />
            </TabPanel>
            {isSuperAdminUser && (
              <TabPanel>
                <SMTPSettingsForm />
              </TabPanel>
            )}
          </TabPanels>
        </Tabs>
      </VStack>
    </Box>
  );
};

export default AdminPanel;