import React from 'react';
import { Box, VStack, Heading, Text, Button } from "@chakra-ui/react";
import { useLocation, useNavigate } from 'react-router-dom';

const ConfirmationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { bookingData } = location.state || {};

  if (!bookingData) {
    return (
      <Box p={4}>
        <Heading as="h1" size="xl" mb={4}>Booking Confirmation</Heading>
        <Text>No booking data available. Please try making a new booking.</Text>
        <Button mt={4} onClick={() => navigate('/booking')}>Make a New Booking</Button>
      </Box>
    );
  }

  return (
    <Box p={4}>
      <VStack spacing={4} align="stretch">
        <Heading as="h1" size="xl" mb={4}>Booking Confirmation</Heading>
        <Text fontWeight="bold">Thank you for your booking!</Text>
        <Text>Your payment has been processed successfully.</Text>
        <Box borderWidth={1} borderRadius="md" p={4}>
          <Heading as="h2" size="md" mb={2}>Booking Details</Heading>
          <Text><strong>Service Type:</strong> {bookingData.serviceType}</Text>
          <Text><strong>Name:</strong> {bookingData.userName}</Text>
          <Text><strong>Phone:</strong> {bookingData.phoneNumber}</Text>
          <Text><strong>Vehicle:</strong> {bookingData.vehicleBrand} {bookingData.vehicleModel}</Text>
          <Text><strong>Pickup Address:</strong> {bookingData.pickupAddress}</Text>
          <Text><strong>Drop-off Address:</strong> {bookingData.dropOffAddress}</Text>
          <Text><strong>Total Cost:</strong> ${bookingData.totalCost.toFixed(2)}</Text>
        </Box>
        <Button mt={4} onClick={() => navigate('/')}>Return to Home</Button>
      </VStack>
    </Box>
  );
};

export default ConfirmationPage;