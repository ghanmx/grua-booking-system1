import { Box } from '@chakra-ui/react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { useState, useCallback } from 'react';

const MapComponent = () => {
  const [markers, setMarkers] = useState([]);

  // Memoized handleMapClick to prevent re-rendering of the function unnecessarily
  const handleMapClick = useCallback((event) => {
    const newMarker = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
      id: Date.now(), // Use a unique ID based on the timestamp
    };
    setMarkers((prevMarkers) => [...prevMarkers, newMarker]);
  }, []);

  return (
    <Box height="400px" width="100%" my={4}>
      <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
        <GoogleMap
          mapContainerStyle={{ height: '100%', width: '100%' }}
          center={{ lat: 26.509672, lng: -100.0095504 }}
          zoom={10}
          onClick={handleMapClick}
        >
          {markers.map((marker) => (
            <Marker key={marker.id} position={{ lat: marker.lat, lng: marker.lng }} />
          ))}
        </GoogleMap>
      </LoadScript>
    </Box>
  );
};

export default MapComponent;
