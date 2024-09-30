import React, { useState, useCallback, useEffect } from 'react';
import { Box } from '@chakra-ui/react';
import { GoogleMap, useJsApiLoader, DirectionsRenderer, Marker } from '@react-google-maps/api';
import { calculateTotalCost, getTowTruckType } from '../utils/towTruckSelection';

const libraries = ['places'];

const GoogleMapsRoute = ({ setPickupAddress, setDropOffAddress, setDistance, setTotalCost, vehicleSize }) => {
  const [pickup, setPickup] = useState(null);
  const [destination, setDestination] = useState(null);
  const [directions, setDirections] = useState(null);
  const [map, setMap] = useState(null);
  const [manualPickup, setManualPickup] = useState('');
  const [manualDropoff, setManualDropoff] = useState('');

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const mapId = import.meta.env.VITE_GOOGLE_MAPS_ID;

  const calculateRouteDistance = useCallback((result) => {
    if (result.routes.length === 0) return 0;
    let totalDistance = 0;
    result.routes[0].legs.forEach(leg => {
      totalDistance += leg.distance.value;
    });
    return totalDistance / 1000; // Convert meters to kilometers
  }, []);

  const getAddressFromLatLng = useCallback(async (latLng) => {
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
  }, []);

  const handleMapClick = useCallback(async (event) => {
    const clickedLocation = event.latLng.toJSON();

    if (!pickup) {
      setPickup(clickedLocation);
      const address = await getAddressFromLatLng(clickedLocation);
      setPickupAddress(address);
      setManualPickup(address);
    } else if (!destination) {
      setDestination(clickedLocation);
      const address = await getAddressFromLatLng(clickedLocation);
      setDropOffAddress(address);
      setManualDropoff(address);
    }
  }, [pickup, destination, setPickupAddress, setDropOffAddress, getAddressFromLatLng]);

  const handleManualAddressUpdate = useCallback(async (address, isPickup) => {
    const geocoder = new window.google.maps.Geocoder();
    try {
      const result = await new Promise((resolve, reject) => {
        geocoder.geocode({ address }, (results, status) => {
          if (status === 'OK') {
            resolve(results[0].geometry.location);
          } else {
            reject(new Error('Geocoding failed'));
          }
        });
      });
      
      if (isPickup) {
        setPickup(result.toJSON());
        setPickupAddress(address);
        setManualPickup(address);
      } else {
        setDestination(result.toJSON());
        setDropOffAddress(address);
        setManualDropoff(address);
      }
    } catch (error) {
      console.error('Error geocoding address:', error);
    }
  }, [setPickupAddress, setDropOffAddress]);

  useEffect(() => {
    if (manualPickup) {
      handleManualAddressUpdate(manualPickup, true);
    }
  }, [manualPickup, handleManualAddressUpdate]);

  useEffect(() => {
    if (manualDropoff) {
      handleManualAddressUpdate(manualDropoff, false);
    }
  }, [manualDropoff, handleManualAddressUpdate]);

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
    return <Box>Error loading maps</Box>;
  }

  if (!isLoaded) {
    return <Box>Loading maps</Box>;
  }

  return (
    <Box position="absolute" top="0" left="0" height="100%" width="100%">
      <GoogleMap
        mapContainerStyle={{ height: "100%", width: "100%" }}
        center={{ lat: 26.509672, lng: -100.0095504 }}
        zoom={10}
        onClick={handleMapClick}
        onLoad={setMap}
        options={{ mapId }}
      >
        {pickup && <Marker position={pickup} label="Pickup" />}
        {destination && <Marker position={destination} label="Destination" />}
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