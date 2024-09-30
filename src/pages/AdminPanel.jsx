import React, { useState } from 'react';
import { Box, VStack, Heading, Text, Table, Thead, Tbody, Tr, Th, Td, Button, useToast } from "@chakra-ui/react";
import { supabase } from "../integrations/supabase";
import { useSupabaseAuth } from '../integrations/supabase/auth';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const AdminPanel = () => {
  const { session } = useSupabaseAuth();
  const toast = useToast();
  const queryClient = useQueryClient();

  const fetchServices = async () => {
    const { data, error } = await supabase
      .from('services')
      .select('*, bookings(*)')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  };

  const { data: services, isLoading, error } = useQuery({
    queryKey: ['services'],
    queryFn: fetchServices,
  });

  const updateServiceStatus = useMutation({
    mutationFn: async ({ id, status }) => {
      const { error } = await supabase
        .from('services')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries('services');
      toast({
        title: 'Status Updated',
        description: 'Service status has been updated successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    },
    onError: (error) => {
      toast({
        title: 'Update Failed',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    },
  });

  const deleteService = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries('services');
      toast({
        title: 'Service Deleted',
        description: 'Service has been deleted successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    },
    onError: (error) => {
      toast({
        title: 'Delete Failed',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    },
  });

  if (isLoading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

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
                <Th>Status</Th>
                <Th>User</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {services.map((service) => (
                <Tr key={service.id}>
                  <Td>{service.service_number}</Td>
                  <Td>{service.status}</Td>
                  <Td>{service.bookings?.[0]?.userName || 'N/A'}</Td>
                  <Td>
                    <Button
                      size="sm"
                      colorScheme="green"
                      mr={2}
                      onClick={() => updateServiceStatus.mutate({ id: service.id, status: 'approved' })}
                    >
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      colorScheme="red"
                      mr={2}
                      onClick={() => updateServiceStatus.mutate({ id: service.id, status: 'rejected' })}
                    >
                      Reject
                    </Button>
                    <Button
                      size="sm"
                      colorScheme="gray"
                      onClick={() => deleteService.mutate(service.id)}
                    >
                      Delete
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