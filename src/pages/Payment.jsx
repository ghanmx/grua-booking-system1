import React, { useState } from 'react';
import { Box, Text, VStack, Button, useToast } from '@chakra-ui/react';
import { useLocation, useNavigate } from 'react-router-dom';
import { sendAdminNotification } from '../utils/adminNotification';
import StripePaymentForm from '../components/StripePaymentForm'; // Import the Stripe form

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();
  const { formData } = location.state || {};
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaymentComplete, setIsPaymentComplete] = useState(false);

  const calculateTotalCost = () => {
    const baseCost = 558;
    const costPerKm = 19;
    const estimatedDistance = 50;
    return baseCost + (costPerKm * estimatedDistance);
  };

  const totalCost = calculateTotalCost();

  const handlePaymentSuccess = async (paymentMethod) => {
    setIsProcessing(true);
    try {
      // Send notification to admin
      await sendAdminNotification(formData, totalCost);

      // Show success message
      toast({
        title: 'Payment Processed',
        description: 'Your payment has been successfully processed.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      setIsPaymentComplete(true);
    } catch (error) {
      toast({
        title: 'Payment Error',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentError = (errorMessage) => {
    toast({
      title: 'Payment Error',
      description: errorMessage,
      status: 'error',
      duration: 5000,
      isClosable: true,
    });
  };

  const handleConfirmation = () => {
    navigate('/confirmation', { state: { formData, totalCost } });
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
            <Text fontWeight="bold">Total Cost: ${totalCost}</Text>

            {!isPaymentComplete ? (
              <StripePaymentForm
                amount={totalCost}
                onPaymentSuccess={handlePaymentSuccess}
                onPaymentError={handlePaymentError}
              />
            ) : (
              <Button colorScheme="green" onClick={handleConfirmation}>
                Confirm Booking
              </Button>
            )}
          </>
        ) : (
          <Text>No payment details available.</Text>
        )}
      </VStack>
    </Box>
  );
};

export default Payment;
