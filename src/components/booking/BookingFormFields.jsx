import React from 'react';
import { FormControl, FormLabel, Input, Select } from "@chakra-ui/react";
import DatePicker from "react-datepicker";

export const BookingFormFields = ({
  register,
  errors,
  control,
  formData,
  handleChange,
  handleDateTimeChange,
  vehicleBrands,
  vehicleModels
}) => {
  return (
    <>
      <FormControl isInvalid={errors.userName}>
        <FormLabel htmlFor="userName">Name</FormLabel>
        <Input
          id="userName"
          {...register('userName')}
          placeholder="Your Name"
        />
      </FormControl>
      <FormControl isInvalid={errors.phoneNumber}>
        <FormLabel htmlFor="phoneNumber">Phone Number</FormLabel>
        <Input
          id="phoneNumber"
          {...register('phoneNumber')}
          placeholder="Your Phone Number"
        />
      </FormControl>
      <FormControl isInvalid={errors.vehicleBrand}>
        <FormLabel htmlFor="vehicleBrand">Vehicle Brand</FormLabel>
        <Select
          id="vehicleBrand"
          {...register('vehicleBrand')}
          placeholder="Select Vehicle Brand"
          onChange={handleChange}
        >
          {Array.isArray(vehicleBrands) && vehicleBrands.map((brand) => (
            <option key={brand} value={brand}>{brand}</option>
          ))}
        </Select>
      </FormControl>
      <FormControl isInvalid={errors.vehicleModel}>
        <FormLabel htmlFor="vehicleModel">Vehicle Model</FormLabel>
        <Select
          id="vehicleModel"
          {...register('vehicleModel')}
          placeholder="Select Vehicle Model"
          onChange={handleChange}
        >
          {Array.isArray(vehicleModels) && vehicleModels.map((model) => (
            <option key={model} value={model}>{model}</option>
          ))}
        </Select>
      </FormControl>
      <FormControl isInvalid={errors.vehicleColor}>
        <FormLabel htmlFor="vehicleColor">Vehicle Color</FormLabel>
        <Input
          id="vehicleColor"
          {...register('vehicleColor')}
          placeholder="Vehicle Color"
        />
      </FormControl>
      <FormControl isInvalid={errors.licensePlate}>
        <FormLabel htmlFor="licensePlate">License Plate</FormLabel>
        <Input
          id="licensePlate"
          {...register('licensePlate')}
          placeholder="License Plate"
        />
      </FormControl>
      <FormControl isInvalid={errors.pickupAddress}>
        <FormLabel htmlFor="pickupAddress">Pickup Address</FormLabel>
        <Input
          id="pickupAddress"
          {...register('pickupAddress')}
          placeholder="Pickup Address"
        />
      </FormControl>
      <FormControl isInvalid={errors.dropOffAddress}>
        <FormLabel htmlFor="dropOffAddress">Drop-off Address</FormLabel>
        <Input
          id="dropOffAddress"
          {...register('dropOffAddress')}
          placeholder="Drop-off Address"
        />
      </FormControl>
      <FormControl isInvalid={errors.pickupDateTime}>
        <FormLabel htmlFor="pickupDateTime">Pickup Date & Time</FormLabel>
        <DatePicker
          id="pickupDateTime"
          selected={formData.pickupDateTime}
          onChange={handleDateTimeChange}
          showTimeSelect
          dateFormat="Pp"
          placeholderText="Select Date and Time"
        />
      </FormControl>
    </>
  );
};