import { useState, useEffect, useRef } from 'react';
import { Box, Button, FormControl, FormLabel, Input, Select, Textarea, VStack, useToast, Heading, Text, Checkbox, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton } from '@chakra-ui/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LoadScript, GoogleMap, Marker, DirectionsService, DirectionsRenderer } from '@react-google-maps/api';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe('your-publishable-key-here');

const BookingForm = () => {
  const [formData, setFormData] = useState({
    serviceType: '',
    userName: '',
    phoneNumber: '',
    carBrand: '',
    vehicleModel: '',
    vehicleSize: '',
    additionalInfo: '',
    pickupDate: '',
    pickupTime: '',
    origin: { lat: 26.509672, lng: -100.0095504 },
    pickupLocation: null,
    destinationLocation: null,
    distance: 0,
    streetLevel: '',
    neutralPossible: '',
    adaptations: '',
    passengers: '',
  });

  const [directions, setDirections] = useState(null);
  const [tollCost, setTollCost] = useState(0);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);

  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const mapRef = useRef(null);
  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    if (location.state) {
      const { origin, pickupLocation, destinationLocation } = location.state;
      setFormData((prevData) => ({ ...prevData, origin, pickupLocation, destinationLocation }));
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { serviceType, userName, phoneNumber, carBrand, vehicleModel, vehicleSize, pickupDate, pickupTime, origin, pickupLocation, destinationLocation, distance, streetLevel, neutralPossible, adaptations, passengers } = formData;

    if (!serviceType || !userName || !phoneNumber || !carBrand || !vehicleModel || !vehicleSize || !pickupDate || !pickupTime || !origin || !pickupLocation || !destinationLocation || !streetLevel || !neutralPossible || !adaptations || !passengers) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const baseCost = 558;
    const costPerKm = 19;
    const totalCost = baseCost + (distance * costPerKm) + tollCost;

    try {
      console.log('Submitting form with data:', formData);
      const response = await fetch('https://placeholder-url-for-testing.com/bookings', {
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
      const cardElement = elements.getElement(CardElement);

      const paymentIntent = await stripe.createPaymentIntent({
        amount: totalCost * 100, // Amount in cents
        currency: 'usd',
      });

      const paymentResult = await stripe.confirmCardPayment(paymentIntent.client_secret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: userName,
          },
        },
      });

      if (paymentResult.error) {
        throw new Error(paymentResult.error.message);
      }

      navigate('/confirmation', { state: { formData, totalCost, serviceDetails: { serviceType, distance, pickupLocation, destinationLocation } } });
    } catch (error) {
      console.error('Error submitting form:', error);
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
      if (!formData.pickupLocation) {
        setFormData({ ...formData, pickupLocation: { lat: event.latLng.lat(), lng: event.latLng.lng() } });
      } else if (!formData.destinationLocation) {
        setFormData({ ...formData, destinationLocation: { lat: event.latLng.lat(), lng: event.latLng.lng() } });
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
    setFormData({ ...formData, pickupLocation: null, destinationLocation: null });
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
          setFormData({ ...formData, pickupLocation: userLocation });
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
    if (formData.pickupLocation && formData.destinationLocation) {
      return (
        <DirectionsService
          options={{
            origin: formData.pickupLocation,
            destination: formData.destinationLocation,
            travelMode: 'DRIVING',
          }}
          callback={(response, status) => {
            if (status === 'OK') {
              setDirections(response);
              const distanceInKm = response.routes[0].legs[0].distance.value / 1000;
              setFormData((prevData) => ({ ...prevData, distance: distanceInKm }));
              fetchTollData(formData.pickupLocation, formData.destinationLocation);
            } else {
              console.error('Error calculating route:', status);
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
      <VStack spacing={4} align="stretch">
        <Heading as="h1" mb={4}>Booking Form</Heading>
        <form onSubmit={handleSubmit}>
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
          <FormControl id="carBrand" isRequired>
            <FormLabel>Car Brand</FormLabel>
            <Input type="text" name="carBrand" value={formData.carBrand} onChange={handleChange} />
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
          <FormControl id="streetLevel" isRequired>
            <FormLabel>Is the vehicle at street level?</FormLabel>
            <Select name="streetLevel" value={formData.streetLevel} onChange={handleChange}>
              <option value="">Select</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </Select>
          </FormControl>
          <FormControl id="neutralPossible" isRequired>
            <FormLabel>Is it possible to put neutral?</FormLabel>
            <Select name="neutralPossible" value={formData.neutralPossible} onChange={handleChange}>
              <option value="">Select</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </Select>
          </FormControl>
          <FormControl id="adaptations" isRequired>
            <FormLabel>Does the vehicle have adaptations that increase its length or width?</FormLabel>
            <Select name="adaptations" value={formData.adaptations} onChange={handleChange}>
              <option value="">Select</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </Select>
          </FormControl>
          <FormControl id="passengers" isRequired>
            <FormLabel>Number of passengers</FormLabel>
            <Input type="number" name="passengers" value={formData.passengers} onChange={handleChange} />
          </FormControl>
          <FormControl id="terms" isRequired>
            <Checkbox onChange={() => setIsTermsOpen(true)}>I accept terms and conditions</Checkbox>
          </FormControl>
          <CardElement />
          <Button colorScheme="blue" type="submit">Book Now</Button>
        </form>
        <LoadScript
          googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
          onLoad={() => setIsMapLoaded(true)}
          onError={() => {
            toast({
              title: 'Error',
              description: 'Failed to load Google Maps API. Please check your API key and internet connection.',
              status: 'error',
              duration: 5000,
              isClosable: true,
            });
          }}
        >
          {isMapLoaded ? (
            <GoogleMap
              center={formData.origin}
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
              {formData.pickupLocation && (
                <Marker
                  position={formData.pickupLocation}
                  draggable={true}
                  onDragEnd={(e) => setFormData({ ...formData, pickupLocation: { lat: e.latLng.lat(), lng: e.latLng.lng() } })}
                />
              )}
              {formData.destinationLocation && (
                <Marker
                  position={formData.destinationLocation}
                  draggable={true}
                  onDragEnd={(e) => setFormData({ ...formData, destinationLocation: { lat: e.latLng.lat(), lng: e.latLng.lng() } })}
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
          ) : (
            <Text>Loading map...</Text>
          )}
        </LoadScript>
        <Button onClick={handleReset} mt={4}>Reset</Button>
        <Button onClick={centerPickupMarker} mt={4} ml={4} colorScheme="blue">Center User</Button>
      </VStack>
      <Modal isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Terms and Conditions</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>The services may have a higher cost which must be paid when arriving at the destination, otherwise the vehicle will not leave the platform and will be taken to the corralon.</Text>
            <Text>Remember that only two passengers can go in the tow truck, if you require a taxi we can provide it.</Text>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

const BookingFormWrapper = () => (
  <Elements stripe={stripePromise}>
    <BookingForm />
  </Elements>
);

export default BookingFormWrapper;