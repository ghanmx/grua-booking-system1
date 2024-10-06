import React from 'react';
import { Marker, Popup } from 'react-leaflet';

const MapMarkers = ({ companyLocation, pickup, destination, handleMarkerDrag }) => {
  return (
    <>
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
    </>
  );
};

export default MapMarkers;