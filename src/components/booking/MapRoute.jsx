import React, { lazy, Suspense } from 'react';
import { Box, useToast, Button, VStack, Spinner } from '@chakra-ui/react';
import { useMapRouteLogic } from '../../hooks/useMapRouteLogic';
import { useOptimizedImage } from '../../utils/imageOptimization';

const MapContainer = lazy(() => import('./MapContainer'));
const MapMarkers = lazy(() => import('./MapMarkers'));
const MapControls = lazy(() => import('./MapControls'));

const MapRoute = React.memo(({ setPickupAddress, setDropOffAddress, setDistance, setTotalCost, vehicleSize }) => {
  const {
    pickup,
    destination,
    route,
    companyLocation,
    handleMapClick,
    handleMarkerDrag,
    setMap,
    resetMap
  } = useMapRouteLogic(setPickupAddress, setDropOffAddress, setDistance, setTotalCost, vehicleSize);

  const companyLocationImage = useOptimizedImage('/images/company-location.png', { width: 32, height: 32 });
  const pickupImage = useOptimizedImage('/images/pickup-location.png', { width: 32, height: 32 });
  const destinationImage = useOptimizedImage('/images/destination-location.png', { width: 32, height: 32 });

  return (
    <Box position="absolute" top="0" left="0" height="100%" width="100%">
      <Suspense fallback={<Spinner />}>
        <MapContainer
          center={companyLocation}
          zoom={10}
          setMap={setMap}
          handleMapClick={handleMapClick}
        >
          <MapMarkers
            companyLocation={companyLocation}
            pickup={pickup}
            destination={destination}
            handleMarkerDrag={handleMarkerDrag}
            companyLocationImage={companyLocationImage}
            pickupImage={pickupImage}
            destinationImage={destinationImage}
          />
          {route && <MapControls route={route} />}
        </MapContainer>
      </Suspense>
      <VStack position="absolute" top="20px" left="20px" spacing={4}>
        <Button 
          colorScheme="blue" 
          onClick={resetMap}
          aria-label="Reiniciar Mapa"
        >
          Reiniciar Mapa
        </Button>
      </VStack>
    </Box>
  );
});

export default MapRoute;