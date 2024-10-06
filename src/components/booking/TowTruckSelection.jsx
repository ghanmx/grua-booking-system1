import React from 'react';
import { Box, VStack, Text, Image, Button } from "@chakra-ui/react";

const TowTruckOption = ({ type, description, price, eta, onSelect }) => (
  <Box borderWidth="1px" borderRadius="lg" p={4} mb={4}>
    <VStack align="start" spacing={2}>
      <Text fontWeight="bold">{type}</Text>
      <Text fontSize="sm">{description}</Text>
      <Text>{eta}</Text>
      <Text fontWeight="bold">${price.toFixed(2)}</Text>
      <Button onClick={() => onSelect(type)} colorScheme="blue" size="sm">
        Seleccionar
      </Button>
    </VStack>
  </Box>
);

const TowTruckSelection = ({ onSelect }) => {
  const towTrucks = [
    {
      type: "Grúa de Plataforma",
      description: "Para vehículos pequeños y medianos",
      price: 79.98,
      eta: "Llegada en 22 minutos",
      image: "/images/flatbed-tow-truck.png"
    },
    {
      type: "Grúa de Plataforma (Grande)",
      description: "Para vehículos grandes y SUVs",
      price: 106.45,
      eta: "Llegada en 25 minutos",
      image: "/images/large-flatbed-tow-truck.png"
    },
    {
      type: "Grúa para Camiones Pesados",
      description: "Para camiones y vehículos muy pesados",
      price: 149.60,
      eta: "Llegada en 30 minutos",
      image: "/images/heavy-duty-tow-truck.png"
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
        />
      ))}
    </Box>
  );
};

export default TowTruckSelection;