import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Box, Button, FormControl, FormLabel, Heading, Input, Text } from '@chakra-ui/react';
import { GoogleMap, LoadScript, Marker, DirectionsService, DirectionsRenderer } from '@react-google-maps/api';

const GoogleMapsRoute = ({ setDistance }) => {
  const [pickup, setPickup] = useState(null);
  const [destination, setDestination] = useState(null);
  const [error, setError] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [directions, setDirections] = useState(null);
  const [map, setMap] = useState(null);
  const [tollCost, setTollCost] = useState(0);

  const start = { lng: -100.0095504, lat: 26.509672 }; // Punto de inicio fijo
  const pricePerKm = 19;

  useEffect(() => {
    // Obtener la ubicación actual del usuario
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
        } else {
          setError('Error calculating the route: ' + status);
          console.error('Error calculating the route:', status, result);
        }
      }
    );
  };

  const calculatePrice = (distance) => {
    return distance * pricePerKm + 558 + tollCost; // Tarifa base de $558 más $19 por kilómetro más el costo de las casetas
  };

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

  return (
    <Box>
      <Heading as="h1" mb={4}>
        Selecciona recogida y destino
      </Heading>
      {error && <Text color="red.500">Error: {error}</Text>}
      <FormControl mb={4}>
        <FormLabel htmlFor="pickup">Punto de recogida:</FormLabel>
        <Input type="text" id="pickup" value={pickup ? `${pickup.lat}, ${pickup.lng}` : ''} readOnly />
      </FormControl>
      <FormControl mb={4}>
        <FormLabel htmlFor="destination">Destino:</FormLabel>
        <Input type="text" id="destination" value={destination ? `${destination.lat}, ${destination.lng}` : ''} readOnly />
      </FormControl>
      <Button onClick={calculateRoute} colorScheme="blue" disabled={!pickup || !destination}>
        Calcular Ruta
      </Button>
      <Text mt={4} fontSize="xl">
        Precio total: ${totalPrice.toFixed(2)}
      </Text>
      <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY} libraries={['places', 'geometry']}>
        <GoogleMap
          center={start}
          zoom={7}
          maxZoom={20} // Permitir más zoom
          mapContainerStyle={{ height: '400px', width: '100%', marginTop: '20px' }}
          onLoad={(map) => setMap(map)}
          onClick={(event) => {
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
          }}
        >
          {pickup && <Marker position={pickup} draggable={true} onDragEnd={(e) => setPickup(e.latLng.toJSON())} />}
          {destination && <Marker position={destination} draggable={true} onDragEnd={(e) => setDestination(e.latLng.toJSON())} />}
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
    </Box>
  );
};

GoogleMapsRoute.propTypes = {
  setDistance: PropTypes.func.isRequired,
};

export default GoogleMapsRoute;