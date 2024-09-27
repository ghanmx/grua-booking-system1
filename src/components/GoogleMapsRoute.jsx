import React, { useState, useCallback } from 'react';
import { Box, Button, Text, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton } from '@chakra-ui/react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { getTowTruckPricing, calculateTotalCost } from '../utils/towTruckSelection';

const GoogleMapsRoute = ({ setPickupAddress, setDropOffAddress, setDistance, setTotalCost, selectedTowTruck }) => {
  const [pickup, setPickup] = useState(null);
  const [destination, setDestination] = useState(null);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [mapCenter, setMapCenter] = useState({ lat: 26.509672, lng: -100.0095504 });

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

  const getAddressFromLatLng = async (latLng) => {
    const geocoder = new window.google.maps.Geocoder();
    try {
      const result = await new Promise((resolve, reject) => {
        geocoder.geocode({ location: latLng }, (results, status) => {
          if (status === 'OK') {
            resolve(results[0].formatted_address);
          } else {
            reject(new Error('Geocoding failed'));
          }
        });
      });
      return result;
    } catch (error) {
      console.error('Error getting address:', error);
      return '';
    }
  };

  const handleMapClick = useCallback(async (event) => {
    const clickedLocation = event.latLng.toJSON();

    if (!pickup) {
      setPickup(clickedLocation);
      setMapCenter(clickedLocation);
      const address = await getAddressFromLatLng(clickedLocation);
      setPickupAddress(address);
    } else if (!destination) {
      setDestination(clickedLocation);
      setMapCenter(clickedLocation);
      const address = await getAddressFromLatLng(clickedLocation);
      setDropOffAddress(address);

      try {
        const distanceToPickup = await calculateRouteDistance(companyLocation, pickup);
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
  }, [pickup, destination, setPickupAddress, setDropOffAddress, setDistance, setTotalCost, selectedTowTruck]);

  const handleConfirmation = () => {
    setIsConfirmationOpen(false);
    // Optionally reset pickup and destination if needed for new selection.
    // setPickup(null);
    // setDestination(null);
  };

  return (
    <Box height={{ base: "300px", md: "400px" }} width="100%" my={4}>
      <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY} libraries={["places"]}>
        <GoogleMap
          mapContainerStyle={{ height: "100%", width: "100%" }}
          center={mapCenter}
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
            <Button colorScheme="blue" onClick={handleConfirmation}>
              Confirm
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default GoogleMapsRoute;
