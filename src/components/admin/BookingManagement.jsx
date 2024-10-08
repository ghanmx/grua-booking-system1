import React from 'react';
import { Box, VStack, Heading, Table, Thead, Tbody, Tr, Th, Td, Text, Alert, AlertIcon } from "@chakra-ui/react";
import { useQuery } from '@tanstack/react-query';
import { useBookings } from '../../hooks/useBookings';

const BookingManagement = ({ showNotification }) => {
  const { data: bookingsData, isLoading, error } = useBookings();

  if (isLoading) return <Box>Loading bookings...</Box>;
  if (error) {
    showNotification('Error', `Failed to load bookings: ${error.message}`, 'error');
    return (
      <Alert status="error">
        <AlertIcon />
        Error loading bookings. Please try again later.
      </Alert>
    );
  }

  const bookings = bookingsData?.data || [];

  return (
    <Box>
      <Heading as="h2" size="lg" mb={4}>Booking Management</Heading>
      {bookings.length === 0 ? (
        <Text>No bookings found.</Text>
      ) : (
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Booking ID</Th>
              <Th>User Email</Th>
              <Th>Service Name</Th>
              <Th>Status</Th>
              <Th>Payment Status</Th>
              <Th>Total Cost</Th>
              <Th>Created At</Th>
            </Tr>
          </Thead>
          <Tbody>
            {bookings.map((booking) => (
              <Tr key={booking.id}>
                <Td>{booking.id}</Td>
                <Td>{booking.user?.email || 'N/A'}</Td>
                <Td>{booking.service?.name || 'N/A'}</Td>
                <Td>{booking.status}</Td>
                <Td>{booking.payment_status}</Td>
                <Td>${booking.total_cost}</Td>
                <Td>{new Date(booking.created_at).toLocaleString()}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </Box>
  );
};

export default BookingManagement;