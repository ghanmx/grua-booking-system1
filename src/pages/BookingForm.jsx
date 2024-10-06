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
const BookingForm = lazy(() => import('../components/booking/BookingForm'));
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
      console.error('Error al obtener las reservas:', err);
      toast({
        title: 'Error al obtener las reservas',
        description: 'Por favor, intente de nuevo más tarde.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    },
  });

  const handleMapError = (error) => {
    console.error('Error del mapa:', error);
    setMapError(true);
    toast({
      title: 'Error al cargar el mapa',
      description: 'No se pudo cargar el mapa. Por favor, actualice la página.',
      status: 'error',
      duration: 5000,
      isClosable: true,
    });
  };

  if (error) {
    return <Box p={4}>Error al cargar las reservas. Por favor, intente de nuevo más tarde.</Box>;
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
          isLoading={isLoading || createBookingMutation.isLoading}
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