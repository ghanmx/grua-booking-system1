import { Box, Text, VStack, Button, useToast } from '@chakra-ui/react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();
  const { formData } = location.state || {};
  const [isProcessing, setIsProcessing] = useState(false);

  // Calculate total cost based on formData
  const calculateTotalCost = () => {
    // This is a placeholder calculation. You should implement your actual pricing logic here.
    const baseCost = 558;
    const costPerKm = 19;
    const estimatedDistance = 50; // This should be calculated based on the actual route
    return baseCost + (costPerKm * estimatedDistance);
  };

  const totalCost = calculateTotalCost();

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      // Simulate payment processing delay
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      // Simulate successful payment
      const paymentSuccess = true;

      if (paymentSuccess) {
        console.log('Payment processed for:', totalCost);
        navigate('/confirmation', { state: { formData, totalCost } });
      } else {
        throw new Error('Payment failed');
      }
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
            <Text>Pickup Date: {formData.pickupDate}</Text>
            <Text>Pickup Time: {formData.pickupTime}</Text>
            <Text fontWeight="bold">Total Cost: ${totalCost}</Text>
            <Button 
              colorScheme="blue" 
              onClick={handlePayment} 
              isLoading={isProcessing}
            >
              Pay Now
            </Button>
          </>
        ) : (
          <Text>No payment details available.</Text>
        )}
      </VStack>
    </Box>
  );
};

export default Payment;
