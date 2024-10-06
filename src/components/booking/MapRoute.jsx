import React, { useState, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Box, useToast, Button, VStack } from '@chakra-ui/react';
import { calculateTotalCost, getTowTruckType } from '../../utils/towTruckSelection';
import MapEvents from './MapEvents';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapRoute = ({ setPickupAddress, setDropOffAddress, setDistance, setTotalCost, vehicleSize }) => {
  const [pickup, setPickup] = useState(null);
  const [destination, setDestination] = useState(null);
  const [map, setMap] = useState(null);
  const [route, setRoute] = useState(null);
  const companyLocation = [26.509672, -100.0095504];
  const toast = useToast();

  const getAddressFromLatLng = async (lat, lng) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
      if (!response.ok) throw new Error('No se pudo obtener la dirección');
      const data = await response.json();
      return data.display_name;
    } catch (error) {
      console.error('Error al obtener la dirección:', error);
      toast({
        title: 'Error de dirección',
        description: 'No se pudo obtener la dirección. Por favor, intente de nuevo.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return '';
    }
  };

  const handleMapClick = useCallback(async (e) => {
    try {
      const { lat, lng } = e.latlng;
      if (!pickup) {
        setPickup([lat, lng]);
        const address = await getAddressFromLatLng(lat, lng);
        setPickupAddress(address);
        toast({
          title: 'Punto de recogida seleccionado',
          description: 'Ahora seleccione el punto de destino',
          status: 'info',
          duration: 3000,
          isClosable: true,
        });
      } else if (!destination) {
        setDestination([lat, lng]);
        const address = await getAddressFromLatLng(lat, lng);
        setDropOffAddress(address);
        toast({
          title: 'Destino seleccionado',
          description: 'Ruta calculada',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error al manejar el clic en el mapa:', error);
      toast({
        title: 'Error',
        description: 'No se pudo procesar el clic en el mapa. Por favor, intente de nuevo.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  }, [pickup, destination, setPickupAddress, setDropOffAddress, toast]);

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
    } catch (error) {
      console.error('Error al manejar el arrastre del marcador:', error);
      toast({
        title: 'Error',
        description: 'No se pudo actualizar la posición del marcador. Por favor, intente de nuevo.',
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
          const fullRoute = `${companyLocation[1]},${companyLocation[0]};${pickup[1]},${pickup[0]};${destination[1]},${destination[0]};${companyLocation[1]},${companyLocation[0]}`;
          const response = await fetch(`https://router.project-osrm.org/route/v1/driving/${fullRoute}?overview=full&geometries=geojson`);
          if (!response.ok) throw new Error('No se pudo calcular la ruta');
          const data = await response.json();
          if (data.routes && data.routes.length > 0) {
            setRoute(data.routes[0].geometry.coordinates);
            const distanceInMeters = data.routes[0].distance;
            const distanceInKm = distanceInMeters / 1000;
            setDistance(distanceInKm);
            const towTruckType = getTowTruckType(vehicleSize);
            const cost = calculateTotalCost(distanceInKm, towTruckType);
            setTotalCost(cost);
            toast({
              title: 'Ruta calculada',
              description: `Distancia total: ${distanceInKm.toFixed(2)} km`,
              status: 'success',
              duration: 5000,
              isClosable: true,
            });
          }
        } catch (error) {
          console.error('Error al calcular la ruta:', error);
          toast({
            title: 'Error de ruta',
            description: 'No se pudo calcular la ruta. Por favor, intente de nuevo.',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
        }
      };
      calculateRoute();
    }
  }, [pickup, destination, setDistance, setTotalCost, vehicleSize, toast, companyLocation]);

  const resetMap = useCallback(() => {
    setPickup(null);
    setDestination(null);
    setPickupAddress('');
    setDropOffAddress('');
    setDistance(0);
    setTotalCost(0);
    setRoute(null);
    if (map) {
      map.setView(companyLocation, 10);
    }
    toast({
      title: 'Mapa reiniciado',
      description: 'Seleccione nuevos puntos de recogida y destino',
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  }, [map, setPickupAddress, setDropOffAddress, setDistance, setTotalCost, toast, companyLocation]);

  return (
    <Box position="absolute" top="0" left="0" height="100%" width="100%">
      <MapContainer 
        center={companyLocation} 
        zoom={10} 
        style={{ height: "100%", width: "100%" }}
        whenCreated={setMap}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <MapEvents onMapClick={handleMapClick} />
        <Marker position={companyLocation}><Popup>Ubicación de la Compañía</Popup></Marker>
        {pickup && (
          <Marker 
            position={pickup} 
            draggable={true} 
            eventHandlers={{ 
              dragend: (e) => handleMarkerDrag(e, true)
            }}
          >
            <Popup>Ubicación de Recogida</Popup>
          </Marker>
        )}
        {destination && (
          <Marker 
            position={destination} 
            draggable={true} 
            eventHandlers={{ 
              dragend: (e) => handleMarkerDrag(e, false)
            }}
          >
            <Popup>Ubicación de Destino</Popup>
          </Marker>
        )}
        {route && <Polyline positions={route.map(coord => [coord[1], coord[0]])} color="blue" />}
      </MapContainer>
      <VStack position="absolute" top="20px" left="20px" spacing={4}>
        <Button colorScheme="blue" onClick={resetMap}>
          Reiniciar Mapa
        </Button>
      </VStack>
    </Box>
  );
};

export default MapRoute;
