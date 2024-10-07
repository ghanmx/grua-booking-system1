import React, { useMemo, lazy, Suspense } from 'react';
import { Box, VStack, Heading, Text, Button, useToast, Spinner } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { renderField, fieldNames } from './BookingFormFields';
import { getVehicleSize, getTowTruckType } from '../../utils/towTruckSelection';
import { useBookingForm } from '../../hooks/useBookingForm';
import PaymentWindow from './PaymentWindow';

const BookingFormStepper = lazy(() => import('./BookingFormStepper'));
const BookingFormFields = lazy(() => import('./BookingFormFields'));

const schema = yup.object().shape({
  userName: yup.string().required('Name is required'),
  phoneNumber: yup.string().matches(/^\d{10}$/, 'Phone number must be 10 digits').required('Phone number is required'),
  vehicleBrand: yup.string().required('Vehicle brand is required'),
  vehicleModel: yup.string().required('Vehicle model is required'),
  vehicleColor: yup.string().required('Vehicle color is required'),
  licensePlate: yup.string().required('License plate is required'),
  pickupAddress: yup.string().required('Pickup address is required'),
  dropOffAddress: yup.string().required('Drop-off address is required'),
  pickupDateTime: yup.date().required('Pickup date and time is required').min(new Date(), 'Pickup time must be in the future'),
});

const BookingForm = React.memo(({ vehicleBrands, vehicleModels, mapError }) => {
  const {
    formData,
    handleChange,
    handleDateTimeChange,
    handleBookingProcess,
    isLoading,
    totalCost,
    distance,
    isPaymentWindowOpen,
    setIsPaymentWindowOpen,
  } = useBookingForm();

  const { register, handleSubmit, control, watch, formState: { errors, isValid } } = useForm({
    mode: 'onChange',
    defaultValues: formData,
    resolver: yupResolver(schema)
  });

  const toast = useToast();

  const watchVehicleModel = watch('vehicleModel');
  const watchVehiclePosition = watch('vehiclePosition');

  const selectedVehicleSize = useMemo(() => {
    try {
      return watchVehicleModel ? getVehicleSize(watchVehicleModel) : '';
    } catch (error) {
      console.error('Error in getVehicleSize:', error);
      return '';
    }
  }, [watchVehicleModel]);

  const selectedTowTruckType = useMemo(() => {
    try {
      return getTowTruckType(selectedVehicleSize);
    } catch (error) {
      console.error('Error in getTowTruckType:', error);
      return '';
    }
  }, [selectedVehicleSize]);

  const currentStep = useMemo(() => {
    try {
      if (!watchVehicleModel) return 0;
      if (!formData.pickupAddress || !formData.dropOffAddress) return 1;
      if (!formData.serviceType) return 2;
      return 3;
    } catch (error) {
      console.error('Error in currentStep calculation:', error);
      return 0;
    }
  }, [watchVehicleModel, formData.pickupAddress, formData.dropOffAddress, formData.serviceType]);

  const onSubmit = async (data) => {
    if (isValid) {
      try {
        await handleBookingProcess({ ...data, serviceType: selectedTowTruckType });
        setIsPaymentWindowOpen(true);
      } catch (error) {
        console.error('Error processing booking:', error);
        toast({
          title: "Error",
          description: "There was an error processing your request. Please try again.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } else {
      toast({
        title: "Form Error",
        description: "Please complete all required fields correctly.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handlePaymentSubmit = async (paymentMethod) => {
    try {
      await handleBookingProcess({ ...formData, paymentMethodId: paymentMethod.id });
      setIsPaymentWindowOpen(false);
      toast({
        title: "Reserva exitosa",
        description: "Su reserva ha sido procesada correctamente.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error al finalizar la reserva:', error);
      toast({
        title: "Error",
        description: "Hubo un error al finalizar su reserva. Por favor, contacte con soporte.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  if (isLoading) {
    return <Box textAlign="center" p={4}><Spinner size="xl" /><Text mt={4}>Loading booking form...</Text></Box>;
  }

  if (mapError) {
    return <Box p={4}><Text color="red.500">Error loading map. Please refresh the page or contact support.</Text></Box>;
  }

  return (
    <Box 
      position="fixed" 
      top="20px" 
      right="20px" 
      width={{ base: "90%", md: "400px" }}
      maxHeight="calc(100vh - 40px)" 
      overflowY="auto" 
      bg="white" 
      p={4} 
      borderRadius="md" 
      boxShadow="xl" 
      zIndex={1000}
      role="form"
      aria-label="Tow Truck Booking Form"
    >
      <VStack spacing={4} align="stretch">
        <Heading as="h1" size="lg">Booking Form</Heading>
        <Suspense fallback={<Spinner />}>
          <BookingFormStepper currentStep={currentStep} />
        </Suspense>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Suspense fallback={<Spinner />}>
            <BookingFormFields
              fieldNames={fieldNames}
              renderField={renderField}
              register={register}
              errors={errors}
              formData={formData}
              handleChange={handleChange}
              control={control}
              handleDateTimeChange={handleDateTimeChange}
              vehicleBrands={vehicleBrands}
              vehicleModels={vehicleModels}
            />
          </Suspense>
          {distance > 0 && (
            <>
              <Text mt={4} fontWeight="bold">Tow truck type: {selectedTowTruckType}</Text>
              <Text mt={2} fontWeight="bold">Estimated cost: ${totalCost.toFixed(2)}</Text>
            </>
          )}
          <Button 
            colorScheme="blue" 
            type="submit" 
            mt={4} 
            isLoading={isLoading} 
            isDisabled={!isValid}
            aria-label="Request Tow Truck Service"
            width="100%"
          >
            Request Tow Truck Service
          </Button>
        </form>
      </VStack>
      <PaymentWindow
        isOpen={isPaymentWindowOpen}
        onClose={() => setIsPaymentWindowOpen(false)}
        onPaymentSubmit={handlePaymentSubmit}
        totalCost={totalCost}
      />
    </Box>
  );
});

export default BookingForm;
