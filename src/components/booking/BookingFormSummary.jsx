import React from 'react';
import { Text } from "@chakra-ui/react";

export const BookingFormSummary = ({ distance, totalCost }) => {
  return (
    <>
      {distance > 0 && (
        <>
          <Text mt={4} fontWeight="bold">Distance: {distance.toFixed(2)} km</Text>
          <Text mt={2} fontWeight="bold">Estimated cost: ${totalCost.toFixed(2)}</Text>
        </>
      )}
    </>
  );
};