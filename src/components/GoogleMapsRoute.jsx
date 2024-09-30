import React, { useState, useCallback, useEffect } from 'react';
import { Box } from '@chakra-ui/react';
import { GoogleMap, useJsApiLoader, DirectionsService, DirectionsRenderer } from '@react-google-maps/api';
import { getTowTruckPricing, calculateTotalCost } from '../utils/towTruckSelection';

const libraries = ['places', 'marker'];

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
    if (result.status === 'OK') {
      setDirections(result);
      const totalDistance = calculateRouteDistance(result);
      setDistance(totalDistance);
      const price = calculateTotalCost(totalDistance, selectedTowTruck);
      setTotalCost(price);
    }
  }, [calculateRouteDistance, setDistance, setTotalCost, selectedTowTruck]);

  const createAdvancedMarker = useCallback((position, label) => {
    if (map && window.google && window.google.maps.marker) {
      const advancedMarkerElement = new window.google.maps.marker.AdvancedMarkerElement({
        position,
        map,
        title: label,
      });
      return advancedMarkerElement;
    }
    return null;
  }, [map]);

  useEffect(() => {
    if (map) {
      if (companyLocation) createAdvancedMarker(companyLocation, 'Company');
      if (pickup) createAdvancedMarker(pickup, 'Pickup');
      if (destination) createAdvancedMarker(destination, 'Destination');
    }
  }, [map, companyLocation, pickup, destination, createAdvancedMarker]);

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
      >
        {pickup && destination && (
          <DirectionsService
            options={{
              destination: destination,
              origin: companyLocation,
              waypoints: [{ location: pickup }],
              travelMode: 'DRIVING',
            }}
            callback={handleDirectionsLoad}
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
    </Box>
  );
};

export default GoogleMapsRoute;