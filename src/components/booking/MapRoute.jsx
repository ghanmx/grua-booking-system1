import React, { useState, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Box, useToast } from '@chakra-ui/react';
import { calculateTotalCost, getTowTruckType } from '../../utils/towTruckSelection';

import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});

const MapRoute = ({ setPickupAddress, setDropOffAddress, setDistance, setTotalCost, vehicleSize, onMarkerMove }) => {
  const [pickup, setPickup] = useState(null);
  const [destination, setDestination] = useState(null);
  const [route, setRoute] = useState(null);
  const companyLocation = [26.509672, -100.0095504]; // Company location coordinates
  const toast = useToast();

  const MapEvents = () => {
    useMapEvents({
      click: handleMapClick,
    });
    return null;
  };

  const handleMapClick = useCallback(async (e) => {
    const { lat, lng } = e.latlng;
    if (!pickup) {
      setPickup([lat, lng]);
      const address = await getAddressFromLatLng(lat, lng);
      setPickupAddress(address);
      onMarkerMove(address, destination ? await getAddressFromLatLng(destination[0], destination[1]) : '');
    } else if (!destination) {
      setDestination([lat, lng]);
      const address = await getAddressFromLatLng(lat, lng);
      setDropOffAddress(address);
      onMarkerMove(await getAddressFromLatLng(pickup[0], pickup[1]), address);
    }
  }, [pickup, destination, setPickupAddress, setDropOffAddress, onMarkerMove]);

  const getAddressFromLatLng = async (lat, lng) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
      const data = await response.json();
      return data.display_name;
    } catch (error) {
      console.error('Error getting address:', error);
      toast({
        title: "Error",
        description: "Unable to fetch address. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return '';
    }
  };

  const calculateRoute = useCallback(async () => {
    if (pickup && destination) {
      try {
        const fullRoute = `${companyLocation[1]},${companyLocation[0]};${pickup[1]},${pickup[0]};${destination[1]},${destination[0]};${companyLocation[1]},${companyLocation[0]}`;
        const response = await fetch(`https://router.project-osrm.org/route/v1/driving/${fullRoute}?overview=full&geometries=geojson`);
        const data = await response.json();
        if (data.routes && data.routes.length > 0) {
          setRoute(data.routes[0].geometry.coordinates.map(coord => [coord[1], coord[0]]));
          const distanceInMeters = data.routes[0].distance;
          const distanceInKm = distanceInMeters / 1000;
          setDistance(distanceInKm);
          const towTruckType = getTowTruckType(vehicleSize);
          const cost = calculateTotalCost(distanceInKm, towTruckType);
          setTotalCost(cost);
        }
      } catch (error) {
        console.error('Error calculating route:', error);
        toast({
          title: "Error",
          description: "Unable to calculate route. Please try again.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    }
  }, [pickup, destination, setDistance, setTotalCost, vehicleSize, toast]);

  useEffect(() => {
    calculateRoute();
  }, [calculateRoute]);

  const handleMarkerDragEnd = useCallback(async (e, isPickup) => {
    const { lat, lng } = e.target.getLatLng();
    const newPosition = [lat, lng];
    const address = await getAddressFromLatLng(lat, lng);

    if (isPickup) {
      setPickup(newPosition);
      setPickupAddress(address);
    } else {
      setDestination(newPosition);
      setDropOffAddress(address);
    }
    onMarkerMove(
      isPickup ? address : await getAddressFromLatLng(pickup[0], pickup[1]),
      isPickup ? await getAddressFromLatLng(destination[0], destination[1]) : address
    );
  }, [setPickupAddress, setDropOffAddress, onMarkerMove, pickup, destination]);

  return (
    <Box position="absolute" top="0" left="0" height="100%" width="100%" aria-label="Interactive map for selecting pickup and drop-off locations">
      <MapContainer center={companyLocation} zoom={10} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <MapEvents />
        <Marker position={companyLocation}><Popup>Company Location</Popup></Marker>
        {pickup && (
          <Marker 
            position={pickup} 
            draggable={true}
            eventHandlers={{
              dragend: (e) => handleMarkerDragEnd(e, true)
            }}
          >
            <Popup>Pickup Location</Popup>
          </Marker>
        )}
        {destination && (
          <Marker 
            position={destination} 
            draggable={true}
            eventHandlers={{
              dragend: (e) => handleMarkerDragEnd(e, false)
            }}
          >
            <Popup>Drop-off Location</Popup>
          </Marker>
        )}
        {route && <Polyline positions={route} color="blue" />}
      </MapContainer>
    </Box>
  );
};

export default MapRoute;