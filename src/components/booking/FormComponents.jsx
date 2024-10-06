import React from 'react';
import { FormControl, FormLabel, Input, Select, FormErrorMessage } from "@chakra-ui/react";
import DatePicker from "react-datepicker";
import { Controller } from "react-hook-form";

export const FormField = ({ label, children, error, id }) => (
  <FormControl isInvalid={error} id={id}>
    <FormLabel htmlFor={id}>{label}</FormLabel>
    {children}
    <FormErrorMessage>{error && error.message}</FormErrorMessage>
  </FormControl>
);

export const SelectField = ({ label, name, options = [], register, errors, value, onChange, disabled = false }) => (
  <FormField label={label} error={errors[name]} id={name}>
    <Select
      {...register(name, { required: `${label} es requerido` })}
      value={value}
      onChange={onChange}
      name={name}
      disabled={disabled}
      autoComplete={name}
    >
      <option value="">Seleccione {label.toLowerCase()}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>{option.label}</option>
      ))}
    </Select>
  </FormField>
);

export const InputField = ({ label, name, register, errors, value, onChange, type = "text", validation = {} }) => (
  <FormField label={label} error={errors[name]} id={name}>
    <Input
      {...register(name, { required: `${label} es requerido`, ...validation })}
      value={value}
      onChange={onChange}
      name={name}
      type={type}
      autoComplete={name}
    />
  </FormField>
);

export const DateTimeField = ({ label, name, control, errors, value, onChange }) => (
  <FormField label={label} error={errors[name]} id={name}>
    <Controller
      control={control}
      name={name}
      rules={{ required: "La fecha y hora de recogida son requeridas" }}
      render={({ field }) => (
        <DatePicker
          selected={field.value}
          onChange={(date) => {
            field.onChange(date);
            onChange(date);
          }}
          showTimeSelect
          dateFormat="Pp"
          customInput={<Input autoComplete="off" />}
        />
      )}
    />
  </FormField>
);