import React from 'react';
import { Box, VStack, Heading, Table, Thead, Tbody, Tr, Th, Td, Button, useToast } from "@chakra-ui/react";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPaidServicesWaiting, updateServiceStatus } from '../server/db';

const ServiceHistory = () => {
  const toast = useToast();
  const queryClient = useQueryClient();

  const { data: services, isLoading, error } = useQuery({
    queryKey: ['paidServicesWaiting'],
    queryFn: getPaidServicesWaiting,
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, newStatus }) => updateServiceStatus(id, newStatus),
    onSuccess: () => {
      queryClient.invalidateQueries('paidServicesWaiting');
      toast({
        title: 'Status Updated',
        description: 'The service status has been updated successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    },
  });

  const handleStatusUpdate = (id, newStatus) => {
    updateStatusMutation.mutate({ id, newStatus });
  };

  if (isLoading) return <Box>Loading services...</Box>;
  if (error) return <Box>Error loading services: {error.message}</Box>;

  return (
    <Box>
      <Heading as="h2" size="lg" mb={4}>Paid Services Waiting to be Performed</Heading>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>User</Th>
            <Th>Service Type</Th>
            <Th>Created At</Th>
            <Th>Status</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {services.map((service) => (
            <Tr key={service.id}>
              <Td>{service.id}</Td>
              <Td>{service.user_id}</Td>
              <Td>{service.service_type}</Td>
              <Td>{new Date(service.created_at).toLocaleString()}</Td>
              <Td>{service.status}</Td>
              <Td>
                <Button
                  colorScheme="blue"
                  size="sm"
                  onClick={() => handleStatusUpdate(service.id, 'in_progress')}
                >
                  Start Service
                </Button>
                <Button
                  colorScheme="green"
                  size="sm"
                  ml={2}
                  onClick={() => handleStatusUpdate(service.id, 'completed')}
                >
                  Complete
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default ServiceHistory;