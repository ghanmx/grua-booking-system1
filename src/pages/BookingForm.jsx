import React, { useState } from 'react';
import { Box, Button, FormControl, FormLabel, Input, Select, Textarea, VStack, useToast, Heading, Switch } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../integrations/supabase';
import GoogleMapsRoute from '../components/GoogleMapsRoute';

const BookingForm = () => {
  const [formData, setFormData] = useState({
    serviceType: '',
    userName: '',
    phoneNumber: '',
    vehicleMake: '',
    vehicleModel: '',
    vehicleSize: '',
    additionalInfo: '',
    pickupDate: '',
    pickupTime: '',
  });

  const [distance, setDistance] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isTestMode, setIsTestMode] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const requiredFields = ['serviceType', 'userName', 'phoneNumber', 'vehicleMake', 'vehicleModel', 'vehicleSize', 'pickupDate', 'pickupTime'];
    for (let field of requiredFields) {
      if (!formData[field]) {
        toast({
          title: 'Error',
          description: `Please fill in all required fields. Missing: ${field}`,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        return false;
      }
    }
    return true;
  };

  const handleBookingProcess = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const bookingData = {
        ...formData,
        distance,
        totalCost,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };

      if (isTestMode) {
        console.log('Test Mode: Booking Data', bookingData);
        toast({
          title: 'Test Mode: Booking Successful',
          description: 'This is a test booking. No data was saved.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        navigate('/billing', { state: { bookingData } });
      } else {
        const { data, error } = await supabase.from('bookings').insert([bookingData]);

        if (error) throw error;

        toast({
          title: 'Booking Successful',
          description: 'Your tow service has been booked successfully.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });

        navigate('/billing', { state: { bookingData } });
      }
    } catch (error) {
      console.error('Booking error:', error);
      toast({
        title: 'Booking Failed',
        description: error.message || 'An unexpected error occurred',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box p={4}>
      <VStack spacing={4} align="stretch">
        <Heading as="h1" mb={4}>Booking Form</Heading>
        <FormControl display="flex" alignItems="center">
          <FormLabel htmlFor="test-mode" mb="0">
            Enable Test Mode
          </FormLabel>
          <Switch id="test-mode" onChange={(e) => setIsTestMode(e.target.checked)} />
        </FormControl>
        <form onSubmit={handleBookingProcess}>
          <FormControl id="serviceType" isRequired>
            <FormLabel>Service Type</FormLabel>
            <Select name="serviceType" value={formData.serviceType} onChange={handleChange}>
              <option value="">Select Service Type</option>
              <option value="Tow">Tow</option>
              <option value="Platform">Platform</option>
              <option value="Roadside Assistance">Roadside Assistance</option>
            </Select>
          </FormControl>
          <FormControl id="userName" isRequired>
            <FormLabel>User Name</FormLabel>
            <Input type="text" name="userName" value={formData.userName} onChange={handleChange} />
          </FormControl>
          <FormControl id="phoneNumber" isRequired>
            <FormLabel>Phone Number</FormLabel>
            <Input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
          </FormControl>
          <FormControl id="vehicleMake" isRequired>
            <FormLabel>Vehicle Make</FormLabel>
            <Input type="text" name="vehicleMake" value={formData.vehicleMake} onChange={handleChange} />
          </FormControl>
          <FormControl id="vehicleModel" isRequired>
            <FormLabel>Vehicle Model</FormLabel>
            <Input type="text" name="vehicleModel" value={formData.vehicleModel} onChange={handleChange} />
          </FormControl>
          <FormControl id="vehicleSize" isRequired>
            <FormLabel>Vehicle Size</FormLabel>
            <Select name="vehicleSize" value={formData.vehicleSize} onChange={handleChange}>
              <option value="">Select Vehicle Size</option>
              <option value="Small">Small</option>
              <option value="Medium">Medium</option>
              <option value="Large">Large</option>
            </Select>
          </FormControl>
          <FormControl id="additionalInfo">
            <FormLabel>Additional Information</FormLabel>
            <Textarea name="additionalInfo" value={formData.additionalInfo} onChange={handleChange} />
          </FormControl>
          <FormControl id="pickupDate" isRequired>
            <FormLabel>Pickup Date</FormLabel>
            <Input type="date" name="pickupDate" value={formData.pickupDate} onChange={handleChange} />
          </FormControl>
          <FormControl id="pickupTime" isRequired>
            <FormLabel>Pickup Time</FormLabel>
            <Input type="time" name="pickupTime" value={formData.pickupTime} onChange={handleChange} />
          </FormControl>
          <GoogleMapsRoute setDistance={setDistance} setTotalCost={setTotalCost} />
          <Button colorScheme="blue" type="submit" mt={4} isLoading={isLoading}>
            Book Now
          </Button>
        </form>
      </VStack>
    </Box>
  );
};

export default BookingForm;
