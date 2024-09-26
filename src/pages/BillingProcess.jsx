import React from 'react';
import { Box, VStack, Heading, Text, Button, useToast } from '@chakra-ui/react';
import { useLocation, useNavigate } from 'react-router-dom';

const BillingProcess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();
  const { bookingData } = location.state || {};

  const handlePayment = () => {
    // Simulate payment process
    setTimeout(() => {
      toast({
        title: 'Payment Successful',
        description: 'Your payment has been processed successfully.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      navigate('/confirmation', { state: { bookingData } });
    }, 2000);
  };

  if (!bookingData) {
    return <Box>No booking data available.</Box>;
  }

  return (
    <Box p={4}>
      <VStack spacing={4} align="stretch">
        <Heading as="h1" mb={4}>Billing Process</Heading>
        <Text>Service Type: {bookingData.serviceType}</Text>
        <Text>User Name: {bookingData.userName}</Text>
        <Text>Phone Number: {bookingData.phoneNumber}</Text>
        <Text>Vehicle: {bookingData.vehicleMake} {bookingData.vehicleModel}</Text>
        <Text>Total Cost: ${bookingData.totalCost.toFixed(2)}</Text>
        <Button colorScheme="green" onClick={handlePayment}>
          Process Payment
        </Button>
      </VStack>
    </Box>
  );
};

export default BillingProcess;