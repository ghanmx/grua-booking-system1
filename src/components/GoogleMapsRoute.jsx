import React, { useState, useCallback } from 'react';
import { Box, Button, Text, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton } from '@chakra-ui/react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { getTowTruckPricing, calculateTotalCost } from '../utils/towTruckSelection';

const GoogleMapsRoute = ({ setDistance, setTotalCost, selectedTowTruck }) => {
  const [pickup, setPickup] = useState(null);
  const [destination, setDestination] = useState(null);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);

  const companyLocation = { lat: 26.509672, lng: -100.0095504 };

  const calculateRouteDistance = (origin, destination) => {
    const R = 6371; // Earth's radius in km
    const dLat = (destination.lat - origin.lat) * Math.PI / 180;
    const dLon = (destination.lng - origin.lng) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(origin.lat * Math.PI / 180) * Math.cos(destination.lat * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return distance;
  };

  const handleMapClick = useCallback((event) => {
    const clickedLocation = event.latLng.toJSON();
    if (!pickup) {
      setPickup(clickedLocation);
    } else if (!destination) {
      setDestination(clickedLocation);
      
      const distanceToPickup = calculateRouteDistance(companyLocation, clickedLocation);
      const pickupToDestinationDistance = calculateRouteDistance(pickup, clickedLocation);
      const distanceFromDestination = calculateRouteDistance(clickedLocation, companyLocation);

      const totalDistance = distanceToPickup + pickupToDestinationDistance + distanceFromDestination;
      setDistance(totalDistance);

      const price = calculateTotalCost(totalDistance, selectedTowTruck);
      setTotalPrice(price);
      setTotalCost(price);

      setIsConfirmationOpen(true);
    }
  }, [pickup, setDistance, setTotalCost, selectedTowTruck]);

  return (
    <Box height="400px" width="100%" my={4}>
      <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
        <GoogleMap
          mapContainerStyle={{ height: "100%", width: "100%" }}
          center={companyLocation}
          zoom={10}
          onClick={handleMapClick}
        >
          {pickup && <Marker position={pickup} />}
          {destination && <Marker position={destination} />}
        </GoogleMap>
      </LoadScript>

      <Modal isOpen={isConfirmationOpen} onClose={() => setIsConfirmationOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Route</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Total estimated price: ${totalPrice.toFixed(2)}</Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={() => setIsConfirmationOpen(false)}>
              Confirm
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default GoogleMapsRoute;
