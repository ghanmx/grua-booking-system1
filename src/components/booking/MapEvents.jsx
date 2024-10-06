import React from 'react';
import { useMapEvents } from 'react-leaflet';

const MapEvents = React.memo(({ onMapClick }) => {
  useMapEvents({
    click: onMapClick,
  });
  return null;
});

export default MapEvents;