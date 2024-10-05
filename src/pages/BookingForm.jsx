import React, { lazy, Suspense, useMemo } from 'react';
import { Box, Spinner, useToast } from "@chakra-ui/react";
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useQuery } from '@tanstack/react-query';
import { getBookings } from '../server/db';
import { vehicleBrands, vehicleModels } from '../utils/vehicleData';
import { useBookingForm } from '../hooks/useBookingForm';
import { usePaymentSubmit } from '../hooks/usePaymentSubmit';

const MapRoute = lazy(() => import('../components/booking/MapRoute'));
const BookingForm = lazy(() => import('../components/booking/BookingForm'));
const PaymentWindow = lazy(() => import('../components/booking/PaymentWindow'));

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const BookingPage = () => {
  const toast = useToast();

  const {
    formData,
    setFormData,
    distance,
    setDistance,
    totalCost,
    setTotalCost,
    isPaymentWindowOpen,
    setIsPaymentWindowOpen,
    handleChange,
    handleDateTimeChange,
    handleBookingProcess,
    createBookingMutation,
  } = useBookingForm();

  const handlePaymentSubmit = usePaymentSubmit(formData, totalCost, createBookingMutation, setIsPaymentWindowOpen);

  const { data: bookings, error } = useQuery({
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

  const memoizedVehicleData = useMemo(() => ({
    vehicleBrands,
    vehicleModels
  }), []);

  if (error) {
    return <Box>Error loading bookings. Please try again later.</Box>;
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
        />
        <BookingForm
          formData={formData}
          handleChange={handleChange}
          handleDateTimeChange={handleDateTimeChange}
          handleBookingProcess={handleBookingProcess}
          isLoading={createBookingMutation.isLoading}
          totalCost={totalCost}
          setTotalCost={setTotalCost}
          distance={distance}
          vehicleBrands={memoizedVehicleData.vehicleBrands}
          vehicleModels={memoizedVehicleData.vehicleModels}
          setIsPaymentWindowOpen={setIsPaymentWindowOpen}
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