import React from 'react';
import { FormControl, FormLabel, Input, Select, Textarea, Radio, RadioGroup, Stack, FormErrorMessage, Checkbox } from "@chakra-ui/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Controller } from "react-hook-form";

const FormField = ({ label, children, error, id }) => (
  <FormControl isInvalid={error} id={id}>
    <FormLabel htmlFor={id}>{label}</FormLabel>
    {children}
    <FormErrorMessage>{error && error.message}</FormErrorMessage>
  </FormControl>
);

const SelectField = ({ label, name, options, register, errors, value, onChange, disabled = false }) => (
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

const InputField = ({ label, name, register, errors, value, onChange, type = "text", validation = {} }) => (
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

const fields = {
  serviceType: (props) => (
    <SelectField
      label="Tipo de Servicio de Grúa"
      name="serviceType"
      options={[
        { value: "flatbed", label: "Grúa de Plataforma" },
        { value: "flatbedLarge", label: "Grúa de Plataforma (Vehículo Grande)" },
        { value: "heavyDuty", label: "Grúa para Camiones/Camionetas Pesadas" }
      ]}
      {...props}
    />
  ),
  userName: (props) => (
    <InputField
      label="Nombre"
      name="userName"
      {...props}
    />
  ),
  phoneNumber: (props) => (
    <InputField
      label="Número de Teléfono"
      name="phoneNumber"
      type="tel"
      validation={{
        pattern: {
          value: /^\d{10}$/,
          message: "Número de teléfono inválido, debe tener 10 dígitos"
        }
      }}
      {...props}
    />
  ),
  vehicleBrand: (props) => (
    <SelectField
      label="Marca del Vehículo"
      name="vehicleBrand"
      {...props}
    />
  ),
  vehicleModel: (props) => (
    <SelectField
      label="Modelo del Vehículo"
      name="vehicleModel"
      {...props}
    />
  ),
  vehicleColor: (props) => (
    <InputField
      label="Color del Vehículo"
      name="vehicleColor"
      {...props}
    />
  ),
  licensePlate: (props) => (
    <InputField
      label="Placa del Vehículo"
      name="licensePlate"
      {...props}
    />
  ),
  vehicleCondition: ({ control, errors }) => (
    <FormField label="Condición del Vehículo" error={errors.vehicleCondition} id="vehicleCondition">
      <Stack spacing={2}>
        {['inNeutral', 'engineStarts', 'wheelsSteer'].map((field) => (
          <Controller
            key={field}
            name={field}
            control={control}
            render={({ field: { onChange, value, ref } }) => (
              <Checkbox onChange={onChange} isChecked={value} ref={ref} id={field}>
                {field === 'inNeutral' ? 'Se puede poner en neutral' :
                 field === 'engineStarts' ? 'El motor enciende' : 'Las ruedas giran'}
              </Checkbox>
            )}
          />
        ))}
      </Stack>
    </FormField>
  ),
  vehiclePosition: ({ control, errors }) => (
    <FormField label="Posición del Vehículo" error={errors.vehiclePosition} id="vehiclePosition">
      <Controller
        name="vehiclePosition"
        control={control}
        rules={{ required: "La posición del vehículo es requerida" }}
        render={({ field }) => (
          <RadioGroup {...field}>
            <Stack direction="column">
              <Radio value="roadside" id="roadside">Al lado de la pista/carretera</Radio>
              <Radio value="obstructed" id="obstructed">Obstruido/Requiere maniobra</Radio>
            </Stack>
          </RadioGroup>
        )}
      />
    </FormField>
  ),
  additionalDetails: (props) => (
    <FormField label="Detalles Adicionales" error={props.errors.additionalDetails} id="additionalDetails">
      <Textarea
        {...props.register("additionalDetails")}
        placeholder="Cualquier otra información sobre el vehículo o la situación"
        value={props.formData.additionalDetails}
        onChange={props.handleChange}
        name="additionalDetails"
        autoComplete="off"
      />
    </FormField>
  ),
  pickupDateTime: ({ control, errors, handleDateTimeChange }) => (
    <FormField label="Fecha y Hora de Recogida" error={errors.pickupDateTime} id="pickupDateTime">
      <Controller
        control={control}
        name="pickupDateTime"
        rules={{ required: "La fecha y hora de recogida son requeridas" }}
        render={({ field }) => (
          <DatePicker
            selected={field.value}
            onChange={(date) => {
              field.onChange(date);
              handleDateTimeChange(date);
            }}
            showTimeSelect
            dateFormat="Pp"
            customInput={<Input autoComplete="off" />}
          />
        )}
      />
    </FormField>
  ),
  paymentMethod: (props) => (
    <SelectField
      label="Método de Pago"
      name="paymentMethod"
      options={[
        { value: "card", label: "Tarjeta de Crédito/Débito" },
        { value: "paypal", label: "PayPal" }
      ]}
      {...props}
    />
  ),
};

export const renderField = (fieldName, props) => {
  const FieldComponent = fields[fieldName];
  return FieldComponent ? <FieldComponent key={fieldName} {...props} /> : null;
};

export const fieldNames = Object.keys(fields);