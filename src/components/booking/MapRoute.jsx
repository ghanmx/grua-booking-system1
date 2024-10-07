import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap, useMapEvents } from 'react-leaflet';
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

const MapEvents = ({ onMapClick }) => {
  useMapEvents({
    click: onMapClick,
  });
  return null;
};

const MapContent = ({ pickup, destination, route, companyLocation, handleMarkerDragEnd }) => {
  const map = useMap();

  useEffect(() => {
    if (pickup && destination) {
      const bounds = L.latLngBounds(pickup, destination);
      bounds.extend(companyLocation);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [map, pickup, destination, companyLocation]);

  return (
    <>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
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
    </>
  );
};

const MapRoute = ({ setPickupAddress, setDropOffAddress, setDistance, setTotalCost, vehicleSize }) => {
  const [pickup, setPickup] = useState(null);
  const [destination, setDestination] = useState(null);
  const [route, setRoute] = useState(null);
  const companyLocation = [26.509672, -100.0095504];
  const toast = useToast();

  const getAddressFromLatLng = useCallback(async (lat, lng) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
      const data = await response.json();
      return data.display_name;
    } catch (error) {
      console.error('Error getting address:', error);
      return '';
    }
  }, []);

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
  }, [pickup, destination, getAddressFromLatLng, setPickupAddress, setDropOffAddress]);

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
  }, [getAddressFromLatLng, setPickupAddress, setDropOffAddress]);

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
  }, [pickup, destination, companyLocation, setDistance, setTotalCost, vehicleSize, toast]);

  useEffect(() => {
    calculateRoute();
  }, [calculateRoute]);

  const mapCenter = useMemo(() => {
    if (pickup && destination) {
      return [(pickup[0] + destination[0]) / 2, (pickup[1] + destination[1]) / 2];
    }
    return companyLocation;
  }, [pickup, destination, companyLocation]);

  return (
    <Box position="absolute" top="0" left="0" height="100%" width="100%">
      <MapContainer key={`${mapCenter[0]}-${mapCenter[1]}`} center={mapCenter} zoom={10} style={{ height: "100%", width: "100%" }}>
        <MapEvents onMapClick={handleMapClick} />
        <MapContent
          pickup={pickup}
          destination={destination}
          route={route}
          companyLocation={companyLocation}
          handleMarkerDragEnd={handleMarkerDragEnd}
        />
      </MapContainer>
    </Box>
  );
};

export default React.memo(MapRoute);