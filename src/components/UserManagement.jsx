import React, { useState, useEffect } from 'react';
import { Box, VStack, Heading, Table, Thead, Tbody, Tr, Th, Td, Button, Select } from "@chakra-ui/react";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUsers, updateUser, deleteUser } from '../server/db';
import { useSupabaseAuth } from '../integrations/supabase/auth';
import { ROLES } from '../constants/roles';

const UserManagement = ({ showNotification, userRole }) => {
  const queryClient = useQueryClient();
  const { session } = useSupabaseAuth();
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
      showNotification('User Updated', 'The user has been updated successfully.', 'success');
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries('users');
      showNotification('User Deleted', 'The user has been deleted successfully.', 'success');
    },
  });

  const handleRoleChange = (userId, newRole) => {
    updateUserMutation.mutate({ id: userId, userData: { role: newRole } });
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      deleteUserMutation.mutate(userId);
    }
  };

  if (isLoading) return <Box>Loading users...</Box>;
  if (error) return <Box>Error loading users: {error.message}</Box>;

  return (
    <Box>
      <Heading as="h2" size="lg" mb={4}>User Management</Heading>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>Email</Th>
            <Th>Full Name</Th>
            <Th>Role</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {users.map((user) => (
            <Tr key={user.id}>
              <Td>{user.id}</Td>
              <Td>{user.email}</Td>
              <Td>{user.full_name}</Td>
              <Td>
                <Select
                  value={user.role}
                  onChange={(e) => handleRoleChange(user.id, e.target.value)}
                  isDisabled={userRole !== ROLES.SUPER_ADMIN || user.id === session?.user?.id}
                >
                  <option value={ROLES.USER}>User</option>
                  <option value={ROLES.ADMIN}>Admin</option>
                  <option value={ROLES.SUPER_ADMIN}>Super Admin</option>
                </Select>
              </Td>
              <Td>
                <Button
                  colorScheme="red"
                  size="sm"
                  onClick={() => handleDeleteUser(user.id)}
                  isDisabled={user.id === session?.user?.id}
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