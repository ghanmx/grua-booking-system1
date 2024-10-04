import React, { useState } from 'react';
import { Box, VStack, Heading, Table, Thead, Tbody, Tr, Th, Td, Button, Input, useToast } from "@chakra-ui/react";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../integrations/supabase/index.jsx';

const ServiceManagement = ({ showNotification }) => {
  const [newService, setNewService] = useState({ name: '', description: '', price: '' });
  const queryClient = useQueryClient();
  const toast = useToast();

  const { data: services, isLoading, error } = useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const { data, error } = await supabase.from('services').select('*');
      if (error) throw error;
      return data;
    },
  });

  const addServiceMutation = useMutation({
    mutationFn: async (newService) => {
      const { data, error } = await supabase.from('services').insert([newService]);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries('services');
      showNotification('Service Added', 'The new service has been added successfully.', 'success');
      setNewService({ name: '', description: '', price: '' });
    },
    onError: (error) => {
      showNotification('Error', `Failed to add service: ${error.message}`, 'error');
    },
  });

  const deleteServiceMutation = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from('services').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries('services');
      showNotification('Service Deleted', 'The service has been deleted successfully.', 'success');
    },
    onError: (error) => {
      showNotification('Error', `Failed to delete service: ${error.message}`, 'error');
    },
  });

  const handleAddService = () => {
    addServiceMutation.mutate(newService);
  };

  const handleDeleteService = (id) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      deleteServiceMutation.mutate(id);
    }
  };

  if (isLoading) return <Box>Loading services...</Box>;
  if (error) return <Box>Error loading services: {error.message}</Box>;

  return (
    <Box>
      <VStack spacing={4} align="stretch">
        <Heading as="h2" size="lg">Service Management</Heading>
        <Box>
          <Input
            placeholder="Service Name"
            value={newService.name}
            onChange={(e) => setNewService({ ...newService, name: e.target.value })}
            mb={2}
          />
          <Input
            placeholder="Description"
            value={newService.description}
            onChange={(e) => setNewService({ ...newService, description: e.target.value })}
            mb={2}
          />
          <Input
            placeholder="Price"
            type="number"
            value={newService.price}
            onChange={(e) => setNewService({ ...newService, price: e.target.value })}
            mb={2}
          />
          <Button onClick={handleAddService} colorScheme="blue">Add Service</Button>
        </Box>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Description</Th>
              <Th>Price</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {services.map((service) => (
              <Tr key={service.id}>
                <Td>{service.name}</Td>
                <Td>{service.description}</Td>
                <Td>${service.price}</Td>
                <Td>
                  <Button
                    colorScheme="red"
                    size="sm"
                    onClick={() => handleDeleteService(service.id)}
                  >
                    Delete
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </VStack>
    </Box>
  );
};

export default ServiceManagement;
