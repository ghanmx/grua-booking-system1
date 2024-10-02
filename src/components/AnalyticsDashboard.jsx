import React from 'react';
import { Box, Heading, SimpleGrid, Stat, StatLabel, StatNumber, StatHelpText } from "@chakra-ui/react";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../integrations/supabase/index.jsx';

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
        <Stat>
          <StatLabel>Total Users</StatLabel>
          <StatNumber>{stats.usersCount}</StatNumber>
          <StatHelpText>Registered users</StatHelpText>
        </Stat>
        <Stat>
          <StatLabel>Total Bookings</StatLabel>
          <StatNumber>{stats.bookingsCount}</StatNumber>
          <StatHelpText>Completed bookings</StatHelpText>
        </Stat>
        <Stat>
          <StatLabel>Total Revenue</StatLabel>
          <StatNumber>${stats.totalRevenue.toFixed(2)}</StatNumber>
          <StatHelpText>From all bookings</StatHelpText>
        </Stat>
      </SimpleGrid>
    </Box>
  );
};

export default AnalyticsDashboard;