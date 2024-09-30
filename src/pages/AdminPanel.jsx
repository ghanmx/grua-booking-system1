import React, { useState, useEffect } from 'react';
import { Box, VStack, Heading, Text, Table, Thead, Tbody, Tr, Th, Td, Button, useToast, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter } from "@chakra-ui/react";
import { useSupabaseAuth } from '../integrations/supabase/auth';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUsers, deleteUser, getServicesLogs, deleteServiceLog } from '../server/db';
import { isAdmin } from '../utils/adminUtils';

const AdminPanel = () => {
  const { session } = useSupabaseAuth();
  const toast = useToast();
  const queryClient = useQueryClient();
  const [userIsAdmin, setUserIsAdmin] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  const { data: usersData, isLoading: usersLoading, error: usersError } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
  });

  const { data: servicesData, isLoading: servicesLoading, error: servicesError } = useQuery({
    queryKey: ['services'],
    queryFn: getServicesLogs,
  });

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (session?.user?.id) {
        const adminStatus = await isAdmin(session.user.id);
        setUserIsAdmin(adminStatus);
      }
    };
    checkAdminStatus();
  }, [session]);

  const deleteUserMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries('users');
      toast({
        title: 'User Deleted',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    },
  });

  const deleteServiceMutation = useMutation({
    mutationFn: deleteServiceLog,
    onSuccess: () => {
      queryClient.invalidateQueries('services');
      toast({
        title: 'Service Log Deleted',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    },
  });

  const openServiceModal = (service) => {
    setSelectedService(service);
  };

  const closeServiceModal = () => {
    setSelectedService(null);
  };

  if (!userIsAdmin) {
    return <Box p={4}><Text>You do not have admin privileges.</Text></Box>;
  }

  if (usersLoading || servicesLoading) return <Text>Loading...</Text>;
  if (usersError || servicesError) return <Text>Error: {usersError?.message || servicesError?.message}</Text>;

  return (
    <Box p={4}>
      <VStack spacing={8} align="stretch">
        <Heading as="h1" size="xl">Admin Panel</Heading>

        <Box>
          <Heading as="h2" size="lg" mb={4}>Users</Heading>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>ID</Th>
                <Th>Email</Th>
                <Th>Admin</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {usersData?.map((user) => (
                <Tr key={user.id}>
                  <Td>{user.id}</Td>
                  <Td>{user.email}</Td>
                  <Td>{user.is_admin ? 'Yes' : 'No'}</Td>
                  <Td>
                    <Button
                      size="sm"
                      colorScheme="red"
                      onClick={() => deleteUserMutation.mutate(user.id)}
                    >
                      Delete
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>

        <Box>
          <Heading as="h2" size="lg" mb={4}>Services Logs</Heading>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>ID</Th>
                <Th>User ID</Th>
                <Th>Service Type</Th>
                <Th>Status</Th>
                <Th>Action</Th>
              </Tr>
            </Thead>
            <Tbody>
              {servicesData?.map((service) => (
                <Tr key={service.id}>
                  <Td>{service.id}</Td>
                  <Td>{service.user_id}</Td>
                  <Td>{service.service_type}</Td>
                  <Td>{service.status}</Td>
                  <Td>
                    <Button colorScheme="blue" size="sm" mr={2} onClick={() => openServiceModal(service)}>
                      View Details
                    </Button>
                    <Button colorScheme="red" size="sm" onClick={() => deleteServiceMutation.mutate(service.id)}>
                      Delete
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>

        <Modal isOpen={selectedService !== null} onClose={closeServiceModal}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Service Details</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {selectedService && (
                <Box>
                  <Text mb={2}>ID: {selectedService.id}</Text>
                  <Text mb={2}>User ID: {selectedService.user_id}</Text>
                  <Text mb={2}>Service Type: {selectedService.service_type}</Text>
                  <Text mb={2}>Status: {selectedService.status}</Text>
                  <Text mb={2}>Created At: {new Date(selectedService.created_at).toLocaleString()}</Text>
                  {/* Add more details as needed */}
                </Box>
              )}
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" onClick={closeServiceModal}>Close</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

      </VStack>
    </Box>
  );
};

export default AdminPanel;