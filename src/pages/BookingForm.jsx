import React, { useState, useEffect } from 'react';
import { Box, VStack, Heading, Text, Button, useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../integrations/supabase";
import GoogleMapsRoute from '../components/GoogleMapsRoute';
import FloatingForm from '../components/FloatingForm';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { getTowTruckType, getTowTruckPricing } from '../utils/towTruckSelection';
import { processPayment } from '../utils/paymentProcessing';
import { sendAdminNotification } from '../utils/adminNotification';
import { useSupabaseAuth } from '../integrations/supabase/auth';
import { v4 as uuidv4 } from 'uuid';

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
    paymentMethod: 'card',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [distance, setDistance] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [selectedTowTruck, setSelectedTowTruck] = useState('');
  const [isTestMode, setIsTestMode] = useState(false);
  const [clientSecret, setClientSecret] = useState('');
  const toast = useToast();
  const navigate = useNavigate();
  const { session } = useSupabaseAuth();
  const stripe = useStripe();
  const elements = useElements();

  const generateTestData = () => ({
    serviceType: 'Tow',
    userName: 'Test User',
    phoneNumber: '1234567890',
    vehicleBrand: 'Test Brand',
    vehicleModel: 'Test Model',
    vehicleColor: 'Red',
    licensePlate: 'TEST123',
    vehicleSize: 'Medium',
    pickupAddress: '123 Test St, Test City',
    dropOffAddress: '456 Example Ave, Sample Town',
    vehicleIssue: 'Test Issue',
    additionalDetails: 'This is a test booking',
    wheelsStatus: 'Wheels Turn',
    pickupDateTime: new Date(),
    paymentMethod: 'card',
  });

  useEffect(() => {
    if (isTestMode) {
      setFormData(generateTestData());
    }
  }, [isTestMode]);

  useEffect(() => {
    const fetchClientSecret = async () => {
      if (totalCost > 0) {
        try {
          const response = await fetch('/api/create-payment-intent', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ amount: totalCost * 100 }), // amount in cents
          });
          const data = await response.json();
          setClientSecret(data.clientSecret);
        } catch (error) {
          console.error('Error fetching client secret:', error);
        }
      }
    };

    fetchClientSecret();
  }, [totalCost]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleDateTimeChange = (date) => {
    setFormData(prevData => ({
      ...prevData,
      pickupDateTime: date
    }));
  };

  const calculateTotalCost = () => {
    const towTruckType = getTowTruckType(formData.vehicleSize);
    const { perKm, basePrice } = getTowTruckPricing(towTruckType);
    return basePrice + (distance * perKm * 2);
  };

  useEffect(() => {
    const newTotalCost = calculateTotalCost();
    setTotalCost(newTotalCost);
  }, [distance, formData.vehicleSize]);

  const validateForm = () => {
    // Add form validation logic here
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

      if (!stripe || !elements) {
        throw new Error('Stripe has not been initialized');
      }

      const { error: stripeError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/confirmation`,
        },
      });

      if (stripeError) {
        throw new Error(stripeError.message);
      }

      const dynamicKey = uuidv4();
      const { data: serviceData, error: serviceError } = await supabase
        .from('services')
        .insert({
          user_id: session?.user?.id || 'test_user',
          dynamic_key: dynamicKey,
          status: isTestMode ? 'test_mode' : 'pending',
        })
        .select('id, service_number')
        .single();

      if (serviceError) throw serviceError;

      const bookingData = {
        ...formData,
        distance,
        totalCost,
        towTruckType: selectedTowTruck,
        status: isTestMode ? 'test_mode' : 'pending',
        serviceId: serviceData.id,
        serviceNumber: serviceData.service_number,
        dynamicKey,
        createdAt: new Date().toISOString(),
        isTestMode,
      };

      const { data, error } = await supabase.from('bookings').insert([bookingData]);
      if (error) throw error;

      await sendAdminNotification(formData, totalCost, isTestMode);

      toast({
        title: isTestMode ? 'Test Booking Successful' : 'Booking Successful',
        description: `Your tow service has been ${isTestMode ? 'test ' : ''}booked successfully. Service number: ${serviceData.service_number}`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      navigate('/confirmation', { state: { bookingData, isTestMode } });
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
      {clientSecret && (
        <Box position="absolute" bottom="20px" right="20px" width="400px" bg="white" p={4} borderRadius="md" boxShadow="xl">
          <PaymentElement />
          <Button onClick={handleBookingProcess} isLoading={isLoading} mt={4} colorScheme="blue" width="100%">
            Pay and Book
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default BookingForm;