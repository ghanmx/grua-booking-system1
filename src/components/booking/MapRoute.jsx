import React, { useState, useCallback, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Box } from '@chakra-ui/react';
import { calculateTotalCost, getTowTruckType } from '../../utils/towTruckSelection';
import axios from 'axios';
import axiosRetry from 'axios-retry';

import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});

axiosRetry(axios, {
  retries: 3,
  retryDelay: (retryCount) => retryCount * 1000,
  retryCondition: (error) => error.response?.status === 429,
});

const companyLocation = [26.509672, -100.0095504];

const MapEvents = ({ onMapClick }) => {
  useMapEvents({ click: onMapClick });
  return null;
};

const RoutePolyline = ({ route }) => {
  const map = useMap();
  
  useEffect(() => {
    if (route) {
      const bounds = L.latLngBounds(route.map(coord => [coord[1], coord[0]]));
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [route, map]);

  return route ? <Polyline positions={route.map(coord => [coord[1], coord[0]])} color="blue" /> : null;
};

const MapRoute = ({ setPickupAddress, setDropOffAddress, setDistance, setTotalCost, vehicleSize }) => {
  const [pickup, setPickup] = useState(null);
  const [destination, setDestination] = useState(null);
  const [route, setRoute] = useState(null);
  const mapRef = useRef(null);

  const getAddressFromLatLng = async (lat, lng) => {
    try {
      const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
      return response.data.display_name;
    } catch (error) {
      console.error('Error getting address:', error);
      return '';
    }
  };

  const handleMapClick = useCallback(async (e) => {
    const { lat, lng } = e.latlng;
    const newPosition = [lat, lng];
    const address = await getAddressFromLatLng(lat, lng);

    if (!pickup) {
      setPickup(newPosition);
      setPickupAddress(address);
    } else if (!destination) {
      setDestination(newPosition);
      setDropOffAddress(address);
    } else {
      const distanceToPickup = L.latLng(pickup).distanceTo(newPosition);
      const distanceToDestination = L.latLng(destination).distanceTo(newPosition);
      
      if (distanceToPickup < distanceToDestination) {
        setPickup(newPosition);
        setPickupAddress(address);
      } else {
        setDestination(newPosition);
        setDropOffAddress(address);
      }
    }
  }, [pickup, destination, setPickupAddress, setDropOffAddress]);

  const calculateRoute = useCallback(async () => {
    if (pickup && destination) {
      try {
        const fullRoute = `${companyLocation[1]},${companyLocation[0]};${pickup[1]},${pickup[0]};${destination[1]},${destination[0]};${companyLocation[1]},${companyLocation[0]}`;
        const response = await axios.get(`https://router.project-osrm.org/route/v1/driving/${fullRoute}?overview=full&geometries=geojson`);
        const data = response.data;
        if (data.routes && data.routes.length > 0) {
          setRoute(data.routes[0].geometry.coordinates);
          const distanceInKm = data.routes[0].distance / 1000;
          setDistance(distanceInKm);
          const towTruckType = getTowTruckType(vehicleSize);
          const cost = calculateTotalCost(distanceInKm, towTruckType);
          setTotalCost(cost);
        }
      } catch (error) {
        console.error('Error calculating route:', error);
      }
    }
  }, [pickup, destination, setDistance, setTotalCost, vehicleSize]);

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
      <MapContainer center={companyLocation} zoom={10} style={{ height: "100%", width: "100%" }} ref={mapRef}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <MapEvents onMapClick={handleMapClick} />
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
        <RoutePolyline route={route} />
      </MapContainer>
    </Box>
  );
};

export default MapRoute;