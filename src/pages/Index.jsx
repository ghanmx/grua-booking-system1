import React from 'react';
import { Box, Container, Heading, Text, Button, VStack, HStack, Image, Flex } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { FaPhone, FaWhatsapp } from "react-icons/fa";

const Index = () => {
  const navigate = useNavigate();

  const handleBookNow = () => {
    navigate("/booking");
  };

  return (
    <Box bg="gray.100" minHeight="100vh">
      <Container maxW="container.xl" py={10}>
        <VStack spacing={8} align="stretch">
          <Box
            className="wow fadeIn"
            visibility="visible"
            animation="fadeIn"
            data-wow-delay="0.5s"
          >
            <Image src="/mr-gruas-highway.jpg" alt="M.R. Gruas" w="100%" />
          </Box>

          <Flex direction={{ base: "column", md: "row" }} align="center" justify="space-between">
            <Image src="/mr-gruas-logo.png" alt="Mr Gruas Logo" maxW="200px" mb={{ base: 4, md: 0 }} />
            <HStack spacing={4}>
              <Button leftIcon={<FaPhone />} colorScheme="blue" variant="outline">
                Llamar
              </Button>
              <Button leftIcon={<FaWhatsapp />} colorScheme="green" variant="solid">
                WhatsApp
              </Button>
            </HStack>
          </Flex>

          <Box textAlign="center" py={10}>
            <Heading as="h1" size="2xl" mb={4}>
              Servicio de Grúas 24/7
            </Heading>
            <Text fontSize="xl" mb={6}>
              Asistencia rápida y confiable en todo momento
            </Text>
            <Button colorScheme="red" size="lg" onClick={handleBookNow}>
              Solicitar Grúa Ahora
            </Button>
          </Box>

          <Flex direction={{ base: "column", md: "row" }} justify="space-between" align="center">
            <Box flex={1} mr={{ base: 0, md: 8 }} mb={{ base: 8, md: 0 }}>
              <Image src="/tow-truck.jpg" alt="Tow Truck" borderRadius="md" />
            </Box>
            <VStack flex={1} align="start" spacing={4}>
              <Heading as="h2" size="xl">
                ¿Por qué elegirnos?
              </Heading>
              <Text>
                • Servicio rápido y eficiente<br />
                • Cobertura en toda la ciudad<br />
                • Equipo profesional y amable<br />
                • Precios competitivos<br />
                • Disponibilidad 24/7
              </Text>
              <Button colorScheme="blue" size="lg" onClick={handleBookNow}>
                Reservar Ahora
              </Button>
            </VStack>
          </Flex>
        </VStack>
      </Container>
    </Box>
  );
};

export default Index;