import React from 'react';
import { FormControl, FormLabel, Input, Select, FormErrorMessage, VisuallyHidden, useMediaQuery } from "@chakra-ui/react";
import DatePicker from "react-datepicker";
import { Controller } from "react-hook-form";

export const FormField = ({ label, children, error, id }) => (
  <FormControl isInvalid={error} id={id} mb={4}>
    <FormLabel htmlFor={id}>{label}</FormLabel>
    {children}
    <FormErrorMessage>{error && error.message}</FormErrorMessage>
  </FormControl>
);

export const SelectField = ({ label, name, options = [], register, errors, value, onChange, disabled = false }) => {
  const [isMobile] = useMediaQuery("(max-width: 48em)");
  
  return (
    <FormField label={label} error={errors[name]} id={name}>
      <Select
        {...register(name)}
        value={value}
        onChange={onChange}
        name={name}
        disabled={disabled}
        autoComplete={name}
        aria-label={label}
        size={isMobile ? "lg" : "md"}
      >
        <option value="">Select {label.toLowerCase()}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </Select>
    </FormField>
  );
};

export const InputField = ({ label, name, register, errors, value, onChange, type = "text", validation = {} }) => {
  const [isMobile] = useMediaQuery("(max-width: 48em)");
  
  return (
    <FormField label={label} error={errors[name]} id={name}>
      <Input
        {...register(name, validation)}
        value={value}
        onChange={onChange}
        name={name}
        type={type}
        autoComplete={name}
        aria-label={label}
        size={isMobile ? "lg" : "md"}
      />
    </FormField>
  );
};

export const DateTimeField = ({ label, name, control, errors, value, onChange }) => {
  const [isMobile] = useMediaQuery("(max-width: 48em)");
  
  return (
    <FormField label={label} error={errors[name]} id={name}>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <DatePicker
            selected={field.value}
            onChange={(date) => {
              field.onChange(date);
              onChange(date);
            }}
            showTimeSelect
            dateFormat="Pp"
            customInput={<Input autoComplete="off" aria-label={label} size={isMobile ? "lg" : "md"} />}
          />
        )}
      />
    </FormField>
  );
};

export const HiddenLabel = ({ children, htmlFor }) => (
  <VisuallyHidden as="label" htmlFor={htmlFor}>
    {children}
  </VisuallyHidden>
);