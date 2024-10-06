import React, { useEffect } from 'react';
import { useMapEvents } from 'react-leaflet';
import { useToast } from '@chakra-ui/react';

const MapEvents = ({ onMapClick, setMap }) => {
  const toast = useToast();
  const map = useMapEvents({
    click: (e) => {
      try {
        onMapClick(e);
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
    },
  });

  useEffect(() => {
    setMap(map);
  }, [map, setMap]);

  return null;
};

export default MapEvents;