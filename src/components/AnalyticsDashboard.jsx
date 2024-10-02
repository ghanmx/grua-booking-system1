import React from 'react';
import { Box, VStack, Heading, Text, SimpleGrid } from "@chakra-ui/react";
import { useQuery } from '@tanstack/react-query';
import { getAnalytics } from '../server/db';

const AnalyticsDashboard = () => {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['analytics'],
    queryFn: getAnalytics
  });

  if (isLoading) return <Box>Loading analytics...</Box>;
  if (error) return <Box>Error loading analytics: {error.message}</Box>;

  return (
    <Box>
      <Heading as="h2" size="lg" mb={4}>Analytics Dashboard</Heading>
      <SimpleGrid columns={3} spacing={10}>
        <VStack p={5} shadow="md" borderWidth="1px" borderRadius="md">
          <Heading size="md">Total Users</Heading>
          <Text fontSize="3xl">{stats?.usersCount || 0}</Text>
        </VStack>
        <VStack p={5} shadow="md" borderWidth="1px" borderRadius="md">
          <Heading size="md">Total Bookings</Heading>
          <Text fontSize="3xl">{stats?.bookingsCount || 0}</Text>
        </VStack>
        <VStack p={5} shadow="md" borderWidth="1px" borderRadius="md">
          <Heading size="md">Total Revenue</Heading>
          <Text fontSize="3xl">${stats?.totalRevenue.toFixed(2) || '0.00'}</Text>
        </VStack>
      </SimpleGrid>
    </Box>
  );
};

export default AnalyticsDashboard;