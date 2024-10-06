import React from 'react';
import { Box, Step, StepIcon, StepIndicator, StepNumber, StepSeparator, StepStatus, Stepper, useSteps } from "@chakra-ui/react";

const steps = [
  { title: 'Vehicle Details', description: 'Enter vehicle information' },
  { title: 'Location', description: 'Set pickup and dropoff' },
  { title: 'Service Type', description: 'Choose towing service' },
  { title: 'Confirmation', description: 'Review and confirm' }
];

const BookingFormStepper = ({ currentStep }) => {
  const { activeStep } = useSteps({
    index: currentStep,
    count: steps.length,
  });

  return (
    <Stepper index={activeStep} colorScheme="blue" size="sm">
      {steps.map((step, index) => (
        <Step key={index}>
          <StepIndicator>
            <StepStatus
              complete={<StepIcon />}
              incomplete={<StepNumber />}
              active={<StepNumber />}
            />
          </StepIndicator>
          <Box flexShrink='0'>
            <StepStatus
              complete={step.title}
              incomplete={step.title}
              active={step.title}
            />
          </Box>
          <StepSeparator />
        </Step>
      ))}
    </Stepper>
  );
};

export default BookingFormStepper;