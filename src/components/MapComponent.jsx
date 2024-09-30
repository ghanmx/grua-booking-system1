import { Box } from '@chakra-ui/react';
import { GoogleMap, LoadScript } from '@react-google-maps/api';
import { useState, useCallback, useEffect } from 'react';

const MapComponent = () => {
  const [markers, setMarkers] = useState([]);
  const [map, setMap] = useState(null);

  const handleMapClick = useCallback((event) => {
    const newMarker = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
      id: Date.now(),
    };
    setMarkers((prevMarkers) => [...prevMarkers, newMarker]);
  }, []);

  const createAdvancedMarker = useCallback((position) => {
    if (map && window.google) {
      const advancedMarkerElement = new window.google.maps.marker.AdvancedMarkerElement({
        position,
        map,
      });
      return advancedMarkerElement;
    }
    return null;
  }, [map]);

  useEffect(() => {
    if (map) {
      markers.forEach((marker) => {
        createAdvancedMarker({ lat: marker.lat, lng: marker.lng });
      });
    }
  }, [map, markers, createAdvancedMarker]);

  return (
    <Box height="400px" width="100%" my={4}>
      <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
        <GoogleMap
          mapContainerStyle={{ height: '100%', width: '100%' }}
          center={{ lat: 26.509672, lng: -100.0095504 }}
          zoom={10}
          onClick={handleMapClick}
          onLoad={setMap}
        />
      </LoadScript>
    </Box>
  );
};

export default MapComponent;