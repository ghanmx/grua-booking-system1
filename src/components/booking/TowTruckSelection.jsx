import React from 'react';
import { Box, VStack, Text, Image, Button } from "@chakra-ui/react";
import { towTruckTypes } from '../../utils/towTruckSelection';

const TowTruckOption = ({ type, description, basePrice, perKm, maneuverCharge, image, onSelect, isAvailable }) => (
  <Box 
    borderWidth="1px" 
    borderRadius="lg" 
    p={4} 
    mb={4} 
    opacity={isAvailable ? 1 : 0.5}
  >
    <VStack align="start" spacing={2}>
      <Image src={image} alt={type} boxSize="200px" objectFit="cover" />
      <Text fontWeight="bold">{type}</Text>
      <Text fontSize="sm">{description}</Text>
      <Text fontWeight="bold">Precio base: ${basePrice.toFixed(2)}</Text>
      <Text fontWeight="bold">Precio por km: ${perKm.toFixed(2)}</Text>
      <Text fontWeight="bold">Cargo por maniobra: ${maneuverCharge.toFixed(2)}</Text>
      <Button 
        onClick={() => onSelect(type)} 
        colorScheme="blue" 
        size="sm"
        isDisabled={!isAvailable}
      >
        Seleccionar
      </Button>
    </VStack>
  </Box>
);

const TowTruckSelection = ({ onSelect, selectedVehicleSize }) => {
  const towTrucks = [
    {
      type: "Grúa de Plataforma (Tipo A)",
      description: "Para vehículos pequeños y medianos",
      image: "/images/tow-truck-type-a.png",
      forVehicleSize: "small",
      ...towTruckTypes.A
    },
    {
      type: "Grúa de Plataforma (Tipo C)",
      description: "Para vehículos grandes y SUVs",
      image: "/images/tow-truck-type-c.png",
      forVehicleSize: "medium",
      ...towTruckTypes.C
    },
    {
      type: "Grúa para Camiones Pesados (Tipo D)",
      description: "Para camiones y vehículos muy pesados",
      image: "/images/heavy-duty-tow-truck.png",
      forVehicleSize: "large",
      ...towTruckTypes.D
    }
  ];

  return (
    <Box>
      <Text fontSize="xl" fontWeight="bold" mb={4}>Elige un tipo de grúa</Text>
      {towTrucks.map((truck, index) => (
        <TowTruckOption
          key={index}
          {...truck}
          onSelect={onSelect}
          isAvailable={!selectedVehicleSize || truck.forVehicleSize === selectedVehicleSize}
        />
      ))}
    </Box>
  );
};

export default TowTruckSelection;