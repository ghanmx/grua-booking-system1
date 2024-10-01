import React from 'react';
import { Box, VStack, Heading, Text, Button, FormControl, FormLabel, Input, Select, Textarea, FormErrorMessage } from "@chakra-ui/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useForm, Controller } from "react-hook-form";

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
        <Heading as="h1" size="lg">Booking Form</Heading>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl isInvalid={errors.serviceType}>
            <FormLabel>Service Type</FormLabel>
            <Select
              {...register("serviceType", { required: "Service type is required" })}
              value={formData.serviceType}
              onChange={handleChange}
              name="serviceType"
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
              onChange={handleChange}
              name="userName"
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
              onChange={handleChange}
              name="phoneNumber"
            />
            <FormErrorMessage>{errors.phoneNumber && errors.phoneNumber.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={errors.vehicleBrand}>
            <FormLabel>Vehicle Brand</FormLabel>
            <Select
              {...register("vehicleBrand", { required: "Vehicle brand is required" })}
              value={formData.vehicleBrand}
              onChange={handleChange}
              name="vehicleBrand"
            >
              <option value="">Select a brand</option>
              {vehicleBrands.map((brand) => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </Select>
            <FormErrorMessage>{errors.vehicleBrand && errors.vehicleBrand.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={errors.vehicleModel}>
            <FormLabel>Vehicle Model</FormLabel>
            <Select
              {...register("vehicleModel", { required: "Vehicle model is required" })}
              value={formData.vehicleModel}
              onChange={handleChange}
              name="vehicleModel"
              disabled={!formData.vehicleBrand}
            >
              <option value="">Select a model</option>
              {formData.vehicleBrand && vehicleModels[formData.vehicleBrand].map((model) => (
                <option key={model} value={model}>{model}</option>
              ))}
            </Select>
            <FormErrorMessage>{errors.vehicleModel && errors.vehicleModel.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={errors.vehicleColor}>
            <FormLabel>Vehicle Color</FormLabel>
            <Input
              {...register("vehicleColor", { required: "Vehicle color is required" })}
              value={formData.vehicleColor}
              onChange={handleChange}
              name="vehicleColor"
            />
            <FormErrorMessage>{errors.vehicleColor && errors.vehicleColor.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={errors.licensePlate}>
            <FormLabel>License Plate</FormLabel>
            <Input
              {...register("licensePlate", { required: "License plate is required" })}
              value={formData.licensePlate}
              onChange={handleChange}
              name="licensePlate"
            />
            <FormErrorMessage>{errors.licensePlate && errors.licensePlate.message}</FormErrorMessage>
          </FormControl>
          
          <FormControl isInvalid={errors.pickupDateTime}>
            <FormLabel>Pickup Date and Time</FormLabel>
            <Controller
              control={control}
              name="pickupDateTime"
              rules={{ required: "Pickup date and time is required" }}
              render={({ field }) => (
                <DatePicker
                  selected={field.value}
                  onChange={(date) => {
                    field.onChange(date);
                    handleDateTimeChange(date);
                  }}
                  showTimeSelect
                  dateFormat="Pp"
                  customInput={<Input />}
                />
              )}
            />
            <FormErrorMessage>{errors.pickupDateTime && errors.pickupDateTime.message}</FormErrorMessage>
          </FormControl>
          
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