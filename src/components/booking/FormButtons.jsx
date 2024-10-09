import React from 'react';
import { HStack, Button } from "@chakra-ui/react";

export const FormButtons = ({ isValid, isLoading, onCancel, onSaveDraft }) => (
  <HStack spacing={4} justify="space-between" mt={4}>
    <Button 
      onClick={onCancel}
      colorScheme="gray"
      aria-label="Cancel booking"
    >
      Cancel
    </Button>
    <Button 
      onClick={onSaveDraft}
      colorScheme="teal"
      aria-label="Save booking draft"
    >
      Save Draft
    </Button>
    <Button 
      type="submit"
      colorScheme="blue"
      isLoading={isLoading} 
      isDisabled={!isValid || isLoading}
      aria-label="Submit booking request"
    >
      Book Now
    </Button>
  </HStack>
);