import React from 'react';
import { Box, VStack, Heading, useToast } from "@chakra-ui/react";
import { useQuery } from '@tanstack/react-query';
import { getUsers } from '../../server/db';
import { useSupabaseAuth } from '../../integrations/supabase/auth';
import UserTable from './UserTable';

const UserManagement = () => {
    const { session } = useSupabaseAuth();
    const toast = useToast();
    const { data: users, isLoading, error } = useQuery({
        queryKey: ['users'],
        queryFn: getUsers,
    });

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