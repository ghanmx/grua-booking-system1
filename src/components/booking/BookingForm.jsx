import React, { useEffect, useMemo, useState } from 'react';
import { Box, VStack, Heading, Text, Button, useToast } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { renderField, fieldNames } from './BookingFormFields';
import TowTruckSelection from './TowTruckSelection';
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
  vehicleModels,
  setIsPaymentWindowOpen
}) => {
  const { register, handleSubmit, control, watch, formState: { errors } } = useForm();
  const toast = useToast();
  const [pricesCalculated, setPricesCalculated] = useState(false);

  const watchVehicleModel = watch('vehicleModel');
  const watchVehiclePosition = watch('vehiclePosition');

  const selectedVehicleSize = useMemo(() => {
    return watchVehicleModel ? getVehicleSize(watchVehicleModel) : '';
  }, [watchVehicleModel]);

  useEffect(() => {
    if (watchVehicleModel && distance) {
      const vehicleSize = getVehicleSize(watchVehicleModel);
      const towTruckType = getTowTruckType(vehicleSize);
      const requiresManeuver = watchVehiclePosition === 'obstructed';
      const cost = calculateTotalCost(distance, towTruckType, requiresManeuver);
      setTotalCost(cost);
      setPricesCalculated(true);
    } else {
      setPricesCalculated(false);
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
          <TowTruckSelection 
            onSelect={handleTowTruckSelect} 
            selectedVehicleSize={selectedVehicleSize}
            pricesCalculated={pricesCalculated}
          />
          {pricesCalculated && (
            <>
              <Text mt={4} fontWeight="bold">Tipo de Grúa: {getTowTruckType(selectedVehicleSize)}</Text>
              <Text mt={2} fontWeight="bold">Costo Estimado: ${totalCost.toFixed(2)}</Text>
            </>
          )}
          <Button colorScheme="blue" type="submit" mt={4} isLoading={isLoading}>
            Solicitar Servicio de Grúa
          </Button>
        </form>
      </VStack>
    </Box>
  );
};

export default React.memo(BookingForm);