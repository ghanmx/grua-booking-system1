import React, { useMemo, useEffect } from 'react';
import { Box, VStack, Heading, Text, Button } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import {
  ServiceTypeField,
  UserInfoFields,
  VehicleInfoFields,
  VehicleConditionFields,
  AdditionalDetailsField,
  PickupDateTimeField,
  PaymentMethodField
} from './BookingFormFields';
import { getVehicleSize, getTowTruckType, calculateTotalCost } from '../../utils/towTruckSelection';

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
  vehicleModels
}) => {
  const { register, handleSubmit, control, watch, formState: { errors } } = useForm();

  const watchVehicleModel = watch('vehicleModel');
  const watchVehiclePosition = watch('vehiclePosition');

  const selectedTowTruck = useMemo(() => {
    if (watchVehicleModel) {
      const vehicleSize = getVehicleSize(watchVehicleModel);
      return getTowTruckType(vehicleSize);
    }
    return '';
  }, [watchVehicleModel]);

  useEffect(() => {
    if (watchVehicleModel && distance) {
      const vehicleSize = getVehicleSize(watchVehicleModel);
      const towTruckType = getTowTruckType(vehicleSize);
      const requiresManeuver = watchVehiclePosition === 'obstructed';
      const cost = calculateTotalCost(distance, towTruckType, requiresManeuver);
      setTotalCost(cost);
    }
  }, [watchVehicleModel, watchVehiclePosition, distance, setTotalCost]);

  const onSubmit = (data) => {
    handleBookingProcess(data);
  };

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
        <Heading as="h1" size="lg">Servicio de Grúa</Heading>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ServiceTypeField register={register} errors={errors} formData={formData} handleChange={handleChange} />
          <UserInfoFields register={register} errors={errors} formData={formData} handleChange={handleChange} />
          <VehicleInfoFields 
            register={register} 
            errors={errors} 
            formData={formData} 
            handleChange={handleChange}
            vehicleBrands={vehicleBrands}
            vehicleModels={vehicleModels}
          />
          <VehicleConditionFields control={control} errors={errors} register={register} />
          <AdditionalDetailsField register={register} errors={errors} formData={formData} handleChange={handleChange} />
          <PickupDateTimeField control={control} errors={errors} handleDateTimeChange={handleDateTimeChange} />
          <PaymentMethodField register={register} errors={errors} formData={formData} handleChange={handleChange} />
          
          <Text mt={4} fontWeight="bold">Tipo de Grúa: {selectedTowTruck}</Text>
          <Text mt={2} fontWeight="bold">Costo Estimado: ${totalCost.toFixed(2)}</Text>
          <Button colorScheme="blue" type="submit" mt={4} isLoading={isLoading}>
            Solicitar Servicio de Grúa
          </Button>
        </form>
      </VStack>
    </Box>
  );
};

export default React.memo(BookingForm);