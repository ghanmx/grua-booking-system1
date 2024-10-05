import { useQuery } from '@tanstack/react-query';
import { getServices } from '../server/db';
import { useToast } from '@chakra-ui/react';

export const useServices = () => {
  const toast = useToast();

  return useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      try {
        const services = await getServices();
        return services;
      } catch (error) {
        console.error('Failed to fetch services:', error);
        toast({
          title: 'Error fetching services',
          description: `${error.message}. Please try again later or contact support if the problem persists.`,
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