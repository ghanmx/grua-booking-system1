import React from 'react';
import { Box, VStack, Heading, Table, Thead, Tbody, Tr, Th, Td, Button, useDisclosure } from "@chakra-ui/react";
import { useServices, useAddService, useUpdateService, useDeleteService } from '../../integrations/supabase/hooks/services';

const ServiceManagement = ({ showNotification }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data: services, isLoading, isError } = useServices();
  const addServiceMutation = useAddService();
  const updateServiceMutation = useUpdateService();
  const deleteServiceMutation = useDeleteService();

  if (isLoading) return <Box>Loading services...</Box>;
  if (isError) return <Box>Error loading services</Box>;

  const handleAddService = async (newService) => {
    try {
      await addServiceMutation.mutateAsync(newService);
      showNotification('Service Added', 'New service has been added successfully', 'success');
      onClose();
    } catch (error) {
      showNotification('Error', 'Failed to add new service', 'error');
    }
  };

  const handleUpdateService = async (updatedService) => {
    try {
      await updateServiceMutation.mutateAsync(updatedService);
      showNotification('Service Updated', 'Service has been updated successfully', 'success');
    } catch (error) {
      showNotification('Error', 'Failed to update service', 'error');
    }
  };

  const handleDeleteService = async (serviceId) => {
    try {
      await deleteServiceMutation.mutateAsync(serviceId);
      showNotification('Service Deleted', 'Service has been deleted successfully', 'success');
    } catch (error) {
      showNotification('Error', 'Failed to delete service', 'error');
    }
  };

  return (
    <VStack spacing={4} align="stretch">
      <Heading size="lg">Service Management</Heading>
      <Button onClick={onOpen}>Add New Service</Button>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Description</Th>
            <Th>Base Price</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {services.map((service) => (
            <Tr key={service.id}>
              <Td>{service.name}</Td>
              <Td>{service.description}</Td>
              <Td>${service.base_price}</Td>
              <Td>
                <Button size="sm" onClick={() => handleUpdateService(service)}>Edit</Button>
                <Button size="sm" colorScheme="red" ml={2} onClick={() => handleDeleteService(service.id)}>Delete</Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      {/* Add modal for adding/editing services here */}
    </VStack>
  );
};

export default ServiceManagement;