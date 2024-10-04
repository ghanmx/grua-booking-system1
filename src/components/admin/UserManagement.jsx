import React, { useEffect } from 'react';
import { Box, VStack, Heading, useToast } from "@chakra-ui/react";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUsers, addSpecificAdmin } from '../../server/db';
import { useSupabaseAuth } from '../../integrations/supabase/auth';
import UserTable from './UserTable';

const UserManagement = () => {
    const { session } = useSupabaseAuth();
    const toast = useToast();
    const queryClient = useQueryClient();
    const { data: users, isLoading, error } = useQuery({
        queryKey: ['users'],
        queryFn: getUsers,
    });

    const addAdminMutation = useMutation({
        mutationFn: addSpecificAdmin,
        onSuccess: () => {
            queryClient.invalidateQueries('users');
            toast({
                title: 'Admin added',
                description: 'The specified email has been added as an admin.',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
        },
        onError: (error) => {
            toast({
                title: 'Error adding admin',
                description: error.message,
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        },
    });

    useEffect(() => {
        const addSpecificAdminEmail = async () => {
            await addAdminMutation.mutateAsync('israelreyes16.ir@gmail.com');
        };
        addSpecificAdminEmail();
    }, []);

    if (!session) {
        return <Box p={4}><Heading as="h2" size="lg">You do not have admin privileges.</Heading></Box>;
    }

    if (isLoading) return <Box>Loading...</Box>;
    if (error) return <Box>Error: {error.message}</Box>;

    return (
        <Box p={4}>
            <VStack spacing={8} align="stretch">
                <Heading as="h1" size="xl">User Management</Heading>
                <UserTable users={users} toast={toast} />
            </VStack>
        </Box>
    );
};

export default UserManagement;