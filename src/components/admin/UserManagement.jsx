import React from 'react';
import { Box, VStack, Heading, Table, Thead, Tbody, Tr, Th, Td, Button, useToast } from "@chakra-ui/react";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUsers, deleteUser } from '../../server/db';

const UserManagement = () => {
  const toast = useToast();
  const queryClient = useQueryClient();

  const { data: usersData, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
  });

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

  if (isLoading) return <Box>Loading users...</Box>;
  if (error) return <Box>Error loading users: {error.message}</Box>;

  return (
    <Box>
      <VStack spacing={4} align="stretch">
        <Heading as="h2" size="lg">User Management</Heading>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>ID</Th>
              <Th>Email</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {usersData && usersData.data && usersData.data.map((user) => (
              <Tr key={user.id}>
                <Td>{user.id}</Td>
                <Td>{user.email}</Td>
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
      </VStack>
    </Box>
  );
};

export default UserManagement;