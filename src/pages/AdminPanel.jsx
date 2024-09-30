import React, { useState, useEffect } from 'react';
import { Box, VStack, Heading, Text, Table, Thead, Tbody, Tr, Th, Td, Button, useToast } from "@chakra-ui/react";
import { useSupabaseAuth } from '../integrations/supabase/auth';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUsers, createUser, updateUser, deleteUser } from '../server/db';
import { isAdmin, getAdminUsers, setAdminStatus } from '../utils/adminUtils';

const AdminPanel = () => {
  const { session } = useSupabaseAuth();
  const toast = useToast();
  const queryClient = useQueryClient();
  const [userIsAdmin, setUserIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (session?.user?.id) {
        const adminStatus = await isAdmin(session.user.id);
        setUserIsAdmin(adminStatus);
      }
    };
    checkAdminStatus();
  }, [session]);

  const { data: users, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
  });

  const createUserMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries('users');
      toast({
        title: 'User Created',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries('users');
      toast({
        title: 'User Updated',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    },
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

  const toggleAdminStatus = async (userId, currentStatus) => {
    const success = await setAdminStatus(userId, !currentStatus);
    if (success) {
      queryClient.invalidateQueries('users');
      toast({
        title: `User ${currentStatus ? 'removed from' : 'added to'} admin`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (!userIsAdmin) {
    return <Box p={4}><Text>You do not have admin privileges.</Text></Box>;
  }

  if (isLoading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

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
              {users.map((user) => (
                <Tr key={user.id}>
                  <Td>{user.id}</Td>
                  <Td>{user.email}</Td>
                  <Td>{user.is_admin ? 'Yes' : 'No'}</Td>
                  <Td>
                    <Button
                      size="sm"
                      colorScheme={user.is_admin ? "red" : "green"}
                      mr={2}
                      onClick={() => toggleAdminStatus(user.id, user.is_admin)}
                    >
                      {user.is_admin ? 'Remove Admin' : 'Make Admin'}
                    </Button>
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
      </VStack>
    </Box>
  );
};

export default AdminPanel;