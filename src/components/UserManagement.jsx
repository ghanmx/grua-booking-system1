import React, { useState } from 'react';
import { Box, VStack, Heading, Table, Thead, Tbody, Tr, Th, Td, Button, Select, Input } from "@chakra-ui/react";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../integrations/supabase/index.jsx';
import { ROLES, setUserRole } from '../utils/adminUtils';

const UserManagement = ({ showNotification, userRole }) => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');

  const { data: users, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data, error } = await supabase.from('users').select('*');
      if (error) throw error;
      return data;
    },
  });

  const updateUserRoleMutation = useMutation({
    mutationFn: async ({ id, role }) => {
      const success = await setUserRole(id, role);
      if (!success) throw new Error('Failed to update user role');
    },
    onSuccess: () => {
      queryClient.invalidateQueries('users');
      showNotification('User Updated', 'The user role has been updated successfully.', 'success');
    },
    onError: (error) => {
      showNotification('Error', `Failed to update user role: ${error.message}`, 'error');
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from('users').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries('users');
      showNotification('User Deleted', 'The user has been deleted successfully.', 'success');
    },
    onError: (error) => {
      showNotification('Error', `Failed to delete user: ${error.message}`, 'error');
    },
  });

  const handleRoleChange = (userId, newRole) => {
    updateUserRoleMutation.mutate({ id: userId, role: newRole });
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      deleteUserMutation.mutate(userId);
    }
  };

  const filteredUsers = users?.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) return <Box>Loading users...</Box>;
  if (error) return <Box>Error loading users: {error.message}</Box>;

  return (
    <Box>
      <VStack spacing={4} align="stretch">
        <Heading as="h2" size="lg">User Management</Heading>
        <Input
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          mb={4}
        />
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Email</Th>
              <Th>Full Name</Th>
              <Th>Role</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredUsers.map((user) => (
              <Tr key={user.id}>
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
                    isDisabled={userRole !== ROLES.SUPER_ADMIN || user.id === session?.user?.id}
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