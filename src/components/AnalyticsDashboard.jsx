import React from 'react';
import { Box, VStack, Heading, Text, SimpleGrid } from "@chakra-ui/react";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../integrations/supabase/index';

const AnalyticsDashboard = () => {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['analytics'],
    queryFn: async () => {
      const [usersCount, bookingsCount, revenueData] = await Promise.all([
        supabase.from('users').select('id', { count: 'exact' }),
        supabase.from('services_logs').select('id', { count: 'exact' }),
        supabase.from('services_logs').select('total_cost')
      ]);
      const totalRevenue = revenueData.data?.reduce((sum, booking) => sum + booking.total_cost, 0) || 0;
      return {
        usersCount: usersCount.count,
        bookingsCount: bookingsCount.count,
        totalRevenue
      };
    }
  });

  if (isLoading) return <Box>Loading analytics...</Box>;
  if (error) return <Box>Error loading analytics: {error.message}</Box>;

  return (
    <Box>
      <Heading as="h2" size="lg" mb={4}>Analytics Dashboard</Heading>
      <SimpleGrid columns={3} spacing={10}>
        <VStack p={5} shadow="md" borderWidth="1px" borderRadius="md">
          <Heading size="md">Total Users</Heading>
          <Text fontSize="3xl">{stats.usersCount}</Text>
        </VStack>
        <VStack p={5} shadow="md" borderWidth="1px" borderRadius="md">
          <Heading size="md">Total Bookings</Heading>
          <Text fontSize="3xl">{stats.bookingsCount}</Text>
        </VStack>
        <VStack p={5} shadow="md" borderWidth="1px" borderRadius="md">
          <Heading size="md">Total Revenue</Heading>
          <Text fontSize="3xl">${stats.totalRevenue.toFixed(2)}</Text>
        </VStack>
      </SimpleGrid>
    </Box>
  );
};

export default AnalyticsDashboard;