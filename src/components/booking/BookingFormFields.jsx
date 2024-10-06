import React from 'react';
import { FormControl, FormLabel, Input, Select, Textarea, Radio, RadioGroup, Stack, FormErrorMessage, Checkbox } from "@chakra-ui/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Controller } from "react-hook-form";
import { FormField, SelectField, InputField, DateTimeField } from './FormComponents';
import { VehicleConditionField, VehiclePositionField } from './VehicleFields';

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
  userName: (props) => <InputField label="Nombre" name="userName" {...props} />,
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
      options={props.vehicleBrands ? props.vehicleBrands.map(brand => ({ value: brand, label: brand })) : []}
      {...props}
    />
  ),
  vehicleModel: (props) => (
    <SelectField
      label="Modelo del Vehículo"
      name="vehicleModel"
      options={props.vehicleModels && props.formData.vehicleBrand
        ? (props.vehicleModels[props.formData.vehicleBrand] || []).map(model => ({ value: model, label: model }))
        : []
      }
      {...props}
    />
  ),
  vehicleColor: (props) => <InputField label="Color del Vehículo" name="vehicleColor" {...props} />,
  licensePlate: (props) => <InputField label="Placa del Vehículo" name="licensePlate" {...props} />,
  vehicleCondition: VehicleConditionField,
  vehiclePosition: VehiclePositionField,
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
  pickupDateTime: DateTimeField,
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