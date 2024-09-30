import React from 'react';
import { Box, VStack, Heading, Text, Button, FormControl, FormLabel, Input, Select, Textarea } from "@chakra-ui/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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
  setManualPickup,
  setManualDropoff
}) => {
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
    if (name === 'pickupAddress') {
      setManualPickup(value);
    } else if (name === 'dropOffAddress') {
      setManualDropoff(value);
    }
  };

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
        <form onSubmit={handleBookingProcess}>
          <FormControl isRequired>
            <FormLabel>Service Type</FormLabel>
            <Select name="serviceType" value={formData.serviceType} onChange={handleChange}>
              <option value="">Select a service</option>
              <option value="Tow">Tow</option>
              <option value="Jumpstart">Jumpstart</option>
              <option value="Tire Change">Tire Change</option>
              <option value="Fuel Delivery">Fuel Delivery</option>
            </Select>
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Name</FormLabel>
            <Input name="userName" value={formData.userName} onChange={handleChange} />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Phone Number</FormLabel>
            <Input name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Vehicle Brand</FormLabel>
            <Select name="vehicleBrand" value={formData.vehicleBrand} onChange={handleChange}>
              <option value="">Select a brand</option>
              {vehicleBrands.map((brand) => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </Select>
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Vehicle Model</FormLabel>
            <Select 
              name="vehicleModel" 
              value={formData.vehicleModel} 
              onChange={handleChange}
              isDisabled={!formData.vehicleBrand}
            >
              <option value="">Select a model</option>
              {formData.vehicleBrand && vehicleModels[formData.vehicleBrand].map((model) => (
                <option key={model} value={model}>{model}</option>
              ))}
            </Select>
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Vehicle Color</FormLabel>
            <Input name="vehicleColor" value={formData.vehicleColor} onChange={handleChange} />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>License Plate</FormLabel>
            <Input name="licensePlate" value={formData.licensePlate} onChange={handleChange} />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Vehicle Size</FormLabel>
            <Select name="vehicleSize" value={formData.vehicleSize} onChange={handleChange}>
              <option value="">Select size</option>
              <option value="Small">Small</option>
              <option value="Medium">Medium</option>
              <option value="Large">Large</option>
              <option value="Extra Large">Extra Large</option>
            </Select>
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Pickup Address</FormLabel>
            <Input name="pickupAddress" value={formData.pickupAddress} onChange={handleAddressChange} />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Drop Off Address</FormLabel>
            <Input name="dropOffAddress" value={formData.dropOffAddress} onChange={handleAddressChange} />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Vehicle Issue</FormLabel>
            <Textarea name="vehicleIssue" value={formData.vehicleIssue} onChange={handleChange} />
          </FormControl>
          <FormControl>
            <FormLabel>Additional Details</FormLabel>
            <Textarea name="additionalDetails" value={formData.additionalDetails} onChange={handleChange} />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Wheels Status</FormLabel>
            <Select name="wheelsStatus" value={formData.wheelsStatus} onChange={handleChange}>
              <option value="">Select status</option>
              <option value="Wheels Turn">Wheels Turn</option>
              <option value="Wheels Don't Turn">Wheels Don't Turn</option>
            </Select>
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Pickup Date and Time</FormLabel>
            <DatePicker
              selected={formData.pickupDateTime}
              onChange={handleDateTimeChange}
              showTimeSelect
              dateFormat="Pp"
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Payment Method</FormLabel>
            <Select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange}>
              <option value="">Select payment method</option>
              <option value="card">Credit/Debit Card</option>
              <option value="paypal">PayPal</option>
            </Select>
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