import { useState, useCallback, useEffect } from 'react';
import { useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSupabaseAuth } from '../integrations/supabase/auth';
import { createBooking, saveDraftBooking } from '../server/db';
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
        title: 'Booking created.',
        description: "Your booking has been created successfully.",
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      navigate('/confirmation');
    },
    onError: (error) => {
      console.error('Error creating booking:', error);
      toast({
        title: 'An error occurred.',
        description: error.message || 'There was an error processing your request. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    },
  });

  const saveDraft = useCallback(async (draftData) => {
    if (!session) {
      toast({
        title: 'Authentication required',
        description: 'Please log in to save a draft.',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      return false;
    }

    try {
      await saveDraftBooking({
        ...draftData,
        userId: session.user.id,
        totalCost,
        distance,
      });
      return true;
    } catch (error) {
      console.error('Error saving draft:', error);
      return false;
    }
  }, [session, totalCost, distance, toast]);

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
        title: 'Authentication required',
        description: 'Please log in to create a booking.',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      const testResult = await testPayment(totalCost);
      if (!testResult.success) {
        throw new Error(testResult.message || 'Payment test failed');
      }

      await createBookingMutation.mutateAsync({
        ...data,
        userId: session.user.id,
        totalCost,
        distance,
        additional_details: data.additionalDetails || '',
      });
    } catch (error) {
      console.error('Error processing booking:', error);
      toast({
        title: 'Booking Error',
        description: error.message || 'There was an error processing your request. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
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
    setTotalCost,
    isPaymentWindowOpen,
    setIsPaymentWindowOpen,
    handleChange,
    handleDateTimeChange,
    handleBookingProcess,
    isLoading: createBookingMutation.isLoading,
    saveDraft,
  };
};