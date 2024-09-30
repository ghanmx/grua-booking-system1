import React, { useState, useEffect } from 'react';
import { Box, VStack, Heading, Text, Table, Thead, Tbody, Tr, Th, Td, Button, useToast } from "@chakra-ui/react";
import { supabase } from "../integrations/supabase";
import { useSupabaseAuth } from '../integrations/supabase/auth';

const AdminPanel = () => {
  const [services, setServices] = useState([]);
  const [towDrivers, setTowDrivers] = useState([]);
  const { session } = useSupabaseAuth();
  const toast = useToast();

  useEffect(() => {
    if (session?.user?.id) {
      fetchServices();
      fetchTowDrivers();
    }
  }, [session]);

  const fetchServices = async () => {
    const { data, error } = await supabase
      .from('services')
      .select('*, bookings(*)')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching services:', error);
    } else {
      setServices(data);
    }
  };

  const fetchTowDrivers = async () => {
    const { data, error } = await supabase
      .from('tow_drivers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching tow drivers:', error);
    } else {
      setTowDrivers(data);
    }
  };

  const updateServiceStatus = async (serviceId, newStatus) => {
    const { error } = await supabase
      .from('services')
      .update({ status: newStatus })
      .eq('id', serviceId);

    if (error) {
      console.error('Error updating service status:', error);
      toast({
        title: 'Update Failed',
        description: 'Failed to update service status',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } else {
      fetchServices();
      toast({
        title: 'Status Updated',
        description: 'Service status has been updated successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const updateTowDriverStatus = async (driverId, newStatus) => {
    const { error } = await supabase
      .from('tow_drivers')
      .update({ status: newStatus })
      .eq('id', driverId);

    if (error) {
      console.error('Error updating tow driver status:', error);
      toast({
        title: 'Update Failed',
        description: 'Failed to update tow driver status',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } else {
      fetchTowDrivers();
      toast({
        title: 'Status Updated',
        description: 'Tow driver status has been updated successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={4}>
      <VStack spacing={8} align="stretch">
        <Heading as="h1" size="xl">Admin Panel</Heading>

        <Box>
          <Heading as="h2" size="lg" mb={4}>Services</Heading>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Service Number</Th>
                <Th>Dynamic Key</Th>
                <Th>Status</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {services.map((service) => (
                <Tr key={service.id}>
                  <Td>{service.service_number}</Td>
                  <Td>{service.dynamic_key}</Td>
                  <Td>{service.status}</Td>
                  <Td>
                    <Button size="sm" onClick={() => updateServiceStatus(service.id, 'completed')}>
                      Mark Completed
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>

        <Box>
          <Heading as="h2" size="lg" mb={4}>Tow Drivers</Heading>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Phone</Th>
                <Th>Status</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {towDrivers.map((driver) => (
                <Tr key={driver.id}>
                  <Td>{driver.name}</Td>
                  <Td>{driver.phone}</Td>
                  <Td>{driver.status}</Td>
                  <Td>
                    <Button size="sm" onClick={() => updateTowDriverStatus(driver.id, driver.status === 'active' ? 'inactive' : 'active')}>
                      Toggle Status
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </VStack>
    </Box>
  );
};

export default AdminPanel;