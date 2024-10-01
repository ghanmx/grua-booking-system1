import React, { useState, useCallback, useEffect } from 'react';
import { Box, useToast, FormControl, FormLabel, Select, Input } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import MapRoute from '../components/MapRoute';
import FloatingForm from '../components/FloatingForm';
import LoadingSpinner from '../components/LoadingSpinner';
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
  const navigate = useNavigate();
  const { session } = useSupabaseAuth();
  const toast = useToast();

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
      const vehicleType = getVehicleType(value);
      const vehicleSize = getVehicleSize(vehicleType);
      const towTruckType = getTowTruckType(vehicleSize);
      setFormData(prevData => ({
        ...prevData,
        vehicleSize: vehicleSize
      }));
      setSelectedTowTruck(towTruckType);
      updateTotalCost(distance, towTruckType);
    }
  }, [distance]);

  const getVehicleType = (model) => {
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

  const getVehicleSize = (type) => {
    switch (type) {
      case 'coupe':
        return 'Small';
      case 'truck':
      case 'van':
      case 'suv':
        return 'Large';
      default:
        return 'Medium';
    }
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
        cardNumber: '4242424242424242', // This should be replaced with actual card input
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

  if (isLoading) {
    return <LoadingSpinner />;
  }

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
