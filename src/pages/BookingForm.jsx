import React, { useState, useEffect } from 'react';
import { Box, VStack, Heading, Text, Button, FormControl, FormLabel, Input, Select, Textarea, useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import GoogleMapsRoute from '../components/GoogleMapsRoute';
import FloatingForm from '../components/FloatingForm';
import { getTowTruckType, getTowTruckPricing, calculateTotalCost } from '../utils/towTruckSelection';
import { processPayment } from '../utils/paymentProcessing';
import { sendAdminNotification } from '../utils/adminNotification';
import { useSupabaseAuth } from '../integrations/supabase/auth';
import { v4 as uuidv4 } from 'uuid';
import { vehicleBrands, vehicleModels } from '../utils/vehicleData';
import { createBooking, createService } from '../server/db';

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

    if (name === 'vehicleSize') {
      const newTowTruckType = getTowTruckType(value);
      setSelectedTowTruck(newTowTruckType);
    }
  };

  const handleDateTimeChange = (date) => {
    setFormData(prevData => ({
      ...prevData,
      pickupDateTime: date
    }));
  };

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
      const serviceData = {
        user_id: session.user.id,
        dynamic_key: dynamicKey,
        status: 'pending',
        service_type: formData.serviceType,
      };

      const createdService = await createService(serviceData);

      const bookingData = {
        user_id: session.user.id,
        service_id: createdService[0].id,
        vehicle_brand: formData.vehicleBrand,
        vehicle_model: formData.vehicleModel,
        vehicle_color: formData.vehicleColor,
        license_plate: formData.licensePlate,
        vehicle_size: formData.vehicleSize,
        pickup_address: formData.pickupAddress,
        dropoff_address: formData.dropOffAddress,
        vehicle_issue: formData.vehicleIssue,
        additional_details: formData.additionalDetails,
        wheels_status: formData.wheelsStatus,
        pickup_datetime: formData.pickupDateTime,
        payment_method: formData.paymentMethod,
        distance,
        total_cost: totalCost,
        tow_truck_type: selectedTowTruck,
        status: 'pending',
        dynamic_key: dynamicKey,
      };

      const createdBooking = await createBooking(bookingData);

      // Process payment
      const paymentResult = await processPayment(totalCost, false, {
        cardNumber: '4242424242424242', // This should be replaced with actual card details in a production environment
        expiryDate: '12/25',
        cvv: '123',
      });

      if (paymentResult.success) {
        await sendAdminNotification(formData, totalCost);

        toast({
          title: 'Booking Successful',
          description: `Your tow service has been booked successfully. Service number: ${createdService[0].id}`,
          status: 'success',
          duration: 5000,
          isClosable: true,
        });

        navigate('/confirmation', { state: { bookingData: createdBooking[0] } });
      } else {
        throw new Error('Payment failed');
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
    <Box position="relative" height="100vh" width="100vw">
      <GoogleMapsRoute
        setPickupAddress={(address) => setFormData(prev => ({ ...prev, pickupAddress: address }))}
        setDropOffAddress={(address) => setFormData(prev => ({ ...prev, dropOffAddress: address }))}
        setDistance={setDistance}
        setTotalCost={setTotalCost}
        vehicleSize={formData.vehicleSize}
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
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            {/* Stripe Elements will be rendered here */}
          </Elements>
        </Box>
      )}
    </Box>
  );
};

export default BookingForm;