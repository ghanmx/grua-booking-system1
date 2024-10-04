import React from 'react';
import { Box, VStack, Heading, Table, Thead, Tbody, Tr, Th, Td, Button, Select } from "@chakra-ui/react";
import { useUsers } from '../../hooks/useUsers';
import { ROLES } from '../../constants/roles';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const UserManagement = ({ showNotification }) => {
  const queryClient = useQueryClient();
  const { data: users, isLoading, error } = useUsers();

  const deleteUserMutation = useMutation({
    mutationFn: (userId) => deleteUser(userId),
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
  if (!users || users.length === 0) return <Box>No users found.</Box>;

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
