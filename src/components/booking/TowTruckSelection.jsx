import React from 'react';
import { Box, VStack, Text, Image, Button } from "@chakra-ui/react";

const TowTruckOption = ({ type, description, price, image, onSelect, isAvailable }) => (
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
      {price !== undefined && <Text fontWeight="bold">${price.toFixed(2)}</Text>}
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

const TowTruckSelection = ({ onSelect, selectedVehicleSize, pricesCalculated }) => {
  const towTrucks = [
    {
      type: "Grúa de Plataforma (Tipo A)",
      description: "Para vehículos pequeños y medianos",
      image: "/images/tow-truck-type-a.png",
      forVehicleSize: "small"
    },
    {
      type: "Grúa de Plataforma (Tipo C)",
      description: "Para vehículos grandes y SUVs",
      image: "/images/tow-truck-type-c.png",
      forVehicleSize: "medium"
    },
    {
      type: "Grúa para Camiones Pesados (Tipo D)",
      description: "Para camiones y vehículos muy pesados",
      image: "/images/heavy-duty-tow-truck.png",
      forVehicleSize: "large"
    }
  ];

  return (
    <Box>
      <Text fontSize="xl" fontWeight="bold" mb={4}>Elige un tipo de grúa</Text>
      {towTrucks.map((truck, index) => (
        <TowTruckOption
          key={index}
          {...truck}
          price={pricesCalculated ? truck.price : undefined}
          onSelect={onSelect}
          isAvailable={!selectedVehicleSize || truck.forVehicleSize === selectedVehicleSize}
        />
      ))}
    </Box>
  );
};

export default TowTruckSelection;