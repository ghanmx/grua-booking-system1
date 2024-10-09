import React from 'react';
import { Button, HStack } from "@chakra-ui/react";

const FormNavButtons = ({ currentStep, totalSteps, onPrevious, onNext }) => {
  return (
    <HStack justifyContent="space-between" width="100%" my={4}>
      <Button
        onClick={onPrevious}
        isDisabled={currentStep === 0}
        colorScheme="gray"
      >
        Anterior
      </Button>
      <Button
        onClick={onNext}
        isDisabled={currentStep === totalSteps - 1}
        colorScheme="blue"
      >
        Siguiente
      </Button>
    </HStack>
  );
};

export default FormNavButtons;