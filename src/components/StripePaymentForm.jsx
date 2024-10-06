import React from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Box, Button, VStack, Text, useToast } from '@chakra-ui/react';
import { processPayment } from '../utils/paymentProcessing';

const StripePaymentForm = ({ amount, onPaymentSuccess, onPaymentError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const toast = useToast();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);

    try {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (error) {
        throw error;
      }

      // Simulate or handle real payment processing using the processPayment function
      const result = await processPayment(amount, false, { cardNumber: paymentMethod.id });

      if (result.success) {
        onPaymentSuccess(paymentMethod);
      } else {
        throw new Error(result.error || 'An unexpected error occurred.');
      }
    } catch (error) {
      console.error('[Stripe Error]', error);
      onPaymentError(error.message);
      toast({
        title: 'Payment Error',
        description: error.message || 'An unexpected error occurred during payment processing.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box as="form" onSubmit={handleSubmit}>
      <VStack spacing={4}>
        <CardElement />
        <Text>Total Amount: ${amount.toFixed(2)}</Text>
        <Button type="submit" disabled={!stripe} colorScheme="blue">
          Pay Now
        </Button>
      </VStack>
    </Box>
  );
};

export default StripePaymentForm;