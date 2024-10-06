import React, { useState, useEffect } from 'react';
import { Box, VStack, Heading, Table, Thead, Tbody, Tr, Th, Td, Button, Select, useToast, Text, Alert, AlertIcon } from "@chakra-ui/react";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useBookings } from '../../hooks/useBookings';
import { updateBooking, deleteBooking } from '../../server/db';
import { runDiagnostics } from '../../utils/diagnostics';

const BookingManagement = () => {
  const queryClient = useQueryClient();
  const toast = useToast();
  const { data: bookingsData, isLoading, error, refetch } = useBookings();
  const [diagnosticResults, setDiagnosticResults] = useState(null);

  useEffect(() => {
    if (error) {
      runDiagnostics().then(results => setDiagnosticResults(results));
    }
  }, [error]);

  const updateBookingMutation = useMutation({
    mutationFn: ({ id, status }) => updateBooking(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries('bookings');
      toast({
        title: 'Booking Updated',
        description: 'The booking status has been updated successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    },
  });

  const deleteBookingMutation = useMutation({
    mutationFn: deleteBooking,
    onSuccess: () => {
      queryClient.invalidateQueries('bookings');
      toast({
        title: 'Booking Deleted',
        description: 'The booking has been deleted successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    },
  });

  const handleRunDiagnostics = async () => {
    const results = await runDiagnostics();
    setDiagnosticResults(results);
    toast({
      title: 'Diagnostics Complete',
      description: 'Check the console for detailed results.',
      status: 'info',
      duration: 5000,
      isClosable: true,
    });
    console.log('Diagnostic Results:', results);
  };

  const handleStatusChange = (bookingId, newStatus) => {
    updateBookingMutation.mutate({ id: bookingId, status: newStatus });
  };

  const handleDeleteBooking = (bookingId) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      deleteBookingMutation.mutate(bookingId);
    }
  };

  if (isLoading) return <Box>Loading bookings...</Box>;
  
  if (error) {
    return (
      <Box>
        <Alert status="error" mb={4}>
          <AlertIcon />
          Error loading bookings: {error.message}
        </Alert>
        <Button onClick={handleRunDiagnostics} colorScheme="blue" mr={4}>Run Diagnostics</Button>
        <Button onClick={() => refetch()}>Try Again</Button>
        {diagnosticResults && (
          <VStack align="start" mt={4}>
            <Text fontWeight="bold">Diagnostic Results:</Text>
            <Text>Database Connection: {diagnosticResults.databaseConnection ? 'OK' : 'Failed'}</Text>
            <Text>Bookings Table: {diagnosticResults.tables.bookings.exists ? 'OK' : 'Failed'}</Text>
            <Text>Users Table: {diagnosticResults.tables.users.exists ? 'OK' : 'Failed'}</Text>
            <Text>Services Table: {diagnosticResults.tables.services.exists ? 'OK' : 'Failed'}</Text>
            <Text>Bookings-Users Relationship: {diagnosticResults.relationships.bookings_users ? 'OK' : 'Failed'}</Text>
            <Text>Bookings-Services Relationship: {diagnosticResults.relationships.bookings_services ? 'OK' : 'Failed'}</Text>
          </VStack>
        )}
      </Box>
    );
  }

  return (
    <Box>
      <Heading as="h2" size="lg" mb={4}>Booking Management</Heading>
      <Button onClick={handleRunDiagnostics} colorScheme="blue" mb={4}>Run Diagnostics</Button>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>User</Th>
            <Th>Service</Th>
            <Th>Status</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {bookingsData && bookingsData.data && bookingsData.data.map((booking) => (
            <Tr key={booking.id}>
              <Td>{booking.id}</Td>
              <Td>{booking.user?.profile?.full_name || booking.user?.email}</Td>
              <Td>{booking.service?.name}</Td>
              <Td>
                <Select
                  value={booking.status}
                  onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </Select>
              </Td>
              <Td>
                <Button
                  colorScheme="red"
                  size="sm"
                  onClick={() => handleDeleteBooking(booking.id)}
                >
                  Delete
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default BookingManagement;