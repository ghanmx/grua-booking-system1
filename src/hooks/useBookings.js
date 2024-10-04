import { useQuery } from '@tanstack/react-query';
import { getBookings } from '../server/db';
import { useToast } from '@chakra-ui/react';

export const useBookings = () => {
  const toast = useToast();

  return useQuery({
    queryKey: ['bookings'],
    queryFn: async () => {
      try {
        const bookings = await getBookings();
        return bookings;
      } catch (error) {
        console.error('Failed to fetch bookings:', error);
        toast({
          title: 'Error fetching bookings',
          description: 'Please try again later or contact support if the problem persists.',
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
  });
};