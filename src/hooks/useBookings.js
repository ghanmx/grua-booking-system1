import { useQuery } from '@tanstack/react-query';
import { getBookings } from '../server/db';
import { useToast } from '@chakra-ui/react';

export const useBookings = (page = 1, limit = 10) => {
  const toast = useToast();

  return useQuery({
    queryKey: ['bookings', page, limit],
    queryFn: () => getBookings(page, limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 15 * 60 * 1000, // 15 minutes
    onError: (error) => {
      console.error('Failed to fetch bookings:', error);
      toast({
        title: 'Error fetching bookings',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    },
  });
};