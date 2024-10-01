import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Box } from '@chakra-ui/react';
import { calculateTotalCost, getTowTruckType } from '../utils/towTruckSelection';

// Fix Leaflet's default icon path issues
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const MapRoute = ({ setPickupAddress, setDropOffAddress, setDistance, setTotalCost, vehicleSize }) => {
  const [pickup, setPickup] = useState(null);
  const [destination, setDestination] = useState(null);
  const [manualPickup, setManualPickup] = useState('');
  const [manualDropoff, setManualDropoff] = useState('');

  const MapEvents = () => {
    useMapEvents({
      click(e) {
        handleMapClick(e.latlng);
      },
    });
    return null;
  };

  const handleMapClick = async (latlng) => {
    const clickedLocation = { lat: latlng.lat, lng: latlng.lng };
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
  };

  const getAddressFromLatLng = async (latLng) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latLng.lat}&lon=${latLng.lng}`);
      const data = await response.json();
      return data.display_name;
    } catch (error) {
      console.error('Error getting address:', error);
      return '';
    }
  };

  const handleManualAddressUpdate = async (address, isPickup) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
      const data = await response.json();
      if (data.length > 0) {
        const { lat, lon } = data[0];
        const location = { lat: parseFloat(lat), lng: parseFloat(lon) };
        if (isPickup) {
          setPickup(location);
          setPickupAddress(address);
          setManualPickup(address);
        } else {
          setDestination(location);
          setDropOffAddress(address);
          setManualDropoff(address);
        }
      }
    } catch (error) {
      console.error('Error geocoding address:', error);
    }
  };

  useEffect(() => {
    if (manualPickup) {
      handleManualAddressUpdate(manualPickup, true);
    }
  }, [manualPickup]);

  useEffect(() => {
    if (manualDropoff) {
      handleManualAddressUpdate(manualDropoff, false);
    }
  }, [manualDropoff]);

  useEffect(() => {
    if (pickup && destination) {
      const distance = calculateDistance(pickup, destination);
      setDistance(distance);
      const towTruckType = getTowTruckType(vehicleSize);
      const cost = calculateTotalCost(distance, towTruckType);
      setTotalCost(cost);
    }
  }, [pickup, destination, setDistance, setTotalCost, vehicleSize]);

  const calculateDistance = (point1, point2) => {
    const R = 6371; // Earth's radius in km
    const dLat = (point2.lat - point1.lat) * Math.PI / 180;
    const dLon = (point2.lng - point1.lng) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(point1.lat * Math.PI / 180) * Math.cos(point2.lat * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return distance;
  };

  return (
    <Box position="absolute" top="0" left="0" height="100%" width="100%">
      <MapContainer center={[26.509672, -100.0095504]} zoom={10} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <MapEvents />
        {pickup && (
          <Marker position={[pickup.lat, pickup.lng]}>
            <Popup>Pickup Location</Popup>
          </Marker>
        )}
        {destination && (
          <Marker position={[destination.lat, destination.lng]}>
            <Popup>Drop-off Location</Popup>
          </Marker>
        )}
      </MapContainer>
    </Box>
  );
};

export default MapRoute;