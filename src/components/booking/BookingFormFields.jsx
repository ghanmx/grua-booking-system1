import React from 'react';
import { FormControl, FormLabel, Input, Select, Textarea, Radio, RadioGroup, Stack, FormErrorMessage } from "@chakra-ui/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Controller } from "react-hook-form";

export const ServiceTypeField = ({ register, errors, formData, handleChange }) => (
  <FormControl isInvalid={errors.serviceType}>
    <FormLabel>Tow Service Type</FormLabel>
    <Select
      {...register("serviceType", { required: "Service type is required" })}
      value={formData.serviceType}
      onChange={handleChange}
      name="serviceType"
    >
      <option value="">Select a tow service</option>
      <option value="Standard Tow">Standard Tow</option>
      <option value="Flatbed Tow">Flatbed Tow</option>
      <option value="Long Distance Tow">Long Distance Tow</option>
      <option value="Heavy Duty Tow">Heavy Duty Tow</option>
    </Select>
    <FormErrorMessage>{errors.serviceType && errors.serviceType.message}</FormErrorMessage>
  </FormControl>
);

export const UserInfoFields = ({ register, errors, formData, handleChange }) => (
  <>
    <FormControl isInvalid={errors.userName}>
      <FormLabel>Name</FormLabel>
      <Input
        {...register("userName", { required: "Name is required" })}
        value={formData.userName}
        onChange={handleChange}
        name="userName"
      />
      <FormErrorMessage>{errors.userName && errors.userName.message}</FormErrorMessage>
    </FormControl>
    
    <FormControl isInvalid={errors.phoneNumber}>
      <FormLabel>Phone Number</FormLabel>
      <Input
        {...register("phoneNumber", { 
          required: "Phone number is required",
          pattern: {
            value: /^\d{10}$/,
            message: "Invalid phone number, should be 10 digits"
          }
        })}
        value={formData.phoneNumber}
        onChange={handleChange}
        name="phoneNumber"
      />
      <FormErrorMessage>{errors.phoneNumber && errors.phoneNumber.message}</FormErrorMessage>
    </FormControl>
  </>
);

export const VehicleInfoFields = ({ register, errors, formData, handleChange, vehicleBrands, vehicleModels }) => (
  <>
    <FormControl isInvalid={errors.vehicleBrand}>
      <FormLabel>Vehicle Brand</FormLabel>
      <Select
        {...register("vehicleBrand", { required: "Vehicle brand is required" })}
        value={formData.vehicleBrand}
        onChange={handleChange}
        name="vehicleBrand"
      >
        <option value="">Select a brand</option>
        {vehicleBrands.map((brand) => (
          <option key={brand} value={brand}>{brand}</option>
        ))}
      </Select>
      <FormErrorMessage>{errors.vehicleBrand && errors.vehicleBrand.message}</FormErrorMessage>
    </FormControl>

    <FormControl isInvalid={errors.vehicleModel}>
      <FormLabel>Vehicle Model</FormLabel>
      <Select
        {...register("vehicleModel", { required: "Vehicle model is required" })}
        value={formData.vehicleModel}
        onChange={handleChange}
        name="vehicleModel"
        disabled={!formData.vehicleBrand}
      >
        <option value="">Select a model</option>
        {formData.vehicleBrand && vehicleModels[formData.vehicleBrand] && 
          vehicleModels[formData.vehicleBrand].map((model) => (
            <option key={model} value={model}>{model}</option>
          ))
        }
      </Select>
      <FormErrorMessage>{errors.vehicleModel && errors.vehicleModel.message}</FormErrorMessage>
    </FormControl>

    <FormControl isInvalid={errors.vehicleColor}>
      <FormLabel>Vehicle Color</FormLabel>
      <Input
        {...register("vehicleColor", { required: "Vehicle color is required" })}
        value={formData.vehicleColor}
        onChange={handleChange}
        name="vehicleColor"
      />
      <FormErrorMessage>{errors.vehicleColor && errors.vehicleColor.message}</FormErrorMessage>
    </FormControl>

    <FormControl isInvalid={errors.licensePlate}>
      <FormLabel>License Plate</FormLabel>
      <Input
        {...register("licensePlate", { required: "License plate is required" })}
        value={formData.licensePlate}
        onChange={handleChange}
        name="licensePlate"
      />
      <FormErrorMessage>{errors.licensePlate && errors.licensePlate.message}</FormErrorMessage>
    </FormControl>
  </>
);

export const VehicleConditionFields = ({ control, errors }) => (
  <>
    <FormControl isInvalid={errors.vehicleCondition}>
      <FormLabel>Vehicle Condition</FormLabel>
      <Controller
        name="vehicleCondition"
        control={control}
        rules={{ required: "Vehicle condition is required" }}
        render={({ field }) => (
          <RadioGroup {...field}>
            <Stack direction="column">
              <Radio value="driveable">Driveable</Radio>
              <Radio value="notDriveable">Not Driveable</Radio>
              <Radio value="accident">Accident/Collision</Radio>
            </Stack>
          </RadioGroup>
        )}
      />
      <FormErrorMessage>{errors.vehicleCondition && errors.vehicleCondition.message}</FormErrorMessage>
    </FormControl>

    <FormControl isInvalid={errors.vehiclePosition}>
      <FormLabel>Vehicle Position</FormLabel>
      <Controller
        name="vehiclePosition"
        control={control}
        rules={{ required: "Vehicle position is required" }}
        render={({ field }) => (
          <RadioGroup {...field}>
            <Stack direction="column">
              <Radio value="upright">Upright</Radio>
              <Radio value="onSide">On its side</Radio>
              <Radio value="upsideDown">Upside down</Radio>
            </Stack>
          </RadioGroup>
        )}
      />
      <FormErrorMessage>{errors.vehiclePosition && errors.vehiclePosition.message}</FormErrorMessage>
    </FormControl>
  </>
);

export const AdditionalDetailsField = ({ register, errors, formData, handleChange }) => (
  <FormControl isInvalid={errors.additionalDetails}>
    <FormLabel>Additional Details</FormLabel>
    <Textarea
      {...register("additionalDetails")}
      placeholder="Any other information about the vehicle or situation"
      value={formData.additionalDetails}
      onChange={handleChange}
      name="additionalDetails"
    />
    <FormErrorMessage>{errors.additionalDetails && errors.additionalDetails.message}</FormErrorMessage>
  </FormControl>
);

export const PickupDateTimeField = ({ control, errors, handleDateTimeChange }) => (
  <FormControl isInvalid={errors.pickupDateTime}>
    <FormLabel>Pickup Date and Time</FormLabel>
    <Controller
      control={control}
      name="pickupDateTime"
      rules={{ required: "Pickup date and time is required" }}
      render={({ field }) => (
        <DatePicker
          selected={field.value}
          onChange={(date) => {
            field.onChange(date);
            handleDateTimeChange(date);
          }}
          showTimeSelect
          dateFormat="Pp"
          customInput={<Input />}
        />
      )}
    />
    <FormErrorMessage>{errors.pickupDateTime && errors.pickupDateTime.message}</FormErrorMessage>
  </FormControl>
);

export const PaymentMethodField = ({ register, errors, formData, handleChange }) => (
  <FormControl isInvalid={errors.paymentMethod}>
    <FormLabel>Payment Method</FormLabel>
    <Select
      {...register("paymentMethod", { required: "Payment method is required" })}
      value={formData.paymentMethod}
      onChange={handleChange}
      name="paymentMethod"
    >
      <option value="">Select a payment method</option>
      <option value="card">Credit/Debit Card</option>
      <option value="paypal">PayPal</option>
    </Select>
    <FormErrorMessage>{errors.paymentMethod && errors.paymentMethod.message}</FormErrorMessage>
  </FormControl>
);