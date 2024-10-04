import React from 'react';
import { Box } from "@chakra-ui/react";
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useQuery } from '@tanstack/react-query';
import MapRoute from '../components/booking/MapRoute';
import FloatingForm from '../components/booking/FloatingForm';
import PaymentWindow from '../components/booking/PaymentWindow';
import { getBookings } from '../server/db';
import { vehicleBrands, vehicleModels } from '../utils/vehicleData';
import { useBookingForm } from '../hooks/useBookingForm';
import { usePaymentSubmit } from '../hooks/usePaymentSubmit';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const BookingForm = () => {
  const {
    formData,
    setFormData,
    distance,
    setDistance,
    totalCost,
    setTotalCost,
    selectedTowTruck,
    isPaymentWindowOpen,
    setIsPaymentWindowOpen,
    handleChange,
    handleDateTimeChange,
    handleBookingProcess,
    createBookingMutation,
  } = useBookingForm();

  const handlePaymentSubmit = usePaymentSubmit(formData, totalCost, createBookingMutation, setIsPaymentWindowOpen);

  // Query to fetch bookings
  const { data: bookings } = useQuery({
    queryKey: ['bookings'],
    queryFn: getBookings,
  });

  return (
    <Box position="relative" height="100vh" width="100vw">
      <MapRoute
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
        isLoading={createBookingMutation.isLoading}
        selectedTowTruck={selectedTowTruck}
        totalCost={totalCost}
        vehicleBrands={vehicleBrands}
        vehicleModels={vehicleModels}
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