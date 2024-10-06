import React, { useState, useCallback, useEffect } from 'react';
import { Box } from '@chakra-ui/react';
import { GoogleMap, useJsApiLoader, DirectionsRenderer, Marker } from '@react-google-maps/api';
import { calculateTotalCost, getTowTruckType } from '../../utils/towTruckSelection';

const libraries = ['places'];

const GoogleMapsRoute = ({ setPickupAddress, setDropOffAddress, setDistance, setTotalCost, vehicleSize, onError }) => {
  const [pickup, setPickup] = useState(null);
  const [destination, setDestination] = useState(null);
  const [directions, setDirections] = useState(null);
  const [map, setMap] = useState(null);
  const companyLocation = { lat: 26.509672, lng: -100.0095504 }; // Example company location

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  useEffect(() => {
    if (loadError) {
      onError();
    }
  }, [loadError, onError]);

  const calculateRouteDistance = useCallback((result) => {
    if (result.routes.length === 0) return 0;
    let totalDistance = 0;
    result.routes[0].legs.forEach(leg => {
      totalDistance += leg.distance.value;
    });
    return totalDistance / 1000; // Convert meters to kilometers
  }, []);

  const handleMapClick = useCallback(async (event) => {
    const clickedLocation = event.latLng.toJSON();

    if (!pickup) {
      setPickup(clickedLocation);
      const address = await getAddressFromLatLng(clickedLocation);
      setPickupAddress(address);
    } else if (!destination) {
      setDestination(clickedLocation);
      const address = await getAddressFromLatLng(clickedLocation);
      setDropOffAddress(address);
    }
  }, [pickup, destination, setPickupAddress, setDropOffAddress]);

  const updateRouteAndCost = useCallback(() => {
    if (map && pickup && destination) {
      const directionsService = new window.google.maps.DirectionsService();

      directionsService.route(
        {
          origin: pickup,
          destination: destination,
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === 'OK') {
            setDirections(result);
            const totalDistance = calculateRouteDistance(result);
            setDistance(totalDistance);
            const towTruckType = getTowTruckType(vehicleSize);
            const cost = calculateTotalCost(totalDistance, towTruckType);
            setTotalCost(cost);
          } else {
            console.error('Directions request failed:', status);
          }
        }
      );
    }
  }, [map, pickup, destination, calculateRouteDistance, setDistance, setTotalCost, vehicleSize]);

  useEffect(() => {
    updateRouteAndCost();
  }, [updateRouteAndCost]);

  if (loadError) {
    return null; // The error will be handled by the parent component
  }

  if (!isLoaded) {
    return <Box>Loading map...</Box>;
  }

  return (
    <Box position="absolute" top="0" left="0" height="100%" width="100%">
      <GoogleMap
        mapContainerStyle={{ height: "100%", width: "100%" }}
        center={companyLocation}
        zoom={10}
        onClick={handleMapClick}
        onLoad={setMap}
      >
        {pickup && <Marker position={pickup} label="Pickup" />}
        {destination && <Marker position={destination} label="Destination" />}
        <Marker position={companyLocation} label="Company" />
        {directions && (
          <DirectionsRenderer
            options={{
              directions: directions,
            }}
          />
        )}
      </GoogleMap>
    </Box>
  );
};

export default GoogleMapsRoute;
