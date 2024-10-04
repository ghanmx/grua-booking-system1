import { useCallback } from 'react';
import { useToast } from "@chakra-ui/react";
import { useQueryClient } from '@tanstack/react-query';
import { useSupabaseAuth } from '../integrations/supabase/auth';
import { sendAdminNotification } from '../utils/adminNotification';

export const usePaymentSubmit = (formData, totalCost, createBookingMutation, setIsPaymentWindowOpen) => {
  const { session } = useSupabaseAuth();
  const toast = useToast();
  const queryClient = useQueryClient();

  const handlePaymentSubmit = useCallback(async (paymentMethod) => {
    setIsPaymentWindowOpen(false);

    try {
      const response = await fetch('/api/process-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentMethodId: paymentMethod.id,
          amount: totalCost * 100, // Convert to cents
        }),
      });
      const result = await response.json();

      if (result.success) {
        const bookingData = {
          ...formData,
          userId: session?.user?.id || 'test_user_id',
          totalCost,
          paymentIntentId: result.paymentIntentId,
          status: 'paid',
        };

        await createBookingMutation.mutateAsync(bookingData);
        await sendAdminNotification(bookingData, totalCost);

        toast({
          title: 'Payment Successful',
          description: 'Your payment has been processed successfully.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });

        queryClient.invalidateQueries('bookings');
      } else {
        throw new Error('Payment processing failed');
      }
    } catch (error) {
      toast({
        title: 'Payment Error',
        description: error.message || 'An unexpected error occurred during payment processing.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  }, [formData, session, totalCost, createBookingMutation, toast, queryClient, setIsPaymentWindowOpen]);

  return handlePaymentSubmit;
};