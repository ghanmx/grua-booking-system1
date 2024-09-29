import React, { useState, useEffect } from 'react';
import { Box, VStack, Heading, Text, Button, useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { supabase } from "../integrations/supabase";
import GoogleMapsRoute from '../components/GoogleMapsRoute';
import FloatingForm from '../components/FloatingForm';
import StripePaymentForm from '../components/StripePaymentForm';
import { getTowTruckType, calculateTotalCost } from '../utils/towTruckSelection';
import { processPayment } from '../utils/paymentProcessing';
import { useSupabaseAuth } from '../integrations/supabase/auth';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const BookingForm = () => {
  const [formData, setFormData] = useState({
    serviceType: '',
    userName: '',
    phoneNumber: '',
    vehicleBrand: '',
    vehicleModel: '',
    vehicleColor: '',
    licensePlate: '',
    vehicleSize: '',
    pickupAddress: '',
    dropOffAddress: '',
    vehicleIssue: '',
    additionalDetails: '',
    wheelsStatus: '',
    pickupDateTime: new Date(),
    paymentMethod: '',
  });

  const [distance, setDistance] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTowTruck, setSelectedTowTruck] = useState('');
  const [isTestMode, setIsTestMode] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();
  const { session } = useSupabaseAuth();

  useEffect(() => {
    const testModeUser = JSON.parse(localStorage.getItem('testModeUser'));
    if (testModeUser && testModeUser.isTestMode) {
      setIsTestMode(true);
      setFormData({
        serviceType: 'Tow',
        userName: 'Test User',
        phoneNumber: '1234567890',
        vehicleBrand: 'Toyota',
        vehicleModel: 'Corolla',
        vehicleColor: 'Red',
        licensePlate: 'TEST123',
        vehicleSize: 'Small',
        pickupAddress: '123 Test St, Test City',
        dropOffAddress: '456 Test Ave, Test City',
        vehicleIssue: 'Test Issue',
        additionalDetails: 'Test Details',
        wheelsStatus: 'Wheels Turn',
        pickupDateTime: new Date(),
        paymentMethod: 'Credit/Debit Card',
      });
    }
  }, []);

  useEffect(() => {
    const towTruckType = getTowTruckType(formData.vehicleSize);
    setSelectedTowTruck(towTruckType);
  }, [formData.vehicleSize]);

  useEffect(() => {
    const newTotalCost = calculateTotalCost(distance, selectedTowTruck);
    setTotalCost(newTotalCost);
  }, [selectedTowTruck, distance]);

  const handleDateTimeChange = (date) => {
    setFormData({ ...formData, pickupDateTime: date });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    if (isTestMode) return true; // Skip validation in test mode

    const requiredFields = ['serviceType', 'userName', 'phoneNumber', 'vehicleBrand', 'vehicleModel', 'vehicleColor', 'licensePlate', 'vehicleSize', 'pickupAddress', 'dropOffAddress', 'vehicleIssue', 'wheelsStatus', 'pickupDateTime', 'paymentMethod'];
    for (let field of requiredFields) {
      if (!formData[field]) {
        toast({
          title: 'Error',
          description: `Please fill in all required fields. Missing: ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`,
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
      if (!session && !isTestMode) {
        navigate('/login', { state: { from: '/booking' } });
        return;
      }

      const paymentResult = await processPayment(totalCost * 100, isTestMode);

      if (!paymentResult.success) {
        console.error('Payment failed:', paymentResult.error);
        toast({
          title: 'Payment Failed',
          description: paymentResult.error,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        setIsLoading(false);
        return;
      }

      const bookingData = {
        ...formData,
        distance,
        totalCost,
        towTruckType: selectedTowTruck,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };

      if (!isTestMode) {
        const { data, error } = await supabase.from('bookings').insert([bookingData]);
        if (error) throw error;
      } else {
        console.log('Test mode: Simulating database insert', bookingData);
      }

      toast({
        title: 'Booking Successful',
        description: isTestMode ? 'Test booking simulated successfully.' : 'Your tow service has been booked successfully.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      navigate('/confirmation', { state: { bookingData } });
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
    <Box position="relative" height="100vh" width="100vw">
      <GoogleMapsRoute
        setPickupAddress={(address) => setFormData({ ...formData, pickupAddress: address })}
        setDropOffAddress={(address) => setFormData({ ...formData, dropOffAddress: address })}
        setDistance={setDistance}
        setTotalCost={setTotalCost}
        selectedTowTruck={selectedTowTruck}
      />
      <FloatingForm
        formData={formData}
        setFormData={setFormData}
        handleChange={handleChange}
        handleDateTimeChange={handleDateTimeChange}
        handleBookingProcess={handleBookingProcess}
        isLoading={isLoading}
        isTestMode={isTestMode}
        setIsTestMode={setIsTestMode}
        selectedTowTruck={selectedTowTruck}
        totalCost={totalCost}
      />
      {!isTestMode && (
        <Box position="absolute" bottom="20px" right="20px" width="400px" bg="white" p={4} borderRadius="md" boxShadow="xl">
          <Elements stripe={stripePromise}>
            <StripePaymentForm
              amount={totalCost}
              onPaymentSuccess={(paymentMethod) => {
                console.log('Payment successful:', paymentMethod);
                handleBookingProcess();
              }}
              onPaymentError={(error) => {
                console.error('Payment error:', error);
                toast({
                  title: 'Payment Failed',
                  description: error,
                  status: 'error',
                  duration: 5000,
                  isClosable: true,
                });
              }}
            />
          </Elements>
        </Box>
      )}
    </Box>
  );
};

export default BookingForm;