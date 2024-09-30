import React, { useState } from 'react';
import { Box, Text, VStack, Button, useToast, Select, Input } from '@chakra-ui/react';
import { useLocation, useNavigate } from 'react-router-dom';
import { sendAdminNotification } from '../utils/adminNotification';
import { processPayment } from '../utils/paymentProcessing';

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();
  const { formData } = location.state || {};
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');

  const calculateTotalCost = () => {
    const baseCost = 558;
    const costPerKm = 19;
    const estimatedDistance = 50;
    return baseCost + (costPerKm * estimatedDistance);
  };

  const totalCost = calculateTotalCost();

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      const paymentData = {
        method: paymentMethod,
        cardNumber,
        expiryDate,
        cvv,
      };

      const result = await processPayment(totalCost, false, paymentData);

      if (result.success) {
        await sendAdminNotification(formData, totalCost);
        toast({
          title: 'Payment Processed',
          description: 'Your payment has been successfully processed.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        navigate('/confirmation', { state: { formData, totalCost } });
      } else {
        throw new Error(result.error);
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
            <Text fontWeight="bold">Total Cost: ${totalCost}</Text>

            <Select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
              <option value="card">Credit/Debit Card</option>
              {/* Add other payment options here */}
            </Select>

            {paymentMethod === 'card' && (
              <>
                <Input
                  placeholder="Card Number"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                />
                <Input
                  placeholder="Expiry Date (MM/YY)"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                />
                <Input
                  placeholder="CVV"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                />
              </>
            )}

            <Button
              colorScheme="blue"
              onClick={handlePayment}
              isLoading={isProcessing}
              loadingText="Processing Payment"
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