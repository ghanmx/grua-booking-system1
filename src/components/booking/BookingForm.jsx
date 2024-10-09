import React, { useMemo, lazy, Suspense } from 'react';
import { Box, VStack, Heading, Text, useToast, Spinner, useMediaQuery, Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useBookingForm } from '../../hooks/useBookingForm';
import { usePaymentProcessing } from '../../hooks/usePaymentProcessing';
import { BookingFormFields } from './BookingFormFields';
import { BookingFormSummary } from './BookingFormSummary';
import { FormButtons } from './FormButtons';
import FormNavButtons from './FormNavButtons';

const BookingFormStepper = lazy(() => import('./BookingFormStepper'));
const PaymentWindow = lazy(() => import('./PaymentWindow'));

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

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
});

const BookingForm = React.memo(({ vehicleBrands, vehicleModels, mapError }) => {
  const [isMobile] = useMediaQuery("(max-width: 48em)");
  const navigate = useNavigate();
  const toast = useToast();
  
  const {
    formData,
    setFormData,
    handleChange,
    handleDateTimeChange,
    handleBookingProcess,
    isLoading,
    totalCost,
    distance,
    isPaymentWindowOpen,
    setIsPaymentWindowOpen,
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
      // This could involve updating the form state or changing the visible fields
    }
  };

  const handleNext = async () => {
    // Validate the current step before moving to the next
    const isStepValid = await trigger();
    if (isStepValid && currentStep < totalSteps - 1) {
      // Logic to go to the next step
      // This could involve updating the form state or changing the visible fields
    } else {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields correctly before proceeding.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleSaveDraft = async () => {
    const currentFormData = await handleSubmit(data => data)();
    const draftSaved = await saveDraft(currentFormData);
    if (draftSaved) {
      toast({
        title: "Draft Saved",
        description: "Your booking draft has been saved successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } else {
      toast({
        title: "Error",
        description: "There was an error saving your draft. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  React.useEffect(() => {
    setValue('pickupAddress', formData.pickupAddress);
    setValue('dropOffAddress', formData.dropOffAddress);
  }, [formData.pickupAddress, formData.dropOffAddress, setValue]);

  const renderForm = () => (
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
        vehicleBrands={vehicleBrands}
        vehicleModels={vehicleModels}
        currentStep={currentStep}
      />
      <BookingFormSummary distance={distance} totalCost={totalCost} />
      <FormButtons 
        isValid={isValid} 
        isLoading={isLoading} 
        onCancel={() => navigate('/')} 
        onSaveDraft={handleSaveDraft}
      />
    </form>
  );

  return (
    <Box 
      position={isMobile ? "static" : "fixed"}
      top={isMobile ? "auto" : "20px"}
      right={isMobile ? "auto" : "20px"}
      width={isMobile ? "100%" : "400px"}
      maxHeight={isMobile ? "auto" : "calc(100vh - 40px)"}
      overflowY={isMobile ? "visible" : "auto"}
      bg="white"
      p={4}
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
        {isMobile ? (
          <Tabs isFitted variant="enclosed">
            <TabList mb="1em">
              <Tab>Form</Tab>
              <Tab>Map</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>{renderForm()}</TabPanel>
              <TabPanel>
                <Box height="300px" width="100%">
                  <Text>Map will be displayed here</Text>
                </Box>
              </TabPanel>
            </TabPanels>
          </Tabs>
        ) : (
          renderForm()
        )}
      </VStack>
      <Suspense fallback={<Spinner aria-label="Loading payment window" />}>
        <Elements stripe={stripePromise}>
          <PaymentWindow
            isOpen={isPaymentWindowOpen}
            onClose={() => setIsPaymentWindowOpen(false)}
            onPaymentSubmit={handlePaymentSubmit}
            totalCost={totalCost}
          />
        </Elements>
      </Suspense>
    </Box>
  );
});

export default BookingForm;