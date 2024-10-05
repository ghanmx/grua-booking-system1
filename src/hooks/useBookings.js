import { useQuery } from '@tanstack/react-query';
import { getBookings } from '../server/db';
import { useToast } from '@chakra-ui/react';

export const useBookings = (page = 1, limit = 10) => {
  const toast = useToast();

  return useQuery({
    queryKey: ['bookings', page, limit],
    queryFn: async () => {
      try {
        const bookings = await getBookings(page, limit);
        return bookings;
      } catch (error) {
        console.error('Failed to fetch bookings:', error);
        toast({
          title: 'Error fetching bookings',
          description: `${error.message}. Please check your network connection and try again.`,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        throw error;
      }
    },
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: false,
    onError: (error) => {
      console.error('React Query error:', error);
    },
  });
};