import { useState, useCallback, useEffect } from 'react';
import { useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSupabaseAuth } from '../integrations/supabase/auth';
import { createBooking } from '../server/db';
import { testPayment } from '../utils/testPayment';
import { getVehicleSize, getTowTruckType, calculateTotalCost } from '../utils/towTruckSelection';

export const useBookingForm = () => {
  const [formData, setFormData] = useState(() => {
    const savedData = localStorage.getItem('bookingFormData');
    return savedData ? JSON.parse(savedData, (key, value) => {
      if (key === 'pickupDateTime') return new Date(value);
      return value;
    }) : {
      serviceType: '',
      userName: '',
      phoneNumber: '',
      vehicleBrand: '',
      vehicleModel: '',
      vehicleColor: '',
      licensePlate: '',
      vehicleSize: '',
      pickupAddress: '',
      dropOffAddress: '',
      vehicleIssue: '',
      additionalDetails: '',
      wheelsStatus: '',
      pickupDateTime: new Date(),
      paymentMethod: 'card',
      vehiclePosition: '',
      inNeutral: false,
      engineStarts: false,
      wheelsSteer: false,
    };
  });

  const [distance, setDistance] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [isPaymentWindowOpen, setIsPaymentWindowOpen] = useState(false);

  const navigate = useNavigate();
  const { session } = useSupabaseAuth();
  const toast = useToast();
  const queryClient = useQueryClient();

  const createBookingMutation = useMutation({
    mutationFn: createBooking,
    onSuccess: () => {
      queryClient.invalidateQueries('bookings');
      toast({
        title: 'Reserva creada.',
        description: "Hemos creado su reserva exitosamente.",
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      navigate('/confirmation');
    },
    onError: (error) => {
      console.error('Error al crear la reserva:', error);
      toast({
        title: 'Ocurrió un error.',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    },
  });

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));

    if (name === 'vehicleBrand') {
      setFormData(prevData => ({
        ...prevData,
        vehicleModel: ''
      }));
    }

    if (name === 'vehicleModel' || name === 'vehiclePosition') {
      updateTotalCost();
    }
  }, []);

  const updateTotalCost = useCallback(() => {
    const vehicleSize = getVehicleSize(formData.vehicleModel);
    const towTruckType = getTowTruckType(vehicleSize);
    const requiresManeuver = formData.vehiclePosition === 'obstructed';
    const cost = calculateTotalCost(distance, towTruckType, requiresManeuver);
    setTotalCost(cost);
  }, [formData.vehicleModel, formData.vehiclePosition, distance]);

  const handleDateTimeChange = useCallback((date) => {
    setFormData(prevData => ({
      ...prevData,
      pickupDateTime: date
    }));
  }, []);

  const handleBookingProcess = useCallback(async (data) => {
    if (!session) {
      toast({
        title: 'Autenticación requerida',
        description: 'Por favor, inicie sesión para crear una reserva.',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const testResult = await testPayment(totalCost);
    if (!testResult.success) {
      toast({
        title: 'Prueba de pago fallida',
        description: testResult.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    createBookingMutation.mutate({
      ...data,
      userId: session.user.id,
      totalCost,
      distance,
    });
  }, [session, totalCost, distance, createBookingMutation, toast]);

  useEffect(() => {
    localStorage.setItem('bookingFormData', JSON.stringify(formData));
  }, [formData]);

  return {
    formData,
    setFormData,
    distance,
    setDistance,
    totalCost,
    setTotalCost,  // Make sure this is included
    isPaymentWindowOpen,
    setIsPaymentWindowOpen,
    handleChange,
    handleDateTimeChange,
    handleBookingProcess,
    isLoading: createBookingMutation.isLoading,
  };
};