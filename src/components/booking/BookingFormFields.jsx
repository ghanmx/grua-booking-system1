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

export const ServiceTypeField = React.memo(({ register, errors, formData, handleChange }) => (
  <FormField label="Tipo de Servicio de Grúa" error={errors.serviceType}>
    <Select
      {...register("serviceType", { required: "El tipo de servicio es requerido" })}
      value={formData.serviceType}
      onChange={handleChange}
      name="serviceType"
    >
      <option value="">Seleccione un servicio de grúa</option>
      <option value="flatbed">Grúa de Plataforma</option>
      <option value="flatbedLarge">Grúa de Plataforma (Vehículo Grande)</option>
      <option value="heavyDuty">Grúa para Camiones/Camionetas Pesadas</option>
    </Select>
  </FormField>
));

export const UserInfoFields = React.memo(({ register, errors, formData, handleChange }) => (
  <>
    <FormField label="Nombre" error={errors.userName}>
      <Input
        {...register("userName", { required: "El nombre es requerido" })}
        value={formData.userName}
        onChange={handleChange}
        name="userName"
      />
    </FormField>
    
    <FormField label="Número de Teléfono" error={errors.phoneNumber}>
      <Input
        {...register("phoneNumber", { 
          required: "El número de teléfono es requerido",
          pattern: {
            value: /^\d{10}$/,
            message: "Número de teléfono inválido, debe tener 10 dígitos"
          }
        })}
        value={formData.phoneNumber}
        onChange={handleChange}
        name="phoneNumber"
      />
    </FormField>
  </>
));

export const VehicleInfoFields = React.memo(({ register, errors, formData, handleChange, vehicleBrands, vehicleModels }) => (
  <>
    <FormField label="Marca del Vehículo" error={errors.vehicleBrand}>
      <Select
        {...register("vehicleBrand", { required: "La marca del vehículo es requerida" })}
        value={formData.vehicleBrand}
        onChange={handleChange}
        name="vehicleBrand"
      >
        <option value="">Seleccione una marca</option>
        {vehicleBrands.map((brand) => (
          <option key={brand} value={brand}>{brand}</option>
        ))}
      </Select>
    </FormField>

    <FormField label="Modelo del Vehículo" error={errors.vehicleModel}>
      <Select
        {...register("vehicleModel", { required: "El modelo del vehículo es requerido" })}
        value={formData.vehicleModel}
        onChange={handleChange}
        name="vehicleModel"
        disabled={!formData.vehicleBrand}
      >
        <option value="">Seleccione un modelo</option>
        {formData.vehicleBrand && vehicleModels[formData.vehicleBrand] && 
          vehicleModels[formData.vehicleBrand].map((model) => (
            <option key={model} value={model}>{model}</option>
          ))
        }
      </Select>
    </FormField>

    <FormField label="Color del Vehículo" error={errors.vehicleColor}>
      <Input
        {...register("vehicleColor", { required: "El color del vehículo es requerido" })}
        value={formData.vehicleColor}
        onChange={handleChange}
        name="vehicleColor"
      />
    </FormField>

    <FormField label="Placa del Vehículo" error={errors.licensePlate}>
      <Input
        {...register("licensePlate", { required: "La placa del vehículo es requerida" })}
        value={formData.licensePlate}
        onChange={handleChange}
        name="licensePlate"
      />
    </FormField>
  </>
));

export const VehicleConditionFields = React.memo(({ control, errors, register }) => (
  <>
    <FormField label="Condición del Vehículo" error={errors.vehicleCondition}>
      <Stack spacing={2}>
        <Controller
          name="inNeutral"
          control={control}
          render={({ field }) => (
            <Checkbox {...field}>Se puede poner en neutral</Checkbox>
          )}
        />
        <Controller
          name="engineStarts"
          control={control}
          render={({ field }) => (
            <Checkbox {...field}>El motor enciende</Checkbox>
          )}
        />
        <Controller
          name="wheelsSteer"
          control={control}
          render={({ field }) => (
            <Checkbox {...field}>Las ruedas giran</Checkbox>
          )}
        />
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
  <FormField label="Método de Pago" error={errors.paymentMethod}>
    <Select
      {...register("paymentMethod", { required: "El método de pago es requerido" })}
      value={formData.paymentMethod}
      onChange={handleChange}
      name="paymentMethod"
    >
      <option value="">Seleccione un método de pago</option>
      <option value="card">Tarjeta de Crédito/Débito</option>
      <option value="paypal">PayPal</option>
    </Select>
  </FormField>
));