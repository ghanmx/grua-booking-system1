import React, { lazy, Suspense, useState } from 'react';
import { Box, Spinner, useToast } from "@chakra-ui/react";
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useQuery } from '@tanstack/react-query';
import { getBookings } from '../server/db';
import { vehicleBrands, vehicleModels } from '../utils/vehicleData';
import { useBookingForm } from '../hooks/useBookingForm';
import { usePaymentSubmit } from '../hooks/usePaymentSubmit';

const MapRoute = lazy(() => import('../components/booking/MapRoute'));
const FloatingForm = lazy(() => import('../components/FloatingForm'));
const PaymentWindow = lazy(() => import('../components/booking/PaymentWindow'));

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const BookingPage = () => {
  const toast = useToast();
  const [mapError, setMapError] = useState(false);

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

  const { isLoading, error } = useQuery({
    queryKey: ['bookings'],
    queryFn: getBookings,
    retry: 3,
    retryDelay: (attempt) => Math.min(attempt * 1000, 3000),
    onError: (err) => {
      console.error('Failed to fetch bookings:', err);
      toast({
        title: 'Error fetching bookings',
        description: 'Please try again later.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    },
  });

  const handleMapError = (error) => {
    console.error('Map error:', error);
    setMapError(true);
    toast({
      title: 'Error loading map',
      description: 'Unable to load the map. Please try refreshing the page.',
      status: 'error',
      duration: 5000,
      isClosable: true,
    });
  };

  if (error) {
    return <Box p={4}>Error loading bookings. Please try again later.</Box>;
  }

  return (
    <Box position="relative" height="100vh" width="100vw">
      <Suspense fallback={<Spinner />}>
        <MapRoute
          setPickupAddress={(address) => setFormData(prev => ({ ...prev, pickupAddress: address }))}
          setDropOffAddress={(address) => setFormData(prev => ({ ...prev, dropOffAddress: address }))}
          setDistance={setDistance}
          setTotalCost={setTotalCost}
          vehicleSize={formData.vehicleSize}
          onError={handleMapError}
        />
        <FloatingForm
          formData={formData}
          setFormData={setFormData}
          handleChange={handleChange}
          handleDateTimeChange={handleDateTimeChange}
          handleBookingProcess={handleBookingProcess}
          isLoading={isLoading || createBookingMutation.isLoading}
          selectedTowTruck={selectedTowTruck}
          totalCost={totalCost}
          vehicleBrands={vehicleBrands}
          vehicleModels={vehicleModels}
          mapError={mapError}
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
      </Suspense>
    </Box>
  );
};

export default BookingPage;