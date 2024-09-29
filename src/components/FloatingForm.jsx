import React from 'react';
import { Box, VStack, Heading, Text, Button, FormControl, FormLabel, Input, Select, Textarea, Switch } from "@chakra-ui/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const FloatingForm = ({
  formData,
  setFormData,
  handleChange,
  handleDateTimeChange,
  handleBookingProcess,
  isLoading,
  isTestMode,
  setIsTestMode,
  selectedTowTruck,
  totalCost
}) => {
  return (
    <Box
      position="absolute"
      top="20px"
      right="20px"
      width="400px"
      maxHeight="calc(100vh - 40px)"
      overflowY="auto"
      bg="white"
      p={4}
      borderRadius="md"
      boxShadow="xl"
    >
      <VStack spacing={4} align="stretch">
        <Heading as="h1" size="lg">Booking Form</Heading>
        <FormControl display="flex" alignItems="center">
          <FormLabel htmlFor="test-mode" mb="0">
            Test Mode
          </FormLabel>
          <Switch
            id="test-mode"
            isChecked={isTestMode}
            onChange={(e) => setIsTestMode(e.target.checked)}
          />
        </FormControl>
        <form onSubmit={handleBookingProcess}>
          {/* Include all form fields from the original BookingForm component */}
          {/* ... */}
          <Button colorScheme="blue" type="submit" mt={4} isLoading={isLoading}>
            {isTestMode ? 'Simulate Booking' : 'Book Now'}
          </Button>
        </form>
        {selectedTowTruck && totalCost > 0 && (
          <Box mt={4} p={4} borderWidth={1} borderRadius="md">
            <Text>Selected Tow Truck Type: {selectedTowTruck}</Text>
            <Text>Estimated Total Cost: ${totalCost.toFixed(2)}</Text>
          </Box>
        )}
      </VStack>
    </Box>
  );
};

export default FloatingForm;