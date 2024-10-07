import React, { lazy, Suspense, useState, useEffect } from 'react';
import { Box, Spinner, useToast, Alert, AlertIcon, AlertTitle, AlertDescription } from "@chakra-ui/react";
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
const MapComponent = lazy(() => import('../components/booking/MapComponent'));

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const BookingPage = () => {
  const toast = useToast();
  const [mapError, setMapError] = useState(false);
  const [isPageLoaded, setIsPageLoaded] = useState(false);

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

  const { isLoading, error, data } = useQuery({
    queryKey: ['bookings'],
    queryFn: getBookings,
    retry: 3,
    retryDelay: (attempt) => Math.min(attempt * 1000, 3000),
    onError: (err) => {
      console.error('Error fetching bookings:', err);
      toast({
        title: 'Error fetching bookings',
        description: 'Please try again later.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    },
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoaded(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleMapError = (error) => {
    console.error('Map error:', error);
    setMapError(true);
    toast({
      title: 'Error loading map',
      description: 'Unable to load the map. Please refresh the page.',
      status: 'error',
      duration: 5000,
      isClosable: true,
    });
  };

  if (isLoading || !isPageLoaded) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Spinner size="xl" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={4}>
        <Alert status="error">
          <AlertIcon />
          <AlertTitle mr={2}>Error loading bookings</AlertTitle>
          <AlertDescription>Please try again later. If the problem persists, contact support.</AlertDescription>
        </Alert>
      </Box>
    );
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
        <BookingForm
          formData={formData}
          setFormData={setFormData}
          handleChange={handleChange}
          handleDateTimeChange={handleDateTimeChange}
          handleBookingProcess={handleBookingProcess}
          isLoading={createBookingMutation?.isLoading || false}
          selectedTowTruck={selectedTowTruck}
          totalCost={totalCost}
          setTotalCost={setTotalCost}
          distance={distance}
          vehicleBrands={vehicleBrands}
          vehicleModels={vehicleModels}
          setIsPaymentWindowOpen={setIsPaymentWindowOpen}
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
