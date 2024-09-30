import React from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Box, Button, VStack, Text, useToast } from '@chakra-ui/react';
import { processPayment } from '../utils/paymentProcessing'; // Ensure correct path

const StripePaymentForm = ({ amount, onPaymentSuccess, onPaymentError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const toast = useToast();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    // Create payment method
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
    });

    if (error) {
      console.error('[Stripe Error]', error);
      onPaymentError(error.message);
    } else {
      // Simulate or handle real payment processing using the processPayment function
      const result = await processPayment(amount, false, { cardNumber: paymentMethod.id });

      if (result.success) {
        onPaymentSuccess(paymentMethod); // Pass paymentMethod on success
      } else {
        onPaymentError(result.error || 'An unexpected error occurred.');
      }
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
