import React, { useState, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Box, useToast } from '@chakra-ui/react';
import { calculateTotalCost, getTowTruckType } from '../../utils/towTruckSelection';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapRoute = ({ setPickupAddress, setDropOffAddress, setDistance, setTotalCost, vehicleSize, onError }) => {
  const [pickup, setPickup] = useState(null);
  const [destination, setDestination] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const companyLocation = [26.509672, -100.0095504];
  const toast = useToast();

  const MapEvents = () => {
    useMapEvents({
      click: handleMapClick,
    });
    return null;
  };

  const handleMapClick = useCallback(async (e) => {
    try {
      const { lat, lng } = e.latlng;
      if (!pickup) {
        setPickup([lat, lng]);
        const address = await getAddressFromLatLng(lat, lng);
        setPickupAddress(address);
      } else if (!destination) {
        setDestination([lat, lng]);
        const address = await getAddressFromLatLng(lat, lng);
        setDropOffAddress(address);
      } else {
        // Allow repositioning of existing markers
        const pickupDist = L.latLng(pickup).distanceTo([lat, lng]);
        const destDist = L.latLng(destination).distanceTo([lat, lng]);
        if (pickupDist < destDist) {
          setPickup([lat, lng]);
          const address = await getAddressFromLatLng(lat, lng);
          setPickupAddress(address);
        } else {
          setDestination([lat, lng]);
          const address = await getAddressFromLatLng(lat, lng);
          setDropOffAddress(address);
        }
      }
      toast({
        title: 'Marker placed',
        description: 'Location marker has been updated.',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error handling map click:', error);
      toast({
        title: 'Error',
        description: 'Failed to process map click. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  }, [pickup, destination, setPickupAddress, setDropOffAddress, toast]);

  const getAddressFromLatLng = async (lat, lng) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
      if (!response.ok) throw new Error('Failed to fetch address');
      const data = await response.json();
      return data.display_name;
    } catch (error) {
      console.error('Error getting address:', error);
      toast({
        title: 'Address Error',
        description: 'Failed to get address. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return '';
    }
  };

  const handleMarkerDrag = useCallback(async (e, isPickup) => {
    try {
      const { lat, lng } = e.target.getLatLng();
      const address = await getAddressFromLatLng(lat, lng);
      if (isPickup) {
        setPickup([lat, lng]);
        setPickupAddress(address);
      } else {
        setDestination([lat, lng]);
        setDropOffAddress(address);
      }
      toast({
        title: 'Marker moved',
        description: `${isPickup ? 'Pickup' : 'Destination'} location updated.`,
        status: 'info',
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error handling marker drag:', error);
      toast({
        title: 'Error',
        description: 'Failed to update marker position. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  }, [setPickupAddress, setDropOffAddress, toast]);

  useEffect(() => {
    if (pickup && destination) {
      const calculateRoute = async () => {
        try {
          const response = await fetch(`https://router.project-osrm.org/route/v1/driving/${pickup[1]},${pickup[0]};${destination[1]},${destination[0]}?overview=false`);
          if (!response.ok) throw new Error('Failed to calculate route');
          const data = await response.json();
          if (data.routes && data.routes.length > 0) {
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
            title: 'Route Error',
            description: 'Failed to calculate route. Please try again.',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
        }
      };
      calculateRoute();
    }
  }, [pickup, destination, setDistance, setTotalCost, vehicleSize, toast]);

  return (
    <Box position="absolute" top="0" left="0" height="100%" width="100%">
      <MapContainer 
        center={companyLocation} 
        zoom={10} 
        style={{ height: "100%", width: "100%" }}
        whenCreated={() => setMapLoaded(true)}
        whenReady={() => setMapLoaded(true)}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {mapLoaded && <MapEvents />}
        <Marker position={companyLocation}><Popup>Company Location</Popup></Marker>
        {pickup && (
          <Marker 
            position={pickup} 
            draggable={true} 
            eventHandlers={{ dragend: (e) => handleMarkerDrag(e, true) }}
          >
            <Popup>Pickup Location</Popup>
          </Marker>
        )}
        {destination && (
          <Marker 
            position={destination} 
            draggable={true} 
            eventHandlers={{ dragend: (e) => handleMarkerDrag(e, false) }}
          >
            <Popup>Drop-off Location</Popup>
          </Marker>
        )}
      </MapContainer>
    </Box>
  );
};

export default MapRoute;