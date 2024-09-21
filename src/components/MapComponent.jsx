import { Box } from '@chakra-ui/react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { useState } from 'react';

const MapComponent = () => {
  const [markers, setMarkers] = useState([]);

  const handleMapClick = (event) => {
    setMarkers([...markers, {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    }]);
  };

  return (
    <Box height="400px" width="100%" my={4}>
      <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
        <GoogleMap
          mapContainerStyle={{ height: "100%", width: "100%" }}
          center={{ lat: 26.509672, lng: -100.0095504 }}
          zoom={10}
          onClick={handleMapClick}
        >
          {markers.map((marker, index) => (
            <Marker key={index} position={marker} />
          ))}
        </GoogleMap>
      </LoadScript>
    </Box>
  );
};

export default MapComponent;