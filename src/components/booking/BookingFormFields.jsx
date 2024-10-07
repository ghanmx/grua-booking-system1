import React from 'react';
import { VStack } from "@chakra-ui/react";

const BookingFormFields = ({ fieldNames, renderField, register, errors, formData, handleChange, control, handleDateTimeChange, vehicleBrands, vehicleModels }) => {
  return (
    <VStack spacing={4} align="stretch">
      {fieldNames.map((fieldName) =>
        renderField(fieldName, {
          register,
          errors,
          formData,
          handleChange,
          control,
          handleDateTimeChange,
          vehicleBrands,
          vehicleModels,
        })
      )}
    </VStack>
  );
};

export default BookingFormFields;