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

  const calculateRouteDistance = async (origin, destination) => {
    const service = new window.google.maps.DistanceMatrixService();
    try {
      const response = await service.getDistanceMatrix({
        origins: [origin],
        destinations: [destination],
        travelMode: 'DRIVING',
        unitSystem: window.google.maps.UnitSystem.METRIC,
      });
      return response.rows[0].elements[0].distance.value / 1000; // Convert meters to kilometers
    } catch (error) {
      console.error('Error calculating route distance:', error);
      return 0;
    }
  };

  const handleMapClick = useCallback(async (event) => {
    const clickedLocation = event.latLng.toJSON();
    if (!pickup) {
      setPickup(clickedLocation);
    } else if (!destination) {
      setDestination(clickedLocation);
      
      try {
        const distanceToPickup = await calculateRouteDistance(companyLocation, clickedLocation);
        const pickupToDestinationDistance = await calculateRouteDistance(pickup, clickedLocation);
        const distanceFromDestination = await calculateRouteDistance(clickedLocation, companyLocation);

        const totalDistance = distanceToPickup + pickupToDestinationDistance + distanceFromDestination;
        setDistance(totalDistance);

        const price = calculateTotalCost(totalDistance, selectedTowTruck);
        setTotalPrice(price);
        setTotalCost(price);

        setIsConfirmationOpen(true);
      } catch (error) {
        console.error('Error calculating total distance:', error);
      }
    }
  }, [pickup, setDistance, setTotalCost, selectedTowTruck]);

  return (
    <Box height="400px" width="100%" my={4}>
      <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY} libraries={["places"]}>
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
