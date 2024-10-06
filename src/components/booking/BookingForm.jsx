import React, { useMemo } from 'react';
import { Box, VStack, Heading, Text, Button, useToast } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { renderField, fieldNames } from './BookingFormFields';
import { getVehicleSize, getTowTruckType, calculateTotalCost } from '../../utils/towTruckSelection';
import BookingFormStepper from './BookingFormStepper';

const BookingForm = ({
  formData,
  handleChange,
  handleDateTimeChange,
  handleBookingProcess,
  isLoading,
  totalCost,
  setTotalCost,
  distance,
  vehicleBrands,
  vehicleModels,
  setIsPaymentWindowOpen,
  mapError
}) => {
  const { register, handleSubmit, control, watch, formState: { errors, isValid } } = useForm({ mode: 'onChange' });
  const toast = useToast();

  const watchVehicleModel = watch('vehicleModel');
  const watchVehiclePosition = watch('vehiclePosition');

  const selectedVehicleSize = useMemo(() => watchVehicleModel ? getVehicleSize(watchVehicleModel) : '', [watchVehicleModel]);
  const selectedTowTruckType = useMemo(() => getTowTruckType(selectedVehicleSize), [selectedVehicleSize]);

  const currentStep = useMemo(() => {
    if (!watchVehicleModel) return 0;
    if (!formData.pickupAddress || !formData.dropOffAddress) return 1;
    if (!formData.serviceType) return 2;
    return 3;
  }, [watchVehicleModel, formData.pickupAddress, formData.dropOffAddress, formData.serviceType]);

  React.useEffect(() => {
    if (watchVehicleModel && distance) {
      const requiresManeuver = watchVehiclePosition === 'obstructed';
      const cost = calculateTotalCost(distance, selectedTowTruckType, requiresManeuver);
      setTotalCost(cost);
    }
  }, [watchVehicleModel, watchVehiclePosition, distance, selectedTowTruckType, setTotalCost]);

  const onSubmit = async (data) => {
    if (isValid) {
      try {
        await handleBookingProcess({ ...data, serviceType: selectedTowTruckType });
        setIsPaymentWindowOpen(true);
      } catch (error) {
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
        description: "Please fill in all required fields correctly.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  if (isLoading) {
    return (
      <Box textAlign="center" p={4}>
        <Text mt={4}>Loading booking form...</Text>
      </Box>
    );
  }

  if (mapError) {
    return (
      <Box p={4}>
        <Text color="red.500">Error loading map. Please refresh the page or contact support.</Text>
      </Box>
    );
  }

  return (
    <Box
      position="fixed"
      top="20px"
      right="20px"
      width="400px"
      maxHeight="calc(100vh - 40px)"
      overflowY="auto"
      bg="white"
      p={4}
      borderRadius="md"
      boxShadow="xl"
      zIndex={1000}
    >
      <VStack spacing={4} align="stretch">
        <Heading as="h1" size="lg">Towing Service</Heading>
        <BookingFormStepper currentStep={currentStep} />
        <form onSubmit={handleSubmit(onSubmit)}>
          {fieldNames.map(fieldName => 
            renderField(fieldName, { 
              register, 
              errors, 
              formData, 
              handleChange, 
              control, 
              handleDateTimeChange,
              vehicleBrands,
              vehicleModels
            })
          )}
          {distance > 0 && (
            <>
              <Text mt={4} fontWeight="bold">Tow Truck Type: {selectedTowTruckType}</Text>
              <Text mt={2} fontWeight="bold">Estimated Cost: ${totalCost.toFixed(2)}</Text>
            </>
          )}
          <Button colorScheme="blue" type="submit" mt={4} isLoading={isLoading} isDisabled={!isValid}>
            Request Towing Service
          </Button>
        </form>
      </VStack>
    </Box>
  );
};

export default React.memo(BookingForm);