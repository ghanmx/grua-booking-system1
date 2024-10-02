import React, { useState, useCallback, useEffect } from 'react';
import { Box, useToast, Button, VStack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import MapRoute from '../components/MapRoute';
import FloatingForm from '../components/FloatingForm';
import LoadingSpinner from '../components/LoadingSpinner';
import { getTowTruckType, getTowTruckPricing, calculateTotalCost } from '../utils/towTruckSelection';
import { processPayment } from '../utils/paymentProcessing';
import { sendAdminNotification } from '../utils/adminNotification';
import { useSupabaseAuth } from '../integrations/supabase/auth';
import { v4 as uuidv4 } from 'uuid';
import PaymentWindow from '../components/PaymentWindow';
import axios from 'axios';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const BookingForm = () => {
  const [formData, setFormData] = useState(() => {
    const savedData = localStorage.getItem('bookingFormData');
    return savedData ? JSON.parse(savedData) : {
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
    };
  });
  const [distance, setDistance] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [selectedTowTruck, setSelectedTowTruck] = useState('');
  const [isPaymentWindowOpen, setIsPaymentWindowOpen] = useState(false);
  const navigate = useNavigate();
  const { session } = useSupabaseAuth();
  const toast = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    localStorage.setItem('bookingFormData', JSON.stringify(formData));
  }, [formData]);

  const handleChange = useCallback((e) => {
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

    if (name === 'vehicleModel') {
      const vehicleSize = getVehicleSize(value);
      const towTruckType = getTowTruckType(vehicleSize);
      setFormData(prevData => ({
        ...prevData,
        vehicleSize: vehicleSize
      }));
      setSelectedTowTruck(towTruckType);
      updateTotalCost(distance, towTruckType);
    }
  }, [distance]);

  const getVehicleSize = (model) => {
    const coupeModels = ['Mustang', 'Camaro', 'Corvette', '911', 'M4', 'BRZ', 'GT-R', '370Z', 'TT', 'F-TYPE'];
    const truckModels = ['F-150', 'Silverado', 'RAM 1500', 'Tundra', 'Sierra', 'Tacoma', 'Ranger', 'Colorado', 'Titan', 'Frontier'];
    const vanModels = ['Sienna', 'Odyssey', 'Pacifica', 'Transit', 'Sprinter', 'Carnival', 'Sedona', 'Express', 'NV200', 'ProMaster'];
    const suvModels = ['RAV4', 'CR-V', 'Explorer', 'Equinox', 'Rogue', 'Tiguan', 'X3', 'GLC', 'Q5', 'Santa Fe'];

    if (coupeModels.includes(model)) return 'coupe';
    if (truckModels.includes(model)) return 'truck';
    if (vanModels.includes(model)) return 'van';
    if (suvModels.includes(model)) return 'suv';
    return 'sedan';
  };

  const updateTotalCost = (distance, towTruckType) => {
    const newTotalCost = calculateTotalCost(distance, towTruckType);
    setTotalCost(newTotalCost);
  };

  const handleDateTimeChange = useCallback((date) => {
    setFormData(prevData => ({
      ...prevData,
      pickupDateTime: date
    }));
  }, []);

  const setPickupAddress = useCallback((address) => {
    setFormData(prevData => ({
      ...prevData,
      pickupAddress: address
    }));
  }, []);

  const setDropOffAddress = useCallback((address) => {
    setFormData(prevData => ({
      ...prevData,
      dropOffAddress: address
    }));
  }, []);

  useEffect(() => {
    if (distance > 0 && selectedTowTruck) {
      updateTotalCost(distance, selectedTowTruck);
    }
  }, [distance, selectedTowTruck]);

  const validateForm = () => {
    const requiredFields = ['serviceType', 'userName', 'phoneNumber', 'vehicleBrand', 'vehicleModel', 'vehicleColor', 'licensePlate', 'vehicleSize', 'pickupAddress', 'dropOffAddress', 'wheelsStatus'];
    for (let field of requiredFields) {
      if (!formData[field]) {
        toast({
          title: "Form Incomplete",
          description: `Please fill in the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()} field.`,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return false;
      }
    }
    return true;
  };

  const createBookingMutation = useMutation({
    mutationFn: async (bookingData) => {
      const response = await axios.post('/api/bookings', bookingData);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries('bookings');
      toast({
        title: 'Booking Successful',
        description: `Your tow service has been booked successfully. Service number: ${data.booking.id}`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      navigate('/confirmation', { state: { bookingData: data.booking } });
    },
    onError: (error) => {
      toast({
        title: 'Booking Failed',
        description: error.message || 'An unexpected error occurred',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  });

  const handleBookingProcess = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (!session) {
        navigate('/login', { state: { from: '/booking' } });
        return;
      }

      setIsPaymentWindowOpen(true);
    } catch (error) {
      console.error('Booking error:', error);
      toast({
        title: 'Booking Failed',
        description: error.message || 'An unexpected error occurred',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handlePaymentSubmit = async (paymentMethod) => {
    try {
      const dynamicKey = uuidv4();
      const bookingData = {
        user_id: session.user.id,
        service_type: formData.serviceType,
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

      // Process payment using Stripe
      const paymentResult = await processPayment(totalCost, paymentMethod.id);

      if (paymentResult.success) {
        await createBookingMutation.mutateAsync(bookingData);
        await sendAdminNotification(formData, totalCost);
      } else {
        throw new Error('Payment failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: 'Payment Failed',
        description: error.message || 'An unexpected error occurred during payment',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsPaymentWindowOpen(false);
    }
  };

  return (
    <Box position="relative" height="100vh" width="100vw">
      <MapRoute
        setPickupAddress={setPickupAddress}
        setDropOffAddress={setDropOffAddress}
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
        isLoading={createBookingMutation.isLoading}
        selectedTowTruck={selectedTowTruck}
        totalCost={totalCost}
      />
      {isPaymentWindowOpen && (
        <Elements stripe={stripePromise}>
          <PaymentWindow
            isOpen={isPaymentWindowOpen}
            onClose={() => setIsPaymentWindowOpen(false)}
            onPaymentSubmit={handlePaymentSubmit}
            totalCost={totalCost}
          />
        </Elements>
      )}
    </Box>
  );
};

export default BookingForm;