import React, { useState, useCallback, useEffect } from 'react';
import { Box } from '@chakra-ui/react';
import { GoogleMap, useJsApiLoader, DirectionsService, DirectionsRenderer, Marker } from '@react-google-maps/api';
import { getTowTruckPricing, calculateTotalCost } from '../utils/towTruckSelection';

const libraries = ['places'];

const GoogleMapsRoute = ({ setPickupAddress, setDropOffAddress, setDistance, setTotalCost, selectedTowTruck }) => {
  const [pickup, setPickup] = useState(null);
  const [destination, setDestination] = useState(null);
  const [directions, setDirections] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 26.509672, lng: -100.0095504 });
  const [map, setMap] = useState(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const mapId = import.meta.env.VITE_GOOGLE_MAPS_ID;
  const companyLocation = { lat: 26.509672, lng: -100.0095504 };

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
      setMapCenter(clickedLocation);
      const address = await getAddressFromLatLng(clickedLocation);
      setPickupAddress(address);
    } else if (!destination) {
      setDestination(clickedLocation);
      setMapCenter(clickedLocation);
      const address = await getAddressFromLatLng(clickedLocation);
      setDropOffAddress(address);
    }
  }, [pickup, destination, setPickupAddress, setDropOffAddress, getAddressFromLatLng]);

  const handleDirectionsLoad = useCallback((result) => {
    if (result !== null && result.status === 'OK') {
      setDirections(result);
      const totalDistance = calculateRouteDistance(result);
      setDistance(totalDistance);
      const price = calculateTotalCost(totalDistance, selectedTowTruck);
      setTotalCost(price);
    } else {
      console.error('Directions request failed:', result);
    }
  }, [calculateRouteDistance, setDistance, setTotalCost, selectedTowTruck]);

  useEffect(() => {
    if (map && pickup && destination) {
      const directionsService = new window.google.maps.DirectionsService();
      directionsService.route(
        {
          origin: companyLocation,
          destination: destination,
          waypoints: [{ location: pickup }],
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === 'OK') {
            handleDirectionsLoad(result);
          } else {
            console.error('Directions request failed:', status);
          }
        }
      );
    }
  }, [map, pickup, destination, companyLocation, handleDirectionsLoad]);

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
        center={mapCenter}
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