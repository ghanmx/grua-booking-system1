import React from 'react';
import { Box, Text, VStack, Heading } from '@chakra-ui/react';
import { useLocation } from 'react-router-dom';

const Confirmation = () => {
  const location = useLocation();
  const { bookingData } = location.state || {};

  return (
    <Box p={4}>
      <VStack spacing={4} align="stretch">
        <Heading as="h1" size="xl">Booking Confirmation</Heading>
        {bookingData ? (
          <>
            <Text><strong>Service Type:</strong> {bookingData.serviceType}</Text>
            <Text><strong>User Name:</strong> {bookingData.userName}</Text>
            <Text><strong>Phone Number:</strong> {bookingData.phoneNumber}</Text>
            <Text><strong>Vehicle Make:</strong> {bookingData.vehicleMake}</Text>
            <Text><strong>Vehicle Model:</strong> {bookingData.vehicleModel}</Text>
            <Text><strong>Vehicle Color:</strong> {bookingData.vehicleColor}</Text>
            <Text><strong>License Plate:</strong> {bookingData.licensePlate}</Text>
            <Text><strong>Vehicle Size:</strong> {bookingData.vehicleSize}</Text>
            <Text><strong>Pickup Location:</strong> {bookingData.pickupLocation}</Text>
            <Text><strong>Destination:</strong> {bookingData.destination}</Text>
            <Text><strong>Vehicle Issue:</strong> {bookingData.vehicleIssue}</Text>
            <Text><strong>Additional Details:</strong> {bookingData.additionalDetails}</Text>
            <Text><strong>Wheels Status:</strong> {bookingData.wheelsStatus}</Text>
            <Text><strong>Pickup Date:</strong> {bookingData.pickupDate}</Text>
            <Text><strong>Pickup Time:</strong> {bookingData.pickupTime}</Text>
            <Text><strong>Total Cost:</strong> ${bookingData.totalCost.toFixed(2)}</Text>
          </>
        ) : (
          <Text>No booking details available.</Text>
        )}
      </VStack>
    </Box>
  );
};

export default Confirmation;
