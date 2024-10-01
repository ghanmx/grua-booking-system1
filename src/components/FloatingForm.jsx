import React from 'react';
import { Box, VStack, Heading, Text, Button, FormControl, FormLabel, Input, Select, Textarea, FormErrorMessage } from "@chakra-ui/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useForm } from "react-hook-form";

const FloatingForm = ({
  formData,
  setFormData,
  handleDateTimeChange,
  handleBookingProcess,
  isLoading,
  selectedTowTruck,
  totalCost,
  vehicleBrands,
  vehicleModels
}) => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    handleBookingProcess(data);
  };

  return (
    <Box
      position="fixed"
      top="20px"
      right="20px"
      width="400px"
      maxHeight="calc(100vh - 40px)"
      overflowY="auto"
      bg="white"
      p={4}
      borderRadius="md"
      boxShadow="xl"
      zIndex={1000}
    >
      <VStack spacing={4} align="stretch">
        <Heading as="h1" size="lg">Booking Form</Heading>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl isInvalid={errors.serviceType}>
            <FormLabel>Service Type</FormLabel>
            <Select
              {...register("serviceType", { required: "Service type is required" })}
              value={formData.serviceType}
              onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
            >
              <option value="">Select a service</option>
              <option value="Tow">Tow</option>
              <option value="Jumpstart">Jumpstart</option>
              <option value="Tire Change">Tire Change</option>
              <option value="Fuel Delivery">Fuel Delivery</option>
            </Select>
            <FormErrorMessage>{errors.serviceType && errors.serviceType.message}</FormErrorMessage>
          </FormControl>
          
          <FormControl isInvalid={errors.userName}>
            <FormLabel>Name</FormLabel>
            <Input
              {...register("userName", { required: "Name is required" })}
              value={formData.userName}
              onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
            />
            <FormErrorMessage>{errors.userName && errors.userName.message}</FormErrorMessage>
          </FormControl>
          
          <FormControl isInvalid={errors.phoneNumber}>
            <FormLabel>Phone Number</FormLabel>
            <Input
              {...register("phoneNumber", { 
                required: "Phone number is required",
                pattern: {
                  value: /^\d{10}$/,
                  message: "Invalid phone number, should be 10 digits"
                }
              })}
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
            />
            <FormErrorMessage>{errors.phoneNumber && errors.phoneNumber.message}</FormErrorMessage>
          </FormControl>
          
          <FormControl isInvalid={errors.pickupDateTime}>
            <FormLabel>Pickup Date and Time</FormLabel>
            <DatePicker
              selected={formData.pickupDateTime}
              onChange={handleDateTimeChange}
              showTimeSelect
              dateFormat="Pp"
              customInput={
                <Input
                  {...register("pickupDateTime", { required: "Pickup date and time is required" })}
                />
              }
            />
            <FormErrorMessage>{errors.pickupDateTime && errors.pickupDateTime.message}</FormErrorMessage>
          </FormControl>
          
          <Text mt={4} fontWeight="bold">Total Cost: ${totalCost.toFixed(2)}</Text>
          <Button colorScheme="blue" type="submit" mt={4} isLoading={isLoading}>
            Book Now
          </Button>
        </form>
      </VStack>
    </Box>
  );
};

export default FloatingForm;