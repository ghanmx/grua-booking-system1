import { Box, Text, VStack } from '@chakra-ui/react';
import { useLocation } from 'react-router-dom';

const Confirmation = () => {
  const location = useLocation();
  const { formData } = location.state || {};

  return (
    <Box p={4}>
      <VStack spacing={4} align="stretch">
        <Text fontSize="2xl">Booking Confirmation</Text>
        {formData ? (
          <>
            <Text>Service Type: {formData.serviceType}</Text>
            <Text>User Name: {formData.userName}</Text>
            <Text>Phone Number: {formData.phoneNumber}</Text>
            <Text>Vehicle Make: {formData.vehicleMake}</Text>
            <Text>Vehicle Make: {formData.vehicleMake}</Text>
            <Text>Vehicle Model: {formData.vehicleModel}</Text>
            <Text>Vehicle Size: {formData.vehicleSize}</Text>
            <Text>Additional Information: {formData.additionalInfo}</Text>
            <Text>Pickup Date: {formData.pickupDate}</Text>
            <Text>Pickup Time: {formData.pickupTime}</Text>
          </>
        ) : (
          <Text>No booking details available.</Text>
        )}
      </VStack>
    </Box>
  );
};

export default Confirmation;