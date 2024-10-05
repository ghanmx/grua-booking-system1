import React, { useState } from 'react';
import { Box, Button, FormControl, FormLabel, Input, VStack, Heading, useToast } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const BillingAndPayment = () => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const validateCardNumber = (number) => /^\d{16}$/.test(number.replace(/\s/g, '')); // Validate 16 digits
  const validateExpiryDate = (date) => /^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(date); // MM/YY format
  const validateCvv = (cvv) => /^[0-9]{3,4}$/.test(cvv); // Validate 3-4 digit CVV

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateCardNumber(cardNumber)) {
      toast({
        title: 'Invalid Card Number',
        description: 'Please enter a valid 16-digit card number.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!validateExpiryDate(expiryDate)) {
      toast({
        title: 'Invalid Expiry Date',
        description: 'Please enter a valid expiry date (MM/YY).',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!validateCvv(cvv)) {
      toast({
        title: 'Invalid CVV',
        description: 'Please enter a valid CVV (3 or 4 digits).',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate payment processing (replace with real payment logic)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast({
        title: 'Payment Processed',
        description: 'Your payment has been successfully processed.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      navigate('/booking'); // Redirect after successful payment
    } catch (error) {
      toast({
        title: 'Payment Error',
        description: 'An error occurred during payment processing.',
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
        <Heading as="h1" mb={4}>Billing and Payment</Heading>
        <form onSubmit={handleSubmit}>
          <FormControl id="cardNumber" isRequired>
            <FormLabel>Card Number</FormLabel>
            <Input
              type="text"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              placeholder="1234 5678 9012 3456"
              maxLength={16}
            />
          </FormControl>
          <FormControl id="expiryDate" isRequired>
            <FormLabel>Expiry Date (MM/YY)</FormLabel>
            <Input
              type="text"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              placeholder="MM/YY"
              maxLength={5}
            />
          </FormControl>
          <FormControl id="cvv" isRequired>
            <FormLabel>CVV</FormLabel>
            <Input
              type="text"
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
              placeholder="123"
              maxLength={4}
            />
          </FormControl>
          <Button type="submit" colorScheme="blue" mt={4} isLoading={isProcessing} isDisabled={isProcessing} isFullWidth>
            Process Payment
          </Button>
        </form>
      </VStack>
    </Box>
  );
};

export default BillingAndPayment;
