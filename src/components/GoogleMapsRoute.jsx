import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Box, Button, FormControl, FormLabel, Heading, Input, Text, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton } from '@chakra-ui/react';
import { GoogleMap, LoadScript, Marker, DirectionsService, DirectionsRenderer } from '@react-google-maps/api';

const GoogleMapsRoute = ({ setDistance }) => {
  const [pickup, setPickup] = useState(null);
  const [destination, setDestination] = useState(null);
  const [error, setError] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [directions, setDirections] = useState(null);
  const [map, setMap] = useState(null);
  const [tollCost, setTollCost] = useState(0);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

  const start = { lng: -100.0095504, lat: 26.509672 }; // Punto de inicio fijo
  const pricePerKm = 19;

  const pickupIcon = {
    url: 'http://labs.google.com/ridefinder/images/mm_20_blue.png',
    scaledSize: new window.google.maps.Size(40, 40), // Size of the icon
  };

  const destinationIcon = {
    url: 'http://labs.google.com/ridefinder/images/mm_20_yellow.png',
    scaledSize: new window.google.maps.Size(40, 40), // Size of the icon
  };

  // Efecto para obtener la ubicación actual del usuario al cargar el mapa
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setPickup(userLocation);
          if (map) {
            map.panTo(userLocation);
          }
        },
        (error) => {
          console.error('Error getting user location:', error);
          setError('Error getting user location: ' + error.message);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
      setError('Geolocation is not supported by this browser.');
    }
  }, [map]);

  useEffect(() => {
    console.log('Pickup location changed:', pickup);
  }, [pickup]);

  useEffect(() => {
    console.log('Destination location changed:', destination);
  }, [destination]);

  useEffect(() => {
    console.log('Directions changed:', directions);
  }, [directions]);

  // Función para calcular la ruta desde start hasta destination a través de pickup
  const calculateRoute = () => {
    setError(null);
    if (!pickup || !destination) {
      setError('Please fill in all required fields.');
      return;
    }

    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route(
      {
        origin: start,
        destination: destination,
        travelMode: window.google.maps.TravelMode.DRIVING,
        waypoints: [
          { location: pickup, stopover: true }
        ],
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          setDirections(result);
          const legs = result.routes[0].legs;
          const distanceToDestination = legs.reduce((total, leg) => total + leg.distance.value, 0) / 1000; // Distancia en kilómetros
          setDistance(distanceToDestination);
          const price = calculatePrice(distanceToDestination);
          setTotalPrice(price);
          fetchTollData(start, destination);
          setIsConfirmationOpen(true);
        } else {
          setError('Error calculating the route: ' + status);
          console.error('Error calculating the route:', status, result);
        }
      }
    );
  };

  // Función para calcular el precio total estimado
  const calculatePrice = (distance) => {
    return distance * pricePerKm + 558 + tollCost; // Tarifa base de $558 más $19 por kilómetro más el costo de las casetas
  };

  // Función para obtener el costo de las casetas utilizando la API de TollGuru
  const fetchTollData = async (origin, destination) => {
    try {
      const response = await fetch(`https://api.tollguru.com/v1/calc/route?source=${origin.lat},${origin.lng}&destination=${destination.lat},${destination.lng}`, {
        headers: {
          'x-api-key': process.env.REACT_APP_TOLLGURU_API_KEY,
        },
      });
      const data = await response.json();
      const tolls = data.tollCosts || 0;
      setTollCost(tolls);
    } catch (error) {
      console.error('Error fetching toll data:', error);
      setError('Error fetching toll data: ' + error.message);
    }
  };

  // Función para manejar la confirmación y reserva
  const handleBooking = () => {
    // Implementar integración de pasarela de pago aquí
    // Manejar transacción de pago y escenarios de error
    // Por ahora, solo cerrar el modal de confirmación
    setIsConfirmationOpen(false);
  };

  const handleMapClick = (event) => {
    try {
      if (!pickup) {
        setPickup(event.latLng.toJSON());
      } else if (!destination) {
        setDestination(event.latLng.toJSON());
      }
    } catch (err) {
      setError('Error setting location: ' + err.message);
      console.error('Error setting location:', err);
    }
  };

  return (
    <Box>
      <Heading as="h1" mb={4}>
        Selecciona recogida y destino
      </Heading>
      {error && <Text color="red.500">Error: {error}</Text>}
      <FormControl mb={4}>
        <FormLabel htmlFor="pickup">Punto de recogida:</FormLabel>
        <Input type="text" id="pickup" value={pickup ? `${pickup.lat}, ${pickup.lng}` : ''} readOnly autoComplete="off" />
      </FormControl>
      <FormControl mb={4}>
        <FormLabel htmlFor="destination">Destino:</FormLabel>
        <Input type="text" id="destination" value={destination ? `${destination.lat}, ${destination.lng}` : ''} readOnly autoComplete="off" />
      </FormControl>
      <Button onClick={calculateRoute} colorScheme="blue" disabled={!pickup || !destination}>
        Calcular Ruta
      </Button>
      <Text mt={4} fontSize="xl">
        Precio total: ${totalPrice.toFixed(2)}
      </Text>
      <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY} libraries={['places', 'geometry']} loadingElement={<div>Loading...</div>} async defer>
        <GoogleMap
          center={start}
          zoom={7}
          maxZoom={20} // Permitir más zoom
          mapContainerStyle={{ height: '400px', width: '100%', marginTop: '20px' }}
          onLoad={(map) => setMap(map)}
          onClick={handleMapClick}
        >
          {pickup && (
            <Marker
              position={pickup}
              draggable={true}
              icon={pickupIcon}
              onDragEnd={(e) => setPickup(e.latLng.toJSON())}
            />
          )}
          {destination && (
            <Marker
              position={destination}
              draggable={true}
              icon={destinationIcon}
              onDragEnd={(e) => setDestination(e.latLng.toJSON())}
            />
          )}
          {pickup && destination && (
            <DirectionsService
              options={{
                origin: start,
                destination: destination,
                travelMode: window.google.maps.TravelMode.DRIVING,
                waypoints: [
                  { location: pickup, stopover: true }
                ],
              }}
              callback={(response, status) => {
                if (status === window.google.maps.DirectionsStatus.OK) {
                  setDirections(response);
                } else {
                  setError('Error fetching directions: ' + status);
                  console.error('Error fetching directions:', status, response);
                }
              }}
            />
          )}
          {directions && (
            <DirectionsRenderer
              options={{
                directions: directions,
              }}
            />
          )}
        </GoogleMap>
      </LoadScript>

      {/* Modal de confirmación */}
      <Modal isOpen={isConfirmationOpen} onClose={() => setIsConfirmationOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirmar Ruta</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Recogida: {pickup ? `${pickup.lat}, ${pickup.lng}` : ''}</Text>
            <Text>Destino: {destination ? `${destination.lat}, ${destination.lng}` : ''}</Text>
            <Text>Precio total estimado: ${totalPrice.toFixed(2)}</Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleBooking}>
              Confirmar y Reservar
            </Button>
            <Button variant="ghost" onClick={() => setIsConfirmationOpen(false)}>Cancelar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

GoogleMapsRoute.propTypes = {
  setDistance: PropTypes.func.isRequired,
};

export default GoogleMapsRoute;