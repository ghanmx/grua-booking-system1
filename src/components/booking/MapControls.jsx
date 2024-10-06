import React from 'react';
import { Polyline } from 'react-leaflet';

const MapControls = ({ route }) => {
  return (
    <Polyline positions={route.map(coord => [coord[1], coord[0]])} color="blue" />
  );
};

export default MapControls;