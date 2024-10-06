import React, { useMemo } from 'react';
import { Box, VStack, Heading, Text, Button, useToast, Spinner, Alert, AlertIcon, Stepper, Step, StepIndicator, StepStatus, StepTitle, StepDescription, StepSeparator } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { renderField, fieldNames } from './BookingFormFields';
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
  setIsPaymentWindowOpen,
  mapError
}) => {
  const { register, handleSubmit, control, watch, formState: { errors, isValid } } = useForm({ mode: 'onChange' });
  const toast = useToast();

  const watchVehicleModel = watch('vehicleModel');
  const watchVehiclePosition = watch('vehiclePosition');

  const selectedVehicleSize = useMemo(() => {
    return watchVehicleModel ? getVehicleSize(watchVehicleModel) : '';
  }, [watchVehicleModel]);

  const selectedTowTruckType = useMemo(() => {
    return getTowTruckType(selectedVehicleSize);
  }, [selectedVehicleSize]);

  const steps = [
    { title: 'Vehículo', description: 'Detalles del vehículo' },
    { title: 'Ubicación', description: 'Punto de recogida y destino' },
    { title: 'Servicio', description: 'Tipo de servicio y detalles' },
    { title: 'Confirmación', description: 'Revisar y confirmar' }
  ];

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

  if (isLoading) {
    return (
      <Box textAlign="center" p={4}>
        <Spinner size="xl" />
        <Text mt={4}>Cargando formulario de reserva...</Text>
      </Box>
    );
  }

  if (mapError) {
    return (
      <Alert status="error">
        <AlertIcon />
        Error al cargar el mapa. Por favor, recargue la página o contacte soporte.
      </Alert>
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
        <Heading as="h1" size="lg">Servicio de Grúa</Heading>
        <Stepper index={currentStep} orientation="vertical" height="200px" gap="0">
          {steps.map((step, index) => (
            <Step key={index}>
              <StepIndicator>
                <StepStatus
                  complete={<StepIcon />}
                  incomplete={<StepNumber />}
                  active={<StepNumber />}
                />
              </StepIndicator>

              <Box flexShrink="0">
                <StepTitle>{step.title}</StepTitle>
                <StepDescription>{step.description}</StepDescription>
              </Box>

              <StepSeparator />
            </Step>
          ))}
        </Stepper>
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
              <Text mt={4} fontWeight="bold">Tipo de Grúa: {selectedTowTruckType}</Text>
              <Text mt={2} fontWeight="bold">Costo Estimado: ${totalCost.toFixed(2)}</Text>
            </>
          )}
          <Button colorScheme="blue" type="submit" mt={4} isLoading={isLoading} isDisabled={!isValid}>
            Solicitar Servicio de Grúa
          </Button>
        </form>
      </VStack>
    </Box>
  );
};

export default React.memo(BookingForm);