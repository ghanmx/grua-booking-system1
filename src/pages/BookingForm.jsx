import React, { useState, useEffect } from 'react';
import { Box, VStack, Heading, Text, Button, FormControl, FormLabel, Input, Select, Textarea, useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../integrations/supabase";
import GoogleMapsRoute from '../components/GoogleMapsRoute';
import FloatingForm from '../components/FloatingForm';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { getTowTruckType, getTowTruckPricing, calculateTotalCost } from '../utils/towTruckSelection';
import { processPayment } from '../utils/paymentProcessing';
import { sendAdminNotification } from '../utils/adminNotification';
import { useSupabaseAuth } from '../integrations/supabase/auth';
import { v4 as uuidv4 } from 'uuid';
import { vehicleBrands, vehicleModels } from '../utils/vehicleData';

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
  const [clientSecret, setClientSecret] = useState('');
  const toast = useToast();
  const navigate = useNavigate();
  const { session } = useSupabaseAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));

    if (name === 'vehicleBrand') {
      setFormData(prevData => ({
        ...prevData,
        vehicleModel: ''
      }));
    }
  };

  const handleDateTimeChange = (date) => {
    setFormData(prevData => ({
      ...prevData,
      pickupDateTime: date
    }));
  };

  useEffect(() => {
    const newTowTruckType = getTowTruckType(formData.vehicleSize);
    setSelectedTowTruck(newTowTruckType);
    const newTotalCost = calculateTotalCost(distance, newTowTruckType);
    setTotalCost(newTotalCost);
  }, [distance, formData.vehicleSize]);

  useEffect(() => {
    const fetchClientSecret = async () => {
      if (totalCost > 0) {
        try {
          const response = await fetch('/api/create-payment-intent', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ amount: Math.round(totalCost * 100) }),
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

  const validateForm = () => {
    // Add form validation logic here
    return true;
  };

  const handleBookingProcess = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      if (!session) {
        navigate('/login', { state: { from: '/booking' } });
        return;
      }

      const dynamicKey = uuidv4();
      const { data: serviceData, error: serviceError } = await supabase
        .from('services')
        .insert({
          user_id: session.user.id,
          dynamic_key: dynamicKey,
          status: 'pending',
        })
        .select('id, service_number')
        .single();

      if (serviceError) throw serviceError;

      const bookingData = {
        ...formData,
        distance,
        totalCost,
        towTruckType: selectedTowTruck,
        status: 'pending',
        serviceId: serviceData.id,
        serviceNumber: serviceData.service_number,
        dynamicKey,
        createdAt: new Date().toISOString(),
      };

      const { data, error } = await supabase.from('bookings').insert([bookingData]);
      if (error) throw error;

      await sendAdminNotification(formData, totalCost);

      toast({
        title: 'Booking Successful',
        description: `Your tow service has been booked successfully. Service number: ${serviceData.service_number}`,
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

  const PaymentForm = () => {
    const stripe = useStripe();
    const elements = useElements();

    const handlePaymentSubmit = async (event) => {
      event.preventDefault();

      if (!stripe || !elements) {
        console.error('Stripe has not been initialized');
        return;
      }

      setIsLoading(true);

      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/confirmation`,
        },
      });

      if (error) {
        toast({
          title: 'Payment Error',
          description: error.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } else {
        handleBookingProcess(event);
      }

      setIsLoading(false);
    };

    return (
      <form onSubmit={handlePaymentSubmit}>
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          {/* Stripe Elements will be rendered here */}
        </Elements>
        <Button type="submit" mt={4} colorScheme="blue" isLoading={isLoading} disabled={!stripe}>
          Pay and Book
        </Button>
      </form>
    );
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
        selectedTowTruck={selectedTowTruck}
        totalCost={totalCost}
        vehicleBrands={vehicleBrands}
        vehicleModels={vehicleModels}
      />
      {clientSecret && (
        <Box position="absolute" bottom="20px" right="20px" width="400px" bg="white" p={4} borderRadius="md" boxShadow="xl">
          <PaymentForm />
        </Box>
      )}
    </Box>
  );
};

export default BookingForm;