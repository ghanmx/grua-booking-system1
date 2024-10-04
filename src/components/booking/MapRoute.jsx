import React, { useState, useCallback, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Box } from '@chakra-ui/react';
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

const MapRoute = ({ setPickupAddress, setDropOffAddress, setDistance, setTotalCost, vehicleSize }) => {
  const [pickup, setPickup] = useState(null);
  const [destination, setDestination] = useState(null);
  const [route, setRoute] = useState(null);
  const companyLocation = [26.509672, -100.0095504]; // Company location coordinates

  const MapEvents = () => {
    const map = useMapEvents({
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
    } else {
      // Allow changing existing markers
      const distanceToPickup = L.latLng(pickup).distanceTo([lat, lng]);
      const distanceToDestination = L.latLng(destination).distanceTo([lat, lng]);
      
      if (distanceToPickup < distanceToDestination) {
        setPickup([lat, lng]);
        const address = await getAddressFromLatLng(lat, lng);
        setPickupAddress(address);
      } else {
        setDestination([lat, lng]);
        const address = await getAddressFromLatLng(lat, lng);
        setDropOffAddress(address);
      }
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

  const calculateRoute = useCallback(async () => {
    if (pickup && destination) {
      try {
        const fullRoute = `${companyLocation[1]},${companyLocation[0]};${pickup[1]},${pickup[0]};${destination[1]},${destination[0]};${companyLocation[1]},${companyLocation[0]}`;
        const response = await fetch(`https://router.project-osrm.org/route/v1/driving/${fullRoute}?overview=full&geometries=geojson`);
        const data = await response.json();
        if (data.routes && data.routes.length > 0) {
          setRoute(data.routes[0].geometry.coordinates);
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
    }
  }, [pickup, destination, setDistance, setTotalCost, vehicleSize, companyLocation]);

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
  }, [setPickupAddress, setDropOffAddress]);

  return (
    <Box position="absolute" top="0" left="0" height="100%" width="100%">
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
        {route && <Polyline positions={route.map(coord => [coord[1], coord[0]])} color="blue" />}
      </MapContainer>
    </Box>
  );
};

export default MapRoute;
