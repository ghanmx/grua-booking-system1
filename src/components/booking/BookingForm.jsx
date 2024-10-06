import React, { useMemo, lazy, Suspense } from 'react';
import { Box, VStack, Heading, Text, Button, useToast, Spinner } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { renderField, fieldNames } from './BookingFormFields';
import { getVehicleSize, getTowTruckType } from '../../utils/towTruckSelection';
import { useBookingForm } from '../../hooks/useBookingForm';
import PaymentWindow from './PaymentWindow';

const BookingFormStepper = lazy(() => import('./BookingFormStepper'));

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
  });

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

  const onSubmit = async (data) => {
    if (isValid) {
      try {
        await handleBookingProcess({ ...data, serviceType: selectedTowTruckType });
        setIsPaymentWindowOpen(true);
      } catch (error) {
        console.error('Error al procesar la reserva:', error);
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
    return <Box textAlign="center" p={4}><Text mt={4}>Cargando formulario de reserva...</Text></Box>;
  }

  if (mapError) {
    return <Box p={4}><Text color="red.500">Error al cargar el mapa. Por favor, actualice la página o contacte con soporte.</Text></Box>;
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
      role="form"
      aria-label="Formulario de Reserva de Grúa"
    >
      <VStack spacing={4} align="stretch">
        <Heading as="h1" size="lg">Formulario de Reserva</Heading>
        <Suspense fallback={<Spinner />}>
          <BookingFormStepper currentStep={currentStep} />
        </Suspense>
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
              <Text mt={4} fontWeight="bold">Tipo de grúa: {selectedTowTruckType}</Text>
              <Text mt={2} fontWeight="bold">Costo estimado: ${totalCost.toFixed(2)}</Text>
            </>
          )}
          <Button 
            colorScheme="blue" 
            type="submit" 
            mt={4} 
            isLoading={isLoading} 
            isDisabled={!isValid}
            aria-label="Solicitar Servicio de Grúa"
          >
            Solicitar Servicio de Grúa
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