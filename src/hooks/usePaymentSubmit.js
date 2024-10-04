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

      if (!response.ok) {
        throw new Error('Payment processing failed');
      }

      const result = await response.json();

      if (result.success) {
        const bookingData = {
          ...formData,
          userId: session?.user?.id || 'test_user_id',
          totalCost,
          paymentIntentId: result.paymentIntentId,
          status: 'paid',
          payment_status: 'paid'
        };

        try {
          await createBookingMutation.mutateAsync(bookingData);
          await sendAdminNotification(bookingData, totalCost);

          toast({
            title: 'Booking Confirmed',
            description: 'Your booking has been successfully created and payment processed.',
            status: 'success',
            duration: 5000,
            isClosable: true,
          });

          queryClient.invalidateQueries('bookings');
        } catch (bookingError) {
          console.error('Error creating booking:', bookingError);
          toast({
            title: 'Booking Error',
            description: 'Your payment was successful, but there was an issue creating your booking. Our team has been notified and will contact you shortly.',
            status: 'warning',
            duration: 7000,
            isClosable: true,
          });
        }
      } else {
        throw new Error('Payment processing failed');
      }
    } catch (error) {
      console.error('Payment Error:', error);
      toast({
        title: 'Payment Error',
        description: 'We encountered an issue processing your payment. Please try again or contact our support team.',
        status: 'error',
        duration: 7000,
        isClosable: true,
      });
    }
  }, [formData, session, totalCost, createBookingMutation, toast, queryClient, setIsPaymentWindowOpen]);

  return handlePaymentSubmit;
};