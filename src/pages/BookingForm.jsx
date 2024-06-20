import { useState, useEffect, useRef } from 'react';
import { Box, Button, FormControl, FormLabel, Input, Select, Textarea, VStack, useToast } from '@chakra-ui/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LoadScript, GoogleMap, Marker, DirectionsService, DirectionsRenderer } from '@react-google-maps/api';

const BookingForm = () => {
  const [formData, setFormData] = useState({
    serviceType: '',
    userName: '',
    phoneNumber: '',
    vehicleMake: '',
    vehicleModel: '',
    vehicleSize: '',
    additionalInfo: '',
    pickupDate: '',
    pickupTime: '',
    origin: { lat: 26.509672, lng: -100.0095504 },
    pickupLocation: null,
    destinationLocation: null,
    distance: 0,
  });

  const [origin, setOrigin] = useState({ lat: 26.509672, lng: -100.0095504 });
  const [pickupLocation, setPickupLocation] = useState(null);
  const [destinationLocation, setDestinationLocation] = useState(null);
  const [directions, setDirections] = useState(null);
  const [totalDistance, setTotalDistance] = useState(0);
  const [tollCost, setTollCost] = useState(0);

  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const mapRef = useRef(null);

  useEffect(() => {
    if (location.state) {
      const { origin, pickupLocation, destinationLocation } = location.state;
      setFormData((prevData) => ({ ...prevData, origin, pickupLocation, destinationLocation }));
    }
  }, [location.state]);

  useEffect(() => {
    console.log('formData:', formData);
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { serviceType, userName, phoneNumber, vehicleMake, vehicleModel, vehicleSize, pickupDate, pickupTime, origin, pickupLocation, destinationLocation, distance } = formData;

    if (!serviceType || !userName || !phoneNumber || !vehicleMake || !vehicleModel || !vehicleSize || !pickupDate || !pickupTime || !origin || !pickupLocation || !destinationLocation) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    // Calculate total cost
    const baseCost = 558;
    const costPerKm = 19;
    const totalCost = baseCost + (distance * costPerKm) + tollCost;

    try {
      const response = await fetch('https://valid-endpoint-for-booking.com/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData, totalCost }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      navigate('/payment', { state: { formData, totalCost, serviceDetails: { serviceType, distance, pickupLocation, destinationLocation } } });
    } catch (error) {
      console.error('Error processing booking:', error);
      toast({
        title: 'Error',
        description: 'There was a problem processing your booking. Please try again later.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleMapClick = (event) => {
    try {
      if (!pickupLocation) {
        setPickupLocation({ lat: event.latLng.lat(), lng: event.latLng.lng() });
      } else if (!destinationLocation) {
        setDestinationLocation({ lat: event.latLng.lat(), lng: event.latLng.lng() });
      }
    } catch (error) {
      console.error('Error handling map click:', error);
      toast({
        title: 'Error',
        description: 'There was a problem handling the map click. Please try again later.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleReset = () => {
    setPickupLocation(null);
    setDestinationLocation(null);
    setDirections(null);
  };

  const centerPickupMarker = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setPickupLocation(userLocation);
          if (mapRef.current) {
            mapRef.current.panTo(userLocation);
          }
        },
        (error) => {
          console.error('Error getting user location:', error);
          toast({
            title: 'Error',
            description: 'There was a problem getting your location. Please try again later.',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
      toast({
        title: 'Error',
        description: 'Geolocation is not supported by this browser.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const calculateRoute = () => {
    if (pickupLocation && destinationLocation) {
      return (
        <DirectionsService
          options={{
            origin: pickupLocation,
            destination: destinationLocation,
            travelMode: 'DRIVING',
          }}
          callback={(response, status) => {
            if (status === 'OK') {
              setDirections(response);
              const distanceInKm = response.routes[0].legs[0].distance.value / 1000;
              setFormData((prevData) => ({ ...prevData, distance: distanceInKm }));
              fetchTollData(pickupLocation, destinationLocation);
            } else if (status === 'REQUEST_DENIED') {
              console.error('Directions request was denied:', response);
              toast({
                title: 'Error',
                description: 'Directions request was denied. Please check your API key and permissions.',
                status: 'error',
                duration: 5000,
                isClosable: true,
              });
            } else {
              console.error('Error calculating route:', response);
              toast({
                title: 'Error',
                description: 'There was a problem calculating the route. Please try again later.',
                status: 'error',
                duration: 5000,
                isClosable: true,
              });
            }
          }}
        />
      );
    }
    return null;
  };

  const fetchTollData = async (origin, destination) => {
    try {
      const response = await fetch(`https://api.tollguru.com/v1/calc/route?source=${origin.lat},${origin.lng}&destination=${destination.lat},${destination.lng}`);
      const data = await response.json();
      const tolls = data.tolls || 0;
      setTollCost(tolls);
    } catch (error) {
      console.error('Error fetching toll data:', error);
      toast({
        title: 'Error',
        description: 'There was a problem fetching toll data. Please try again later.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={4}>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4} align="stretch">
          <FormControl id="serviceType" isRequired>
            <FormLabel>Service Type</FormLabel>
            <Select name="serviceType" value={formData.serviceType} onChange={handleChange}>
              <option value="">Select Service Type</option>
              <option value="Tow">Tow</option>
              <option value="Platform">Platform</option>
              <option value="Roadside Assistance">Roadside Assistance</option>
            </Select>
          </FormControl>
          <FormControl id="userName" isRequired>
            <FormLabel>User Name</FormLabel>
            <Input type="text" name="userName" value={formData.userName} onChange={handleChange} />
          </FormControl>
          <FormControl id="phoneNumber" isRequired>
            <FormLabel>Phone Number</FormLabel>
            <Input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
          </FormControl>
          <FormControl id="vehicleMake" isRequired>
            <FormLabel>Vehicle Make</FormLabel>
            <Input type="text" name="vehicleMake" value={formData.vehicleMake} onChange={handleChange} />
          </FormControl>
          <FormControl id="vehicleModel" isRequired>
            <FormLabel>Vehicle Model</FormLabel>
            <Input type="text" name="vehicleModel" value={formData.vehicleModel} onChange={handleChange} />
          </FormControl>
          <FormControl id="vehicleSize" isRequired>
            <FormLabel>Vehicle Size</FormLabel>
            <Select name="vehicleSize" value={formData.vehicleSize} onChange={handleChange}>
              <option value="">Select Vehicle Size</option>
              <option value="Small">Small</option>
              <option value="Medium">Medium</option>
              <option value="Large">Large</option>
            </Select>
          </FormControl>
          <FormControl id="additionalInfo">
            <FormLabel>Additional Information</FormLabel>
            <Textarea name="additionalInfo" value={formData.additionalInfo} onChange={handleChange} />
          </FormControl>
          <FormControl id="pickupDate" isRequired>
            <FormLabel>Pickup Date</FormLabel>
            <Input type="date" name="pickupDate" value={formData.pickupDate} onChange={handleChange} />
          </FormControl>
          <FormControl id="pickupTime" isRequired>
            <FormLabel>Pickup Time</FormLabel>
            <Input type="time" name="pickupTime" value={formData.pickupTime} onChange={handleChange} />
          </FormControl>
          <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY} onError={() => {
            toast({
              title: 'Error',
              description: 'Failed to load Google Maps API. Please check your API key and internet connection.',
              status: 'error',
              duration: 5000,
              isClosable: true,
            });
          }}>
            <GoogleMap
              center={origin}
              zoom={10}
              mapContainerStyle={{ height: '400px', width: '100%' }}
              onClick={handleMapClick}
              onLoad={(map) => (mapRef.current = map)}
              options={{
                zoomControl: true,
                zoomControlOptions: {
                  position: window.google.maps.ControlPosition.RIGHT_CENTER,
                },
                streetViewControl: false,
                mapTypeControl: false,
                fullscreenControl: false,
              }}
            >
              {pickupLocation && (
                <Marker
                  position={pickupLocation}
                  draggable={true}
                  onDragEnd={(e) => setPickupLocation({ lat: e.latLng.lat(), lng: e.latLng.lng() })}
                />
              )}
              {destinationLocation && (
                <Marker
                  position={destinationLocation}
                  draggable={true}
                  onDragEnd={(e) => setDestinationLocation({ lat: e.latLng.lat(), lng: e.latLng.lng() })}
                />
              )}
              {calculateRoute()}
              {directions && <DirectionsRenderer directions={directions} onError={(error) => {
                console.error('Error rendering directions:', error);
                toast({
                  title: 'Error',
                  description: 'There was a problem rendering the directions. Please try again later.',
                  status: 'error',
                  duration: 5000,
                  isClosable: true,
                });
              }} />}
            </GoogleMap>
          </LoadScript>
          <Button onClick={handleReset} mt={4}>Reset</Button>
          <Button onClick={centerPickupMarker} mt={4} ml={4} colorScheme="blue">Centrar usuario</Button>
          <Button colorScheme="blue" type="submit">Book Now</Button>
        </VStack>
      </form>
    </Box>
  );
};

export default BookingForm;