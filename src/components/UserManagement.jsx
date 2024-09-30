import React, { useState, useEffect } from 'react';
import { Box, Table, Thead, Tbody, Tr, Th, Td, Button, useToast, Select } from "@chakra-ui/react";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUsers, updateUser, deleteUser } from '../server/db';

const UserManagement = () => {
  const toast = useToast();
  const queryClient = useQueryClient();
  const [users, setUsers] = useState([]);

  const { data: usersData, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
  });

  useEffect(() => {
    if (usersData) {
      setUsers(usersData);
    }
  }, [usersData]);

  const updateUserMutation = useMutation({
    mutationFn: ({ id, userData }) => updateUser(id, userData),
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

  const handleRoleChange = (userId, newRole) => {
    updateUserMutation.mutate({ id: userId, userData: { is_admin: newRole === 'admin' } });
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      deleteUserMutation.mutate(userId);
    }
  };

  if (isLoading) return <Box>Loading...</Box>;
  if (error) return <Box>Error: {error.message}</Box>;

  return (
    <Box>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Email</Th>
            <Th>Role</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {users.map((user) => (
            <Tr key={user.id}>
              <Td>{user.email}</Td>
              <Td>
                <Select
                  value={user.is_admin ? 'admin' : 'user'}
                  onChange={(e) => handleRoleChange(user.id, e.target.value)}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </Select>
              </Td>
              <Td>
                <Button
                  colorScheme="red"
                  onClick={() => handleDeleteUser(user.id)}
                >
                  Delete
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default UserManagement;