import React, { useMemo, lazy, Suspense } from 'react';
import { Box, VStack, Heading, Spinner, useToast, useMediaQuery } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useBookingForm } from '../../hooks/useBookingForm';
import { usePaymentProcessing } from '../../hooks/usePaymentProcessing';
import BookingFormFields from './BookingFormFields';
import { BookingFormSummary } from './BookingFormSummary';
import { FormButtons } from './FormButtons';
import FormNavButtons from './FormNavButtons';

const BookingFormStepper = lazy(() => import('./BookingFormStepper'));
const PaymentWindowWrapper = lazy(() => import('./PaymentWindowWrapper'));

const schema = yup.object().shape({
  userName: yup.string().required('Name is required').min(2, 'Name must be at least 2 characters'),
  phoneNumber: yup.string().matches(/^\d{10}$/, 'Phone number must be 10 digits').required('Phone number is required'),
  vehicleBrand: yup.string().required('Vehicle brand is required'),
  vehicleModel: yup.string().required('Vehicle model is required'),
  vehicleColor: yup.string().required('Vehicle color is required'),
  licensePlate: yup.string().required('License plate is required').min(2, 'License plate must be at least 2 characters'),
  pickupAddress: yup.string().required('Pickup address is required').min(5, 'Address must be at least 5 characters'),
  dropOffAddress: yup.string().required('Drop-off address is required').min(5, 'Address must be at least 5 characters'),
  pickupDateTime: yup.date().nullable().required('Pickup date and time is required').min(new Date(), 'Pickup time must be in the future'),
  additional_details: yup.string(),
});

const BookingForm = () => {
  const [isMobile] = useMediaQuery("(max-width: 48em)");
  const navigate = useNavigate();
  const toast = useToast();
  
  const {
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
    isLoading,
    saveDraft,
  } = useBookingForm();

  const { handlePaymentSubmit } = usePaymentProcessing(formData, totalCost, setIsPaymentWindowOpen, navigate);

  const { register, handleSubmit, control, watch, setValue, trigger, formState: { errors, isValid } } = useForm({
    mode: 'onChange',
    defaultValues: {
      ...formData,
      pickupDateTime: formData.pickupDateTime ? new Date(formData.pickupDateTime) : null,
    },
    resolver: yupResolver(schema)
  });

  const totalSteps = 4;
  const watchVehicleModel = watch('vehicleModel');

  const currentStep = useMemo(() => {
    if (!watchVehicleModel) return 0;
    if (!formData.pickupAddress || !formData.dropOffAddress) return 1;
    if (!formData.serviceType) return 2;
    return 3;
  }, [watchVehicleModel, formData.pickupAddress, formData.dropOffAddress, formData.serviceType]);

  const handlePrevious = () => {
    if (currentStep > 0) {
      // Logic to go to the previous step
    }
  };

  const handleNext = async () => {
    const isStepValid = await trigger();
    if (isStepValid && currentStep < totalSteps - 1) {
      // Logic to go to the next step
    }
  };

  const handleSaveDraft = async () => {
    const currentFormData = await handleSubmit(data => data)();
    await saveDraft(currentFormData);
  };

  const onSubmit = async (data) => {
    await handleBookingProcess({
      ...data,
      additional_details: data.additionalDetails,
    });
  };

  return (
    <Box 
      width="100%"
      maxWidth={{ base: "100%", md: "400px" }}
      margin="auto"
      padding={4}
      bg="white"
      borderRadius="md"
      boxShadow="xl"
      zIndex={1000}
      aria-label="Booking form"
    >
      <VStack spacing={4} align="stretch">
        <Heading as="h1" size="lg">Booking Form</Heading>
        <Suspense fallback={<Spinner aria-label="Loading form steps" />}>
          <BookingFormStepper currentStep={currentStep} />
        </Suspense>
        <form onSubmit={handleSubmit(onSubmit)} aria-label="Tow truck service booking form">
          <FormNavButtons
            currentStep={currentStep}
            totalSteps={totalSteps}
            onPrevious={handlePrevious}
            onNext={handleNext}
          />
          <BookingFormFields
            register={register}
            errors={errors}
            control={control}
            formData={formData}
            handleChange={handleChange}
            handleDateTimeChange={handleDateTimeChange}
          />
          <BookingFormSummary distance={distance} totalCost={totalCost} />
          <FormButtons 
            isValid={isValid} 
            isLoading={isLoading} 
            onCancel={() => navigate('/')} 
            onSaveDraft={handleSaveDraft}
          />
        </form>
      </VStack>
      <Suspense fallback={<Spinner aria-label="Loading payment window" />}>
        <PaymentWindowWrapper
          isOpen={isPaymentWindowOpen}
          onClose={() => setIsPaymentWindowOpen(false)}
          onPaymentSubmit={handlePaymentSubmit}
          totalCost={totalCost}
        />
      </Suspense>
    </Box>
  );
};

export default BookingForm;