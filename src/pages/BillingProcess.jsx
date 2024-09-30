import React, { useState, useEffect } from 'react';
import { Box, VStack, Heading, Text, Button, Spinner, useToast, FormControl, FormLabel, Input, Select } from '@chakra-ui/react';
import { useLocation, useNavigate } from 'react-router-dom';
import { processPayment } from '../utils/paymentProcessing'; // Assuming the correct path
import { sendAdminNotification } from '../utils/adminNotification'; // Assuming the correct path

const BillingProcess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();
  const { bookingData } = location.state || {};
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaymentComplete, setIsPaymentComplete] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');

  useEffect(() => {
    if (!bookingData) {
      toast({
        title: 'Error',
        description: 'No booking data available.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      navigate('/');
    }
  }, [bookingData, toast, navigate]);

  const handlePayment = async () => {
    if (!bookingData) {
      toast({
        title: 'Error',
        description: 'No booking data available for payment.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    if (!paymentMethod || !cardNumber || !expiryDate || !cvv) {
      toast({
        title: 'Error',
        description: 'Please fill in all payment details.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Real payment process using the Stripe utility
      const paymentData = {
        cardNumber,
        expiryDate,
        cvv,
        amount: bookingData.totalCost,
      };
      const result = await processPayment(bookingData.totalCost, false, paymentData);

      if (result.success) {
        // Mark payment as successful
        setIsPaymentComplete(true);
        sendAdminNotification(bookingData, bookingData.totalCost); // Notify admin

        toast({
          title: 'Payment Successful',
          description: 'Your payment has been processed successfully.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });

        // Navigate to the confirmation page
        navigate('/confirmation', { state: { bookingData, paymentMethod } });
      } else {
        throw new Error(result.error || 'An unexpected error occurred.');
      }
    } catch (error) {
      toast({
        title: 'Payment Error',
        description: error.message || 'An unexpected error occurred during payment processing.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const isPaymentDetailsValid = () => {
    return paymentMethod && cardNumber.length === 16 && expiryDate.match(/^\d{2}\/\d{2}$/) && cvv.length === 3;
  };

  if (!bookingData) {
    return null;
  }

  return (
    <Box p={4}>
      <VStack spacing={4} align="stretch">
        <Heading as="h1" mb={4}>Billing Process</Heading>
        <Text><strong>Service Type:</strong> {bookingData.serviceType}</Text>
        <Text><strong>User Name:</strong> {bookingData.userName}</Text>
        <Text><strong>Phone Number:</strong> {bookingData.phoneNumber}</Text>
        <Text><strong>Vehicle Make:</strong> {bookingData.vehicleMake}</Text>
        <Text><strong>Vehicle Model:</strong> {bookingData.vehicleModel}</Text>
        <Text><strong>Total Cost:</strong> ${bookingData.totalCost.toFixed(2)}</Text>

        {!isPaymentComplete && (
          <FormControl>
            <FormLabel>Payment Method</FormLabel>
            <Select placeholder="Select payment method" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
              <option value="credit">Credit Card</option>
              <option value="debit">Debit Card</option>
              <option value="paypal">PayPal</option>
            </Select>
          </FormControl>
        )}

        {!isPaymentComplete && paymentMethod && paymentMethod !== 'paypal' && (
          <>
            <FormControl>
              <FormLabel>Card Number</FormLabel>
              <Input
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                placeholder="1234 5678 9012 3456"
                maxLength={16}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Expiry Date</FormLabel>
              <Input
                type="text"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                placeholder="MM/YY"
                maxLength={5}
              />
            </FormControl>
            <FormControl>
              <FormLabel>CVV</FormLabel>
              <Input
                type="text"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                placeholder="123"
                maxLength={3}
              />
            </FormControl>
          </>
        )}

        {!isPaymentComplete ? (
          <Button
            colorScheme="blue"
            onClick={handlePayment}
            isLoading={isProcessing}
            isDisabled={isProcessing || !isPaymentDetailsValid()}
          >
            {isProcessing ? <Spinner size="sm" mr={2} /> : 'Process Payment'}
          </Button>
        ) : (
          <Button colorScheme="green" onClick={() => navigate('/confirmation', { state: { bookingData, paymentMethod } })}>
            Proceed to Confirmation
          </Button>
        )}
      </VStack>
    </Box>
  );
};

export default BillingProcess;
