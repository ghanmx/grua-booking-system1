import React from 'react';
import { Box, VStack, Heading, Text, Button } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { SelectField, InputField, DateTimeField } from './booking/FloatingFormFields';

const FloatingForm = ({
  formData,
  setFormData,
  handleChange,
  handleDateTimeChange,
  handleBookingProcess,
  isLoading,
  selectedTowTruck,
  totalCost,
  vehicleBrands,
  vehicleModels,
  mapError
}) => {
  const { register, handleSubmit, control, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    handleBookingProcess(data);
  };

  if (mapError) {
    return (
      <Box
        position="fixed"
        top="20px"
        right="20px"
        width="400px"
        bg="white"
        p={4}
        borderRadius="md"
        boxShadow="xl"
        zIndex={1000}
      >
        <Text color="red.500">Error loading map. Please refresh the page.</Text>
      </Box>
    );
  }

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
          <SelectField
            label="Service Type"
            name="serviceType"
            options={[
              { value: "Tow", label: "Tow" },
              { value: "Jumpstart", label: "Jumpstart" },
              { value: "Tire Change", label: "Tire Change" },
              { value: "Fuel Delivery", label: "Fuel Delivery" }
            ]}
            register={register}
            errors={errors}
            value={formData.serviceType}
            onChange={handleChange}
          />
          
          <InputField
            label="Name"
            name="userName"
            register={register}
            errors={errors}
            value={formData.userName}
            onChange={handleChange}
          />
          
          <InputField
            label="Phone Number"
            name="phoneNumber"
            register={register}
            errors={errors}
            value={formData.phoneNumber}
            onChange={handleChange}
            type="tel"
          />

          <SelectField
            label="Vehicle Brand"
            name="vehicleBrand"
            options={vehicleBrands}
            register={register}
            errors={errors}
            value={formData.vehicleBrand}
            onChange={handleChange}
          />

          <SelectField
            label="Vehicle Model"
            name="vehicleModel"
            options={formData.vehicleBrand ? vehicleModels[formData.vehicleBrand] || [] : []}
            register={register}
            errors={errors}
            value={formData.vehicleModel}
            onChange={handleChange}
            disabled={!formData.vehicleBrand}
          />

          <InputField
            label="Vehicle Color"
            name="vehicleColor"
            register={register}
            errors={errors}
            value={formData.vehicleColor}
            onChange={handleChange}
          />

          <InputField
            label="License Plate"
            name="licensePlate"
            register={register}
            errors={errors}
            value={formData.licensePlate}
            onChange={handleChange}
          />
          
          <DateTimeField
            label="Pickup Date and Time"
            name="pickupDateTime"
            control={control}
            errors={errors}
            value={formData.pickupDateTime}
            onChange={handleDateTimeChange}
          />

          <SelectField
            label="Payment Method"
            name="paymentMethod"
            options={[
              { value: "card", label: "Credit/Debit Card" },
              { value: "paypal", label: "PayPal" }
            ]}
            register={register}
            errors={errors}
            value={formData.paymentMethod}
            onChange={handleChange}
          />
          
          <Text mt={4} fontWeight="bold">Vehicle Size: {formData.vehicleSize}</Text>
          <Text mt={2} fontWeight="bold">Tow Truck Type: {selectedTowTruck}</Text>
          <Text mt={2} fontWeight="bold">Total Cost: ${totalCost.toFixed(2)}</Text>
          <Button colorScheme="blue" type="submit" mt={4} isLoading={isLoading}>
            Book Now
          </Button>
        </form>
      </VStack>
    </Box>
  );
};

export default FloatingForm;