import React from 'react';
import { VStack } from "@chakra-ui/react";
import { InputField, SelectField, DateTimeField } from '../common/FormComponents';
import { vehicleBrands, vehicleModels, vehicleSizes } from '../../utils/vehicleData';

const BookingFormFields = ({ register, errors, control, formData, handleChange, handleDateTimeChange }) => {
  return (
    <VStack spacing={4} align="stretch">
      <InputField
        label="Name"
        name="userName"
        register={register}
        errors={errors}
        value={formData.userName}
        onChange={handleChange}
      />
      <InputField
        label="Phone Number"
        name="phoneNumber"
        register={register}
        errors={errors}
        value={formData.phoneNumber}
        onChange={handleChange}
        type="tel"
      />
      <SelectField
        label="Vehicle Brand"
        name="vehicleBrand"
        options={vehicleBrands.map(brand => ({ value: brand, label: brand }))}
        register={register}
        errors={errors}
        value={formData.vehicleBrand}
        onChange={handleChange}
      />
      <SelectField
        label="Vehicle Model"
        name="vehicleModel"
        options={formData.vehicleBrand && vehicleModels[formData.vehicleBrand]
          ? vehicleModels[formData.vehicleBrand].map(model => ({ value: model, label: model }))
          : []
        }
        register={register}
        errors={errors}
        value={formData.vehicleModel}
        onChange={handleChange}
        disabled={!formData.vehicleBrand}
      />
      <InputField
        label="Vehicle Color"
        name="vehicleColor"
        register={register}
        errors={errors}
        value={formData.vehicleColor}
        onChange={handleChange}
      />
      <InputField
        label="License Plate"
        name="licensePlate"
        register={register}
        errors={errors}
        value={formData.licensePlate}
        onChange={handleChange}
      />
      <SelectField
        label="Vehicle Size"
        name="vehicleSize"
        options={Object.entries(vehicleSizes).map(([size, models]) => ({ value: size, label: size.charAt(0).toUpperCase() + size.slice(1) }))}
        register={register}
        errors={errors}
        value={formData.vehicleSize}
        onChange={handleChange}
      />
      <InputField
        label="Pickup Address"
        name="pickupAddress"
        register={register}
        errors={errors}
        value={formData.pickupAddress}
        onChange={handleChange}
      />
      <InputField
        label="Drop-off Address"
        name="dropOffAddress"
        register={register}
        errors={errors}
        value={formData.dropOffAddress}
        onChange={handleChange}
      />
      <DateTimeField
        label="Pickup Date and Time"
        name="pickupDateTime"
        control={control}
        errors={errors}
        value={formData.pickupDateTime}
        onChange={handleDateTimeChange}
      />
      <InputField
        label="Additional Details"
        name="additionalDetails"
        register={register}
        errors={errors}
        value={formData.additionalDetails}
        onChange={handleChange}
      />
    </VStack>
  );
};

export default BookingFormFields;