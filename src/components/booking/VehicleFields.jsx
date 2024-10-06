import React from 'react';
import { Stack, Checkbox, Radio, RadioGroup } from "@chakra-ui/react";
import { Controller } from "react-hook-form";
import { FormField } from './FormComponents';

export const VehicleConditionField = ({ control, errors }) => (
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
);

export const VehiclePositionField = ({ control, errors }) => (
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
);