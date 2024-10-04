import { useState, useCallback, useEffect } from 'react';
import { useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSupabaseAuth } from '../integrations/supabase/auth';
import { createBooking } from '../server/db';
import { testPayment } from '../utils/testPayment';
import { getTowTruckType, calculateTotalCost } from '../utils/towTruckSelection';

export const useBookingForm = () => {
  const [formData, setFormData] = useState(() => {
    const savedData = localStorage.getItem('bookingFormData');
    return savedData ? JSON.parse(savedData) : {
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
    };
  });

  const [distance, setDistance] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [selectedTowTruck, setSelectedTowTruck] = useState('');
  const [isPaymentWindowOpen, setIsPaymentWindowOpen] = useState(false);

  const navigate = useNavigate();
  const { session } = useSupabaseAuth();
  const toast = useToast();
  const queryClient = useQueryClient();
  const testModeUser = JSON.parse(localStorage.getItem('testModeUser'));

  const createBookingMutation = useMutation({
    mutationFn: createBooking,
    onSuccess: () => {
      queryClient.invalidateQueries('bookings');
      toast({
        title: 'Booking created.',
        description: "We've created your booking for you.",
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      navigate('/confirmation');
    },
    onError: (error) => {
      toast({
        title: 'An error occurred.',
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

    if (name === 'vehicleModel') {
      const vehicleSize = getVehicleSize(value);
      const towTruckType = getTowTruckType(vehicleSize);
      setFormData(prevData => ({
        ...prevData,
        vehicleSize: vehicleSize
      }));
      setSelectedTowTruck(towTruckType);
      updateTotalCost(distance, towTruckType);
    }
  }, [distance]);

  const handleDateTimeChange = useCallback((date) => {
    setFormData(prevData => ({
      ...prevData,
      pickupDateTime: date
    }));
  }, []);

  const updateTotalCost = useCallback((distance, towTruckType) => {
    const cost = calculateTotalCost(distance, towTruckType);
    setTotalCost(cost);
  }, []);

  const handleBookingProcess = useCallback(async () => {
    if (!session && !testModeUser) {
      toast({
        title: 'Authentication required',
        description: 'Please log in to create a booking.',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    if (!formData.serviceType || !formData.userName || !formData.phoneNumber || !formData.vehicleBrand || !formData.vehicleModel) {
      toast({
        title: 'Incomplete Form',
        description: 'Please fill in all required fields.',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const testResult = await testPayment(totalCost);
    if (!testResult.success) {
      toast({
        title: 'Payment Test Failed',
        description: testResult.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    setIsPaymentWindowOpen(true);
  }, [session, testModeUser, toast, formData, totalCost]);

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
    selectedTowTruck,
    isPaymentWindowOpen,
    setIsPaymentWindowOpen,
    handleChange,
    handleDateTimeChange,
    handleBookingProcess,
    createBookingMutation,
  };
};