import React, { useState } from 'react';
import { Box, VStack, Heading, Table, Thead, Tbody, Tr, Th, Td, Button, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, FormControl, FormLabel, Input, NumberInput, NumberInputField } from "@chakra-ui/react";
import { useServices, useAddService, useUpdateService, useDeleteService } from '../../integrations/supabase/hooks/services';

const ServiceManagement = ({ showNotification }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data: services, isLoading, isError } = useServices();
  const addServiceMutation = useAddService();
  const updateServiceMutation = useUpdateService();
  const deleteServiceMutation = useDeleteService();

  const [currentService, setCurrentService] = useState(null);

  if (isLoading) return <Box>Loading services...</Box>;
  if (isError) return <Box>Error loading services</Box>;

  const handleAddOrUpdateService = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const serviceData = {
      name: formData.get('name'),
      description: formData.get('description'),
      base_price: parseFloat(formData.get('base_price')),
      price_per_km: parseFloat(formData.get('price_per_km')),
      maneuver_charge: parseFloat(formData.get('maneuver_charge')),
      tow_truck_type: formData.get('tow_truck_type'),
    };

    try {
      if (currentService) {
        await updateServiceMutation.mutateAsync({ id: currentService.id, ...serviceData });
        showNotification('Service Updated', 'Service has been updated successfully', 'success');
      } else {
        await addServiceMutation.mutateAsync(serviceData);
        showNotification('Service Added', 'New service has been added successfully', 'success');
      }
      onClose();
      setCurrentService(null);
    } catch (error) {
      showNotification('Error', `Failed to ${currentService ? 'update' : 'add'} service`, 'error');
    }
  };

  const handleDeleteService = async (serviceId) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await deleteServiceMutation.mutateAsync(serviceId);
        showNotification('Service Deleted', 'Service has been deleted successfully', 'success');
      } catch (error) {
        showNotification('Error', 'Failed to delete service', 'error');
      }
    }
  };

  const openServiceModal = (service = null) => {
    setCurrentService(service);
    onOpen();
  };

  return (
    <VStack spacing={4} align="stretch">
      <Heading size="lg">Service Management</Heading>
      <Button onClick={() => openServiceModal()}>Add New Service</Button>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Description</Th>
            <Th>Base Price</Th>
            <Th>Price per KM</Th>
            <Th>Maneuver Charge</Th>
            <Th>Tow Truck Type</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {services.map((service) => (
            <Tr key={service.id}>
              <Td>{service.name}</Td>
              <Td>{service.description}</Td>
              <Td>${service.base_price}</Td>
              <Td>${service.price_per_km}/km</Td>
              <Td>${service.maneuver_charge}</Td>
              <Td>{service.tow_truck_type}</Td>
              <Td>
                <Button size="sm" onClick={() => openServiceModal(service)}>Edit</Button>
                <Button size="sm" colorScheme="red" ml={2} onClick={() => handleDeleteService(service.id)}>Delete</Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{currentService ? 'Edit Service' : 'Add New Service'}</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleAddOrUpdateService}>
            <ModalBody>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Name</FormLabel>
                  <Input name="name" defaultValue={currentService?.name} />
                </FormControl>
                <FormControl>
                  <FormLabel>Description</FormLabel>
                  <Input name="description" defaultValue={currentService?.description} />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Base Price</FormLabel>
                  <NumberInput min={0}>
                    <NumberInputField name="base_price" defaultValue={currentService?.base_price} />
                  </NumberInput>
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Price per KM</FormLabel>
                  <NumberInput min={0}>
                    <NumberInputField name="price_per_km" defaultValue={currentService?.price_per_km} />
                  </NumberInput>
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Maneuver Charge</FormLabel>
                  <NumberInput min={0}>
                    <NumberInputField name="maneuver_charge" defaultValue={currentService?.maneuver_charge} />
                  </NumberInput>
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Tow Truck Type</FormLabel>
                  <Input name="tow_truck_type" defaultValue={currentService?.tow_truck_type} />
                </FormControl>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button type="submit" colorScheme="blue" mr={3}>
                {currentService ? 'Update' : 'Add'} Service
              </Button>
              <Button onClick={onClose}>Cancel</Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </VStack>
  );
};

export default ServiceManagement;