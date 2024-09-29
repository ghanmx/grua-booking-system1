import React from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Box, Button, VStack, Text } from '@chakra-ui/react';

const StripePaymentForm = ({ amount, onPaymentSuccess, onPaymentError }) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
    });

    if (error) {
      console.error('[error]', error);
      onPaymentError(error.message);
    } else {
      onPaymentSuccess(paymentMethod);
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