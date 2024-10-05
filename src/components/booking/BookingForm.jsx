import React from 'react';
import { Box, VStack, Heading, Text, Button } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import {
  ServiceTypeField,
  UserInfoFields,
  VehicleInfoFields,
  VehicleConditionFields,
  AdditionalDetailsField,
  PickupDateTimeField,
  PaymentMethodField
} from './BookingFormFields';

const BookingForm = ({
  formData,
  handleChange,
  handleDateTimeChange,
  handleBookingProcess,
  isLoading,
  selectedTowTruck,
  totalCost,
  vehicleBrands,
  vehicleModels
}) => {
  const { register, handleSubmit, control, formState: { errors } } = useForm();

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
        <Heading as="h1" size="lg">Tow Service Booking</Heading>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ServiceTypeField register={register} errors={errors} formData={formData} handleChange={handleChange} />
          <UserInfoFields register={register} errors={errors} formData={formData} handleChange={handleChange} />
          <VehicleInfoFields 
            register={register} 
            errors={errors} 
            formData={formData} 
            handleChange={handleChange}
            vehicleBrands={vehicleBrands}
            vehicleModels={vehicleModels}
          />
          <VehicleConditionFields control={control} errors={errors} />
          <AdditionalDetailsField register={register} errors={errors} formData={formData} handleChange={handleChange} />
          <PickupDateTimeField control={control} errors={errors} handleDateTimeChange={handleDateTimeChange} />
          <PaymentMethodField register={register} errors={errors} formData={formData} handleChange={handleChange} />
          
          <Text mt={4} fontWeight="bold">Vehicle Size: {formData.vehicleSize}</Text>
          <Text mt={2} fontWeight="bold">Tow Truck Type: {selectedTowTruck}</Text>
          <Text mt={2} fontWeight="bold">Estimated Total Cost: ${totalCost.toFixed(2)}</Text>
          <Button colorScheme="blue" type="submit" mt={4} isLoading={isLoading}>
            Request Tow Service
          </Button>
        </form>
      </VStack>
    </Box>
  );
};

export default BookingForm;