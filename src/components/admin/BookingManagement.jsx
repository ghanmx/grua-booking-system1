import React, { useEffect } from 'react';
import { Box, VStack, Heading, Table, Thead, Tbody, Tr, Th, Td, Button, Select, useToast, Text } from "@chakra-ui/react";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateBooking, deleteBooking, subscribeToBookings } from '../../server/db';
import { useBookings } from '../../hooks/useBookings';

const BookingManagement = ({ showNotification }) => {
  const queryClient = useQueryClient();
  const toast = useToast();
  const { data: bookingsData, isLoading, error } = useBookings();

  useEffect(() => {
    const subscription = subscribeToBookings((payload) => {
      queryClient.invalidateQueries('bookings');
      toast({
        title: 'Booking Update',
        description: `Booking ${payload.new.id} has been updated.`,
        status: 'info',
        duration: 3000,
        isClosable: true,
      });
    });

    return () => {
      if (subscription && subscription.unsubscribe) {
        subscription.unsubscribe();
      }
    };
  }, [queryClient, toast]);

  const updateBookingMutation = useMutation({
    mutationFn: ({ id, status }) => updateBooking(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries('bookings');
      showNotification('Booking Updated', 'The booking status has been updated successfully.', 'success');
    },
  });

  const deleteBookingMutation = useMutation({
    mutationFn: deleteBooking,
    onSuccess: () => {
      queryClient.invalidateQueries('bookings');
      showNotification('Booking Deleted', 'The booking has been deleted successfully.', 'success');
    },
  });

  const handleStatusChange = (bookingId, newStatus) => {
    updateBookingMutation.mutate({ id: bookingId, status: newStatus });
  };

  const handleDeleteBooking = (bookingId) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      deleteBookingMutation.mutate(bookingId);
    }
  };

  if (isLoading) return <Box>Loading bookings...</Box>;
  if (error) return <Box>Error loading bookings: {error.message}</Box>;

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
              <Th>ID</Th>
              <Th>User</Th>
              <Th>Service</Th>
              <Th>Status</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {bookings.map((booking) => (
              <Tr key={booking.id}>
                <Td>{booking.id}</Td>
                <Td>{booking.user?.email || 'N/A'}</Td>
                <Td>{booking.service?.name || 'N/A'}</Td>
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
      )}
    </Box>
  );
};

export default React.memo(BookingManagement);