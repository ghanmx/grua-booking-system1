import React, { useState, useEffect } from 'react';
import { Box, VStack, Heading, Tabs, TabList, TabPanels, Tab, TabPanel, useToast, Input, Select, Button, Flex } from "@chakra-ui/react";
import { useSupabaseAuth } from '../integrations/supabase/auth';
import { isAdmin } from '../utils/adminUtils';
import UserManagement from './UserManagement';
import ServiceManagement from './ServiceManagement';
import CreateAdminUser from './CreateAdminUser';
import BookingManagement from './BookingManagement';

const AdminPanel = () => {
  const { session } = useSupabaseAuth();
  const toast = useToast();
  const [userIsAdmin, setUserIsAdmin] = useState(false);
  const [filter, setFilter] = useState({ search: '', serviceType: '', status: '' });

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (session?.user?.id) {
        const adminStatus = await isAdmin(session.user.id);
        setUserIsAdmin(adminStatus);
      }
    };
    checkAdminStatus();
  }, [session]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter(prev => ({ ...prev, [name]: value }));
  };

  const applyFilter = () => {
    // This function will be passed to child components to apply the filter
    console.log('Applying filter:', filter);
    // Implement the filtering logic in each management component
  };

  if (!userIsAdmin) {
    return <Box p={4}><Heading as="h2" size="lg">You do not have admin privileges.</Heading></Box>;
  }

  return (
    <Box p={4}>
      <VStack spacing={8} align="stretch">
        <Heading as="h1" size="xl">Admin Panel</Heading>
        
        <Flex mb={4}>
          <Input
            placeholder="Search..."
            name="search"
            value={filter.search}
            onChange={handleFilterChange}
            mr={2}
          />
          <Select
            placeholder="Service Type"
            name="serviceType"
            value={filter.serviceType}
            onChange={handleFilterChange}
            mr={2}
          >
            <option value="towing">Towing</option>
            <option value="repair">Repair</option>
            {/* Add more service types as needed */}
          </Select>
          <Select
            placeholder="Status"
            name="status"
            value={filter.status}
            onChange={handleFilterChange}
            mr={2}
          >
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </Select>
          <Button onClick={applyFilter} colorScheme="blue">Apply Filter</Button>
        </Flex>

        <Tabs isFitted variant="enclosed">
          <TabList mb="1em">
            <Tab>User Management</Tab>
            <Tab>Service Management</Tab>
            <Tab>Booking Management</Tab>
            <Tab>Create Admin</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <UserManagement 
                showNotification={(title, description, status) => 
                  toast({ title, description, status, duration: 3000, isClosable: true })}
                filter={filter}
              />
            </TabPanel>
            <TabPanel>
              <ServiceManagement 
                showNotification={(title, description, status) => 
                  toast({ title, description, status, duration: 3000, isClosable: true })}
                filter={filter}
              />
            </TabPanel>
            <TabPanel>
              <BookingManagement 
                showNotification={(title, description, status) => 
                  toast({ title, description, status, duration: 3000, isClosable: true })}
                filter={filter}
              />
            </TabPanel>
            <TabPanel>
              <CreateAdminUser 
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