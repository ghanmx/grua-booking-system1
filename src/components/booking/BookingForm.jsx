import React, { useEffect, useMemo } from 'react';
import { Box, VStack, Heading, Text, Button, useToast } from "@chakra-ui/react";
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
import TowTruckSelection from './TowTruckSelection';
import { getVehicleSize, getTowTruckType, calculateTotalCost } from '../../utils/towTruckSelection';

// ... keep existing code

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
  setIsPaymentWindowOpen
}) => {
  const { register, handleSubmit, control, watch, formState: { errors } } = useForm();
  const toast = useToast();

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

  const onSubmit = async (data) => {
    if (Object.keys(errors).length === 0) {
      try {
        await handleBookingProcess(data);
        setIsPaymentWindowOpen(true);
      } catch (error) {
        toast({
          title: "Error",
          description: "Hubo un error al procesar su solicitud. Por favor, intente de nuevo.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } else {
      toast({
        title: "Error en el formulario",
        description: "Por favor, complete todos los campos requeridos correctamente.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleTowTruckSelect = (type) => {
    handleChange({ target: { name: 'serviceType', value: type } });
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
          <TowTruckSelection onSelect={handleTowTruckSelect} />
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
