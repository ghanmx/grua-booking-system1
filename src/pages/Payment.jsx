import React, { useState } from 'react';
import { Box, Text, VStack, Button, useToast } from '@chakra-ui/react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { sendAdminNotification } from '../utils/adminNotification';

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();
  const { formData } = location.state || {};
  const [isProcessing, setIsProcessing] = useState(false);
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/confirmation`,
      },
    });

    if (error) {
      toast({
        title: 'Payment Error',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } else {
      await sendAdminNotification(formData, formData.totalCost);
      toast({
        title: 'Payment Processed',
        description: 'Your payment has been successfully processed.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      navigate('/confirmation', { state: { formData } });
    }

    setIsProcessing(false);
  };

  return (
    <Box p={4}>
      <VStack spacing={4} align="stretch">
        <Text fontSize="2xl">Payment</Text>
        {formData ? (
          <>
            <Text>Service Type: {formData.serviceType}</Text>
            <Text>User Name: {formData.userName}</Text>
            <Text>Phone Number: {formData.phoneNumber}</Text>
            <Text>Vehicle Make: {formData.vehicleMake}</Text>
            <Text>Vehicle Model: {formData.vehicleModel}</Text>
            <Text>Vehicle Size: {formData.vehicleSize}</Text>
            <Text fontWeight="bold">Total Cost: ${formData.totalCost}</Text>

            <form onSubmit={handleSubmit}>
              <PaymentElement />
              <Button
                mt={4}
                colorScheme="blue"
                type="submit"
                isLoading={isProcessing}
                loadingText="Processing Payment"
              >
                Pay Now
              </Button>
            </form>
          </>
        ) : (
          <Text>No payment details available.</Text>
        )}
      </VStack>
    </Box>
  );
};

export default Payment;