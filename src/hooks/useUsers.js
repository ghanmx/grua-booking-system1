import { useQuery } from '@tanstack/react-query';
import { getUsers } from '../server/db';

export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
    retry: 3,
    refetchOnWindowFocus: false,
    onError: (error) => {
      console.error('Failed to fetch users:', error);
      // You might want to add a toast notification here
    },
  });
};