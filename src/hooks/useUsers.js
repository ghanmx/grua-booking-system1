import { useQuery } from '@tanstack/react-query';
import { getUsers } from '../server/db';
import { useToast } from '@chakra-ui/react';

export const useUsers = () => {
  const toast = useToast();

  return useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
    staleTime: 10 * 60 * 1000, // 10 minutes
    cacheTime: 30 * 60 * 1000, // 30 minutes
    onError: (error) => {
      console.error('Failed to fetch users:', error);
      toast({
        title: 'Error fetching users',
        description: 'Please try again later or contact support if the problem persists.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    },
  });
};