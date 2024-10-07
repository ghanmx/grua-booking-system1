import React from 'react';
import { VStack } from "@chakra-ui/react";
import { SelectField, InputField, DateTimeField } from './FloatingFormFields';

export const fieldNames = [
  'userName',
  'phoneNumber',
  'vehicleBrand',
  'vehicleModel',
  'vehicleColor',
  'licensePlate',
  'pickupAddress',
  'dropOffAddress',
  'pickupDateTime',
  'serviceType',
  'additionalDetails'
];

export const renderField = (fieldName, props) => {
  const {
    register,
    errors,
    formData,
    handleChange,
    control,
    handleDateTimeChange,
    vehicleBrands,
    vehicleModels
  } = props;

  switch (fieldName) {
    case 'vehicleBrand':
      return (
        <SelectField
          key={fieldName}
          label="Vehicle Brand"
          name={fieldName}
          options={vehicleBrands}
          register={register}
          errors={errors}
          value={formData[fieldName]}
          onChange={handleChange}
        />
      );
    case 'vehicleModel':
      return (
        <SelectField
          key={fieldName}
          label="Vehicle Model"
          name={fieldName}
          options={formData.vehicleBrand ? vehicleModels[formData.vehicleBrand] || [] : []}
          register={register}
          errors={errors}
          value={formData[fieldName]}
          onChange={handleChange}
          disabled={!formData.vehicleBrand}
        />
      );
    case 'pickupDateTime':
      return (
        <DateTimeField
          key={fieldName}
          label="Pickup Date and Time"
          name={fieldName}
          control={control}
          errors={errors}
          value={formData[fieldName]}
          onChange={handleDateTimeChange}
        />
      );
    case 'serviceType':
      return (
        <SelectField
          key={fieldName}
          label="Service Type"
          name={fieldName}
          options={[
            { value: "Tow", label: "Tow" },
            { value: "Jumpstart", label: "Jumpstart" },
            { value: "Tire Change", label: "Tire Change" },
            { value: "Fuel Delivery", label: "Fuel Delivery" }
          ]}
          register={register}
          errors={errors}
          value={formData[fieldName]}
          onChange={handleChange}
        />
      );
    default:
      return (
        <InputField
          key={fieldName}
          label={fieldName.charAt(0).toUpperCase() + fieldName.slice(1).replace(/([A-Z])/g, ' $1').trim()}
          name={fieldName}
          register={register}
          errors={errors}
          value={formData[fieldName]}
          onChange={handleChange}
        />
      );
  }
};

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