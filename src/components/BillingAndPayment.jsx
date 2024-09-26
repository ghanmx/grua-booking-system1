import React, { useState } from 'react';
import { Box, Button, FormControl, FormLabel, Input, VStack, Heading, useToast } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const BillingAndPayment = () => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically process the payment
    // For now, we'll just simulate a successful payment
    toast({
      title: "Payment processed",
      description: "Your payment method has been saved.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    navigate('/booking'); // Redirect to the booking form after payment
  };

  return (
    <Box p={4}>
      <VStack spacing={4} align="stretch">
        <Heading as="h1" mb={4}>Billing and Payment</Heading>
        <form onSubmit={handleSubmit}>
          <FormControl id="cardNumber" isRequired>
            <FormLabel>Card Number</FormLabel>
            <Input type="text" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} placeholder="1234 5678 9012 3456" />
          </FormControl>
          <FormControl id="expiryDate" isRequired>
            <FormLabel>Expiry Date</FormLabel>
            <Input type="text" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} placeholder="MM/YY" />
          </FormControl>
          <FormControl id="cvv" isRequired>
            <FormLabel>CVV</FormLabel>
            <Input type="text" value={cvv} onChange={(e) => setCvv(e.target.value)} placeholder="123" />
          </FormControl>
          <Button type="submit" colorScheme="blue" mt={4}>Process Payment</Button>
        </form>
      </VStack>
    </Box>
  );
};

export default BillingAndPayment;