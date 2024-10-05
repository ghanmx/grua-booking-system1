import React from 'react';
import { FormControl, FormLabel, Input, Select, Textarea, Radio, RadioGroup, Stack, FormErrorMessage, Checkbox } from "@chakra-ui/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Controller } from "react-hook-form";

const FormField = ({ label, children, error }) => (
  <FormControl isInvalid={error}>
    <FormLabel>{label}</FormLabel>
    {children}
    <FormErrorMessage>{error && error.message}</FormErrorMessage>
  </FormControl>
);

const SelectField = ({ label, name, options, register, errors, value, onChange, disabled = false }) => (
  <FormField label={label} error={errors[name]}>
    <Select
      {...register(name, { required: `${label} es requerido` })}
      value={value}
      onChange={onChange}
      name={name}
      disabled={disabled}
    >
      <option value="">Seleccione {label.toLowerCase()}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>{option.label}</option>
      ))}
    </Select>
  </FormField>
);

const InputField = ({ label, name, register, errors, value, onChange, type = "text", validation = {} }) => (
  <FormField label={label} error={errors[name]}>
    <Input
      {...register(name, { required: `${label} es requerido`, ...validation })}
      value={value}
      onChange={onChange}
      name={name}
      type={type}
    />
  </FormField>
);

export const ServiceTypeField = React.memo(({ register, errors, formData, handleChange }) => (
  <SelectField
    label="Tipo de Servicio de Grúa"
    name="serviceType"
    options={[
      { value: "flatbed", label: "Grúa de Plataforma" },
      { value: "flatbedLarge", label: "Grúa de Plataforma (Vehículo Grande)" },
      { value: "heavyDuty", label: "Grúa para Camiones/Camionetas Pesadas" }
    ]}
    register={register}
    errors={errors}
    value={formData.serviceType}
    onChange={handleChange}
  />
));

export const UserInfoFields = React.memo(({ register, errors, formData, handleChange }) => (
  <>
    <InputField
      label="Nombre"
      name="userName"
      register={register}
      errors={errors}
      value={formData.userName}
      onChange={handleChange}
    />
    <InputField
      label="Número de Teléfono"
      name="phoneNumber"
      register={register}
      errors={errors}
      value={formData.phoneNumber}
      onChange={handleChange}
      validation={{
        pattern: {
          value: /^\d{10}$/,
          message: "Número de teléfono inválido, debe tener 10 dígitos"
        }
      }}
    />
  </>
));

export const VehicleInfoFields = React.memo(({ register, errors, formData, handleChange, vehicleBrands, vehicleModels }) => (
  <>
    <SelectField
      label="Marca del Vehículo"
      name="vehicleBrand"
      options={vehicleBrands.map(brand => ({ value: brand, label: brand }))}
      register={register}
      errors={errors}
      value={formData.vehicleBrand}
      onChange={handleChange}
    />
    <SelectField
      label="Modelo del Vehículo"
      name="vehicleModel"
      options={(formData.vehicleBrand && vehicleModels[formData.vehicleBrand]) || []}
      register={register}
      errors={errors}
      value={formData.vehicleModel}
      onChange={handleChange}
      disabled={!formData.vehicleBrand}
    />
    <InputField
      label="Color del Vehículo"
      name="vehicleColor"
      register={register}
      errors={errors}
      value={formData.vehicleColor}
      onChange={handleChange}
    />
    <InputField
      label="Placa del Vehículo"
      name="licensePlate"
      register={register}
      errors={errors}
      value={formData.licensePlate}
      onChange={handleChange}
    />
  </>
));

export const VehicleConditionFields = React.memo(({ control, errors, register }) => (
  <>
    <FormField label="Condición del Vehículo" error={errors.vehicleCondition}>
      <Stack spacing={2}>
        {['inNeutral', 'engineStarts', 'wheelsSteer'].map((field) => (
          <Controller
            key={field}
            name={field}
            control={control}
            render={({ field: { onChange, value, ref } }) => (
              <Checkbox onChange={onChange} isChecked={value} ref={ref}>
                {field === 'inNeutral' ? 'Se puede poner en neutral' :
                 field === 'engineStarts' ? 'El motor enciende' : 'Las ruedas giran'}
              </Checkbox>
            )}
          />
        ))}
      </Stack>
    </FormField>
    <FormField label="Posición del Vehículo" error={errors.vehiclePosition}>
      <Controller
        name="vehiclePosition"
        control={control}
        rules={{ required: "La posición del vehículo es requerida" }}
        render={({ field }) => (
          <RadioGroup {...field}>
            <Stack direction="column">
              <Radio value="roadside">Al lado de la pista/carretera</Radio>
              <Radio value="obstructed">Obstruido/Requiere maniobra</Radio>
            </Stack>
          </RadioGroup>
        )}
      />
    </FormField>
  </>
));

export const AdditionalDetailsField = React.memo(({ register, errors, formData, handleChange }) => (
  <FormField label="Detalles Adicionales" error={errors.additionalDetails}>
    <Textarea
      {...register("additionalDetails")}
      placeholder="Cualquier otra información sobre el vehículo o la situación"
      value={formData.additionalDetails}
      onChange={handleChange}
      name="additionalDetails"
    />
  </FormField>
));

export const PickupDateTimeField = React.memo(({ control, errors, handleDateTimeChange }) => (
  <FormField label="Fecha y Hora de Recogida" error={errors.pickupDateTime}>
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
          customInput={<Input />}
        />
      )}
    />
  </FormField>
));

export const PaymentMethodField = React.memo(({ register, errors, formData, handleChange }) => (
  <SelectField
    label="Método de Pago"
    name="paymentMethod"
    options={[
      { value: "card", label: "Tarjeta de Crédito/Débito" },
      { value: "paypal", label: "PayPal" }
    ]}
    register={register}
    errors={errors}
    value={formData.paymentMethod}
    onChange={handleChange}
  />
));