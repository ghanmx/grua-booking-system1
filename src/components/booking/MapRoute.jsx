import React, { useState, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Box } from '@chakra-ui/react';
import { calculateTotalCost, getTowTruckType } from '../../utils/towTruckSelection';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapRoute = ({ setPickupAddress, setDropOffAddress, setDistance, setTotalCost, vehicleSize }) => {
  const [pickup, setPickup] = useState(null);
  const [destination, setDestination] = useState(null);
  const companyLocation = [26.509672, -100.0095504]; // Company location coordinates

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
    } else if (!destination) {
      setDestination([lat, lng]);
      const address = await getAddressFromLatLng(lat, lng);
      setDropOffAddress(address);
    }
  }, [pickup, destination, setPickupAddress, setDropOffAddress]);

  const getAddressFromLatLng = async (lat, lng) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
      const data = await response.json();
      return data.display_name;
    } catch (error) {
      console.error('Error getting address:', error);
      return '';
    }
  };

  useEffect(() => {
    if (pickup && destination) {
      const calculateRoute = async () => {
        try {
          const response = await fetch(`https://router.project-osrm.org/route/v1/driving/${pickup[1]},${pickup[0]};${destination[1]},${destination[0]}?overview=false`);
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
        }
      };
      calculateRoute();
    }
  }, [pickup, destination, setDistance, setTotalCost, vehicleSize]);

  return (
    <Box position="absolute" top="0" left="0" height="100%" width="100%">
      <MapContainer center={companyLocation} zoom={10} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <MapEvents />
        <Marker position={companyLocation}><Popup>Company Location</Popup></Marker>
        {pickup && <Marker position={pickup}><Popup>Pickup Location</Popup></Marker>}
        {destination && <Marker position={destination}><Popup>Drop-off Location</Popup></Marker>}
      </MapContainer>
    </Box>
  );
};

export default MapRoute;