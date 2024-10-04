import React from 'react';
import { Table, Thead, Tbody, Tr, Th, Td, Button } from "@chakra-ui/react";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteUser, setAdminStatus } from '../../server/db';

const UserTable = ({ users, toast }) => {
    const queryClient = useQueryClient();

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

    return (
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
    );
};

export default UserTable;