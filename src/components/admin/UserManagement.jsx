import React, { useState, useEffect } from 'react';
import { Box, VStack, Heading, Table, Thead, Tbody, Tr, Th, Td, Button, useToast } from "@chakra-ui/react";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUsers, deleteUser, setAdminStatus } from '../../server/db';
import { useSupabaseAuth } from '../../integrations/supabase/auth';

const UserManagement = () => {
    const { session } = useSupabaseAuth();
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

    if (!session) {
        return <Box p={4}><Heading as="h2" size="lg">You do not have admin privileges.</Heading></Box>;
    }

    if (isLoading) return <Box>Loading...</Box>;
    if (error) return <Box>Error: {error.message}</Box>;

    return (
        <Box p={4}>
            <VStack spacing={8} align="stretch">
                <Heading as="h1" size="xl">User Management</Heading>

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

export default UserManagement;
