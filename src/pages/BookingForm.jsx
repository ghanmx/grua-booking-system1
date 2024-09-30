import React, { useState, useEffect } from 'react';
import { Box, VStack, Heading, Text, Button, useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../integrations/supabase";
import GoogleMapsRoute from '../components/GoogleMapsRoute';
import FloatingForm from '../components/FloatingForm';
import PaymentWindow from '../components/PaymentWindow';
import { getTowTruckType, calculateTotalCost } from '../utils/towTruckSelection';
import { processPayment } from '../utils/paymentProcessing';
import { useSupabaseAuth } from '../integrations/supabase/auth';

const BookingForm = () => {
  // ... (previous state declarations)

  const [isTestMode, setIsTestMode] = useState(false);
  const [isPaymentWindowOpen, setIsPaymentWindowOpen] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();
  const { session } = useSupabaseAuth();

  // ... (previous useEffect hooks and functions)

  const handleBookingProcess = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsPaymentWindowOpen(true);
  };

  const handlePaymentSubmit = async (paymentData) => {
    setIsLoading(true);
    try {
      if (!session && !isTestMode) {
        navigate('/login', { state: { from: '/booking' } });
        return;
      }

      const paymentResult = await processPayment(totalCost, isTestMode, paymentData);

      if (!paymentResult.success) {
        throw new Error(paymentResult.error || 'Payment processing failed');
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
      setIsPaymentWindowOpen(false);
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
      <PaymentWindow
        isOpen={isPaymentWindowOpen}
        onClose={() => setIsPaymentWindowOpen(false)}
        onPaymentSubmit={handlePaymentSubmit}
        totalCost={totalCost}
        isTestMode={isTestMode}
      />
    </Box>
  );
};

export default BookingForm;