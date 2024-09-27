import React, { useState, useEffect } from 'react';
import { Box, Button, FormControl, FormLabel, Input, Select, Textarea, VStack, useToast, Heading, Text, Switch } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../integrations/supabase';
import GoogleMapsRoute from '../components/GoogleMapsRoute';
import { getTowTruckType, calculateTotalCost } from '../utils/towTruckSelection';
import { processPayment } from '../utils/paymentProcessing';
import { useSupabaseAuth } from '../integrations/supabase/auth';

const vehicleBrands = ['Toyota', 'Honda', 'Ford', 'Chevrolet', 'Nissan', 'BMW', 'Mercedes-Benz', 'Audi', 'Volkswagen', 'Hyundai', 'Kia', 'Mazda', 'Subaru', 'Lexus', 'Acura', 'Volvo', 'Jeep', 'Chrysler', 'Dodge', 'Ram', 'Tesla', 'Porsche', 'Jaguar', 'Land Rover', 'Mitsubishi'];

const vehicleModels = {
  Toyota: ['Corolla', 'Camry', 'RAV4', 'Highlander', 'Tacoma', 'Prius', 'Sienna', 'Tundra', '4Runner', 'Avalon'],
  Honda: ['Civic', 'Accord', 'CR-V', 'Pilot', 'Odyssey', 'Fit', 'HR-V', 'Ridgeline', 'Insight', 'Passport'],
  Ford: ['F-150', 'Mustang', 'Explorer', 'Escape', 'Focus', 'Ranger', 'Edge', 'Expedition', 'Bronco', 'Fusion'],
    Nissan: ['Altima', 'Rogue', 'Sentra', 'Maxima', 'Pathfinder', 'Murano', 'Kicks', 'Titan', 'Leaf', 'Versa', 'Armada', 'Frontier', 'GT-R', '370Z', 'Juke', 'Ariya', 'Qashqai', 'X-Trail'],
    BMW: ['3 Series', '5 Series', 'X3', 'X5', '7 Series', '1 Series', '4 Series', 'X1', 'X7', 'i3', '2 Series', '6 Series', '8 Series', 'Z4', 'iX', 'i4', 'iX3', 'X6'],
    MercedesBenz: ['C-Class', 'E-Class', 'GLC', 'GLE', 'S-Class', 'A-Class', 'CLA', 'GLA', 'GLB', 'GLS', 'G-Class', 'CLS', 'SL', 'AMG GT', 'EQC', 'EQS', 'EQA', 'EQB'],
    Audi: ['A4', 'A6', 'Q5', 'Q7', 'e-tron', 'A3', 'Q3', 'A8', 'TT', 'R8', 'S4', 'RS6', 'Q8', 'A5', 'SQ5', 'e-tron GT', 'Q4 e-tron', 'RS Q8'],
    Volkswagen: ['Golf', 'Jetta', 'Passat', 'Tiguan', 'Atlas', 'Polo', 'T-Roc', 'Arteon', 'ID.4', 'Touareg', 'Taos', 'CC', 'Beetle', 'Scirocco', 'Amarok', 'ID.3', 'T-Cross', 'Touran'],
    Hyundai: ['Elantra', 'Sonata', 'Tucson', 'Santa Fe', 'Kona', 'Accent', 'Veloster', 'Palisade', 'Ioniq', 'Venue', 'Nexo', 'Azera', 'Genesis', 'Equus', 'Entourage', 'i30', 'Ioniq 5', 'Bayon'],
    Kia: ['Forte', 'Optima', 'Sportage', 'Sorento', 'Telluride', 'Soul', 'Rio', 'Stinger', 'Seltos', 'Niro', 'Carnival', 'Cadenza', 'K900', 'Sedona', 'Mohave', 'EV6', 'Ceed', 'Picanto'],
    Mazda: ['Mazda3', 'Mazda6', 'CX-5', 'CX-9', 'MX-5 Miata', 'CX-30', 'CX-3', 'CX-8', 'BT-50', 'MX-30', 'RX-8', 'CX-7', 'Tribute', '5', '2', 'CX-60', 'MX-5 RF', 'CX-50'],
    Subaru: ['Outback', 'Forester', 'Impreza', 'Crosstrek', 'Legacy', 'Ascent', 'WRX', 'BRZ', 'XV', 'Levorg', 'Tribeca', 'Baja', 'SVX', 'Justy', 'XT', 'Solterra', 'Exiga', 'Lucra'],
    Lexus: ['RX', 'ES', 'NX', 'IS', 'GX', 'UX', 'LS', 'LC', 'RC', 'LX', 'CT', 'GS', 'SC', 'HS', 'LFA', 'RZ', 'RC F', 'IS F'],
    Acura: ['MDX', 'RDX', 'TLX', 'ILX', 'NSX', 'RLX', 'TSX', 'ZDX', 'RSX', 'Integra', 'Legend', 'CL', 'RL', 'SLX', 'Vigor', 'CDX', 'CSX', 'EL'],
    Volvo: ['XC90', 'XC60', 'S60', 'V60', 'XC40', 'S90', 'V90', 'C30', 'S40', 'V40', 'S80', 'C70', '240', '850', 'V50', 'C40', 'XC40 Recharge', 'S60 Cross Country'],
    Jeep: ['Grand Cherokee', 'Cherokee', 'Wrangler', 'Compass', 'Renegade', 'Gladiator', 'Patriot', 'Commander', 'Liberty', 'Wagoneer', 'Comanche', 'CJ', 'Willys', 'Scrambler', 'DJ', 'Grand Wagoneer', 'Avenger', 'Meridian'],
    Chrysler: ['300', 'Pacifica', 'Voyager', 'Town & Country', 'PT Cruiser', 'Sebring', 'Crossfire', 'Aspen', 'Concorde', 'LHS', 'New Yorker', 'Imperial', 'Cirrus', 'LeBaron', 'Fifth Avenue', 'Airflow', 'Valiant', 'Nassau'],
    Dodge: ['Charger', 'Challenger', 'Durango', 'Grand Caravan', 'Journey', 'Ram', 'Dart', 'Viper', 'Neon', 'Avenger', 'Nitro', 'Magnum', 'Caliber', 'Stratus', 'Intrepid', 'Demon', 'Hornet', 'Stealth'],
    Ram: ['1500', '2500', '3500', 'ProMaster', 'ProMaster City', 'Dakota', 'Cargo Van', 'C/V', 'Chassis Cab', 'Warlock', 'Rebel', 'Power Wagon', 'Laramie', 'Tradesman', 'Limited', 'TRX', 'Big Horn', 'Longhorn'],
    Tesla: ['Model 3', 'Model Y', 'Model S', 'Model X', 'Cybertruck', 'Roadster'],
    Porsche: ['911', 'Cayenne', 'Panamera', 'Macan', 'Taycan', '718 Cayman', '718 Boxster', '918 Spyder'],
    Jaguar: ['F-PACE', 'XE', 'XF', 'E-PACE', 'I-PACE', 'F-TYPE', 'XJ', 'XK'],
    LandRover: ['Range Rover', 'Discovery', 'Defender', 'Range Rover Sport', 'Range Rover Evoque', 'Range Rover Velar', 'Discovery Sport', 'Freelander'],
    Mitsubishi: ['Outlander', 'Eclipse Cross', 'Mirage', 'ASX', 'Pajero', 'Triton', 'Lancer', 'i-MiEV']
};

const BookingForm = () => {
  const [formData, setFormData] = useState({
    serviceType: '',
    userName: '',
    phoneNumber: '',
    vehicleBrand: '',
    vehicleModel: '',
    vehicleColor: '',
    licensePlate: '',
    vehicleSize: '',
    pickupAddress: '',
    dropOffAddress: '',
    vehicleIssue: '',
    additionalDetails: '',
    wheelsStatus: '',
    pickupDate: '',
    pickupTime: '',
    paymentMethod: '',
  });

  const [distance, setDistance] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTowTruck, setSelectedTowTruck] = useState('');
  const [isTestMode, setIsTestMode] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();
  const { session } = useSupabaseAuth();

  useEffect(() => {
    const testModeUser = JSON.parse(localStorage.getItem('testModeUser'));
    if (testModeUser && testModeUser.isTestMode) {
      setIsTestMode(true);
      setFormData({
        serviceType: 'Tow',
        userName: 'Test User',
        phoneNumber: '1234567890',
        vehicleBrand: 'Toyota',
        vehicleModel: 'Corolla',
        vehicleColor: 'Red',
        licensePlate: 'TEST123',
        vehicleSize: 'Small',
        pickupAddress: '123 Test St, Test City',
        dropOffAddress: '456 Test Ave, Test City',
        vehicleIssue: 'Test Issue',
        additionalDetails: 'Test Details',
        wheelsStatus: 'Wheels Turn',
        pickupDate: new Date().toISOString().split('T')[0],
        pickupTime: '12:00',
        paymentMethod: 'Credit/Debit Card',
      });
    }
  }, []);

  useEffect(() => {
    const towTruckType = getTowTruckType(formData.vehicleSize);
    setSelectedTowTruck(towTruckType);
  }, [formData.vehicleSize]);

  useEffect(() => {
    const newTotalCost = calculateTotalCost(distance, selectedTowTruck);
    setTotalCost(newTotalCost);
  }, [selectedTowTruck, distance]);

  useEffect(() => {
    if (isTestMode) {
      setFormData({
        serviceType: 'Tow',
        userName: 'Test User',
        phoneNumber: '1234567890',
        vehicleBrand: 'Toyota',
        vehicleModel: 'Corolla',
        vehicleColor: 'Red',
        licensePlate: 'TEST123',
        vehicleSize: 'Small',
        pickupAddress: '123 Test St, Test City',
        dropOffAddress: '456 Test Ave, Test City',
        vehicleIssue: 'Test Issue',
        additionalDetails: 'Test Details',
        wheelsStatus: 'Wheels Turn',
        pickupDate: new Date().toISOString().split('T')[0],
        pickupTime: '12:00',
        paymentMethod: 'Credit/Debit Card',
      });
    }
  }, [isTestMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    if (isTestMode) return true; // Skip validation in test mode

    const requiredFields = ['serviceType', 'userName', 'phoneNumber', 'vehicleBrand', 'vehicleModel', 'vehicleColor', 'licensePlate', 'vehicleSize', 'pickupAddress', 'dropOffAddress', 'vehicleIssue', 'wheelsStatus', 'pickupDate', 'pickupTime', 'paymentMethod'];
    for (let field of requiredFields) {
      if (!formData[field]) {
        toast({
          title: 'Error',
          description: `Please fill in all required fields. Missing: ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        return false;
      }
    }
    return true;
  };

  const handleBookingProcess = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      if (!isTestMode && !session) {
        // If not in test mode and not logged in, redirect to login
        navigate('/login', { state: { from: '/booking' } });
        return;
      }

      if (!isTestMode) {
        // Process payment
        const paymentResult = await processPayment(totalCost * 100); // Convert to cents

        if (!paymentResult.success) {
          console.error('Payment failed:', paymentResult.error);
          toast({
            title: 'Payment Failed',
            description: paymentResult.error,
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
          return;
        }
      }

      const bookingData = {
        ...formData,
        distance,
        totalCost,
        towTruckType: selectedTowTruck,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };

      if (!isTestMode) {
        const { data, error } = await supabase.from('bookings').insert([bookingData]);
        if (error) throw error;
      }

      toast({
        title: 'Booking Successful',
        description: isTestMode ? 'Test booking simulated successfully.' : 'Your tow service has been booked successfully.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      navigate('/confirmation', { state: { bookingData } });
    } catch (error) {
      console.error('Booking error:', error);
      toast({
        title: 'Booking Failed',
        description: error.message || 'An unexpected error occurred',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box p={4}>
      <VStack spacing={4} align="stretch">
        <Heading as="h1" mb={4}>Booking Form</Heading>
        <FormControl display="flex" alignItems="center">
          <FormLabel htmlFor="test-mode" mb="0">
            Test Mode
          </FormLabel>
          <Switch
            id="test-mode"
            isChecked={isTestMode}
            onChange={(e) => {
              setIsTestMode(e.target.checked);
              if (e.target.checked) {
                setFormData({
                  serviceType: 'Tow',
                  userName: 'Test User',
                  phoneNumber: '1234567890',
                  vehicleBrand: 'Toyota',
                  vehicleModel: 'Corolla',
                  vehicleColor: 'Red',
                  licensePlate: 'TEST123',
                  vehicleSize: 'Small',
                  pickupAddress: '123 Test St, Test City',
                  dropOffAddress: '456 Test Ave, Test City',
                  vehicleIssue: 'Test Issue',
                  additionalDetails: 'Test Details',
                  wheelsStatus: 'Wheels Turn',
                  pickupDate: new Date().toISOString().split('T')[0],
                  pickupTime: '12:00',
                  paymentMethod: 'Credit/Debit Card',
                });
              } else {
                setFormData({
                  serviceType: '',
                  userName: '',
                  phoneNumber: '',
                  vehicleBrand: '',
                  vehicleModel: '',
                  vehicleColor: '',
                  licensePlate: '',
                  vehicleSize: '',
                  pickupAddress: '',
                  dropOffAddress: '',
                  vehicleIssue: '',
                  additionalDetails: '',
                  wheelsStatus: '',
                  pickupDate: '',
                  pickupTime: '',
                  paymentMethod: '',
                });
              }
            }}
          />
        </FormControl>
        <form onSubmit={handleBookingProcess}>
          {/* Form fields */}
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
            <FormLabel htmlFor="userName">User Name</FormLabel>
            <Input type="text" id="userName" name="userName" value={formData.userName} onChange={handleChange} autoComplete="name" />
          </FormControl>
          <FormControl id="phoneNumber" isRequired>
            <FormLabel htmlFor="phoneNumber">Phone Number</FormLabel>
            <Input type="tel" id="phoneNumber" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} autoComplete="tel" />
          </FormControl>
          <FormControl id="vehicleBrand" isRequired>
            <FormLabel htmlFor="vehicleBrand">Vehicle Brand</FormLabel>
            <Select id="vehicleBrand" name="vehicleBrand" value={formData.vehicleBrand} onChange={handleChange}>
              <option value="">Select Brand</option>
              {vehicleBrands.map((brand) => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </Select>
          </FormControl>
          <FormControl id="vehicleModel" isRequired>
            <FormLabel htmlFor="vehicleModel">Vehicle Model</FormLabel>
            <Select id="vehicleModel" name="vehicleModel" value={formData.vehicleModel} onChange={handleChange} disabled={!formData.vehicleBrand}>
              <option value="">Select Model</option>
              {formData.vehicleBrand && vehicleModels[formData.vehicleBrand].map((model) => (
                <option key={model} value={model}>{model}</option>
              ))}
            </Select>
          </FormControl>
          <FormControl id="vehicleColor" isRequired>
            <FormLabel htmlFor="vehicleColor">Vehicle Color</FormLabel>
            <Input type="text" id="vehicleColor" name="vehicleColor" value={formData.vehicleColor} onChange={handleChange} />
          </FormControl>
          <FormControl id="licensePlate" isRequired>
            <FormLabel htmlFor="licensePlate">License Plate</FormLabel>
            <Input type="text" id="licensePlate" name="licensePlate" value={formData.licensePlate} onChange={handleChange} autoComplete="off" />
          </FormControl>
          <FormControl id="vehicleSize" isRequired>
            <FormLabel htmlFor="vehicleSize">Vehicle Size</FormLabel>
            <Select id="vehicleSize" name="vehicleSize" value={formData.vehicleSize} onChange={handleChange}>
              <option value="">Select Vehicle Size</option>
              <option value="Small">Small (up to 3500 kg)</option>
              <option value="Medium">Medium (3501 - 6000 kg)</option>
              <option value="Large">Large (6001 - 12000 kg)</option>
              <option value="Extra Large">Extra Large (12001 - 25000 kg)</option>
            </Select>
          </FormControl>
          <FormControl id="pickupAddress" isRequired>
            <FormLabel htmlFor="pickupAddress">Pickup Address</FormLabel>
            <Input type="text" id="pickupAddress" name="pickupAddress" value={formData.pickupAddress} onChange={handleChange} readOnly autoComplete="street-address" />
          </FormControl>
          <FormControl id="dropOffAddress" isRequired>
            <FormLabel htmlFor="dropOffAddress">Drop-off Address</FormLabel>
            <Input type="text" id="dropOffAddress" name="dropOffAddress" value={formData.dropOffAddress} onChange={handleChange} readOnly autoComplete="street-address" />
          </FormControl>
          <FormControl id="vehicleIssue" isRequired>
            <FormLabel htmlFor="vehicleIssue">Vehicle Issue</FormLabel>
            <Input type="text" id="vehicleIssue" name="vehicleIssue" value={formData.vehicleIssue} onChange={handleChange} />
          </FormControl>
          <FormControl id="additionalDetails">
            <FormLabel htmlFor="additionalDetails">Additional Details</FormLabel>
            <Textarea id="additionalDetails" name="additionalDetails" value={formData.additionalDetails} onChange={handleChange} />
          </FormControl>
          <FormControl id="wheelsStatus" isRequired>
            <FormLabel htmlFor="wheelsStatus">Wheels Status</FormLabel>
            <Select id="wheelsStatus" name="wheelsStatus" value={formData.wheelsStatus} onChange={handleChange}>
              <option value="">Select Wheels Status</option>
              <option value="Wheels Turn">Wheels Turn</option>
              <option value="Wheels Don't Turn">Wheels Don't Turn</option>
            </Select>
          </FormControl>
          <FormControl id="pickupDate" isRequired>
            <FormLabel htmlFor="pickupDate">Pickup Date</FormLabel>
            <Input type="date" id="pickupDate" name="pickupDate" value={formData.pickupDate} onChange={handleChange} />
          </FormControl>
          <FormControl id="pickupTime" isRequired>
            <FormLabel htmlFor="pickupTime">Pickup Time</FormLabel>
            <Input type="time" id="pickupTime" name="pickupTime" value={formData.pickupTime} onChange={handleChange} />
          </FormControl>
          <FormControl id="paymentMethod" isRequired>
            <FormLabel htmlFor="paymentMethod">Payment Method</FormLabel>
            <Select id="paymentMethod" name="paymentMethod" value={formData.paymentMethod} onChange={handleChange}>
              <option value="">Select Payment Method</option>
              <option value="Credit/Debit Card">Credit/Debit Card</option>
              <option value="Bank Transfer">Bank Transfer</option>
            </Select>
          </FormControl>
          <GoogleMapsRoute
            setPickupAddress={(address) => setFormData({ ...formData, pickupAddress: address })}
            setDropOffAddress={(address) => setFormData({ ...formData, dropOffAddress: address })}
            setDistance={setDistance}
            setTotalCost={setTotalCost}
            selectedTowTruck={selectedTowTruck}
          />
          {selectedTowTruck && totalCost > 0 && (
            <Box mt={4} p={4} borderWidth={1} borderRadius="md">
              <Text>Selected Tow Truck Type: {selectedTowTruck}</Text>
              <Text>Estimated Total Cost: ${totalCost.toFixed(2)}</Text>
            </Box>
          )}
          <Button colorScheme="blue" type="submit" mt={4} isLoading={isLoading}>
            {isTestMode ? 'Simulate Booking' : 'Book Now'}
          </Button>
        </form>
      </VStack>
    </Box>
  );
};

export default BookingForm;