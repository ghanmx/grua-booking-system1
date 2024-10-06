import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import MapEvents from './MapEvents';

const MapContainerComponent = ({ center, zoom, setMap, handleMapClick, children }) => {
  return (
    <MapContainer 
      center={center} 
      zoom={zoom} 
      style={{ height: "100%", width: "100%" }}
      whenCreated={setMap}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <MapEvents onMapClick={handleMapClick} />
      {children}
    </MapContainer>
  );
};

export default MapContainerComponent;