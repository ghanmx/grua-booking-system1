import { useQuery } from '@tanstack/react-query';
import { getPaidBookings } from '../server/db';

export const useBookings = () => {
  return useQuery({
    queryKey: ['paidBookings'],
    queryFn: getPaidBookings,
    retry: 3,
    refetchOnWindowFocus: false,
    onError: (error) => {
      console.error('Failed to fetch paid bookings:', error);
      // You might want to add a toast notification here
    },
  });
};