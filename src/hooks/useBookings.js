import { useQuery } from '@tanstack/react-query';
import { getBookings } from '../server/db';
import { useToast } from '@chakra-ui/react';

export const useBookings = (page = 1, limit = 10) => {
  const toast = useToast();

  return useQuery({
    queryKey: ['bookings', page, limit],
    queryFn: () => getBookings(Number(page) || 1, Number(limit) || 10),
    staleTime: 0, // Always fetch fresh data
    cacheTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 30000, // Refetch every 30 seconds
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    onError: (error) => {
      console.error('Failed to fetch bookings:', error);
      toast({
        title: 'Error fetching bookings',
        description: `${error.message}. Please try again later or contact support if the problem persists.`,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    },
  });
};