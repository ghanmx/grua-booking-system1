import React from 'react';
import { Stepper, Step, StepIndicator, StepStatus, StepTitle, StepDescription, StepSeparator, Box } from "@chakra-ui/react";

const steps = [
  { title: 'Vehículo', description: 'Detalles del vehículo' },
  { title: 'Ubicación', description: 'Punto de recogida y destino' },
  { title: 'Servicio', description: 'Tipo de servicio y detalles' },
  { title: 'Confirmación', description: 'Revisar y confirmar' }
];

const BookingFormStepper = ({ currentStep }) => (
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
);

export default BookingFormStepper;