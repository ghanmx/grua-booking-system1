import { useQuery } from '@tanstack/react-query';
import { getBookings } from '../server/db';
import { useToast } from '@chakra-ui/react';

export const useBookings = (page = 1, limit = 50) => {
  const toast = useToast();

  return useQuery({
    queryKey: ['bookings', page, limit],
    queryFn: async () => {
      try {
        const result = await getBookings(Number(page), Number(limit));
        console.log('Bookings query result:', result);
        return result;
      } catch (error) {
        console.error('Error fetching bookings:', error);
        toast({
          title: 'Error fetching bookings',
          description: `${error.message}. Please try again later or contact support if the problem persists.`,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        throw error;
      }
    },
    staleTime: 60000, // 1 minute
    cacheTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 300000, // 5 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};
