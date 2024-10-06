import React, { useEffect } from 'react';
import { Box, VStack, Heading, Table, Thead, Tbody, Tr, Th, Td, Button, Select, useToast } from "@chakra-ui/react";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getBookings, updateBooking, deleteBooking, subscribeToBookings } from '../../server/db';
import { useBookings } from '../../hooks/useBookings';

const BookingManagement = ({ showNotification }) => {
  const queryClient = useQueryClient();
  const toast = useToast();
  const { bookings, isLoading, error } = useBookings();

  useEffect(() => {
    const subscription = subscribeToBookings((payload) => {
      queryClient.invalidateQueries('bookings');
      toast({
        title: 'Actualización de reserva',
        description: `La reserva ${payload.new.id} ha sido actualizada.`,
        status: 'info',
        duration: 3000,
        isClosable: true,
      });
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [queryClient, toast]);

  const updateBookingMutation = useMutation({
    mutationFn: ({ id, status }) => updateBooking(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries('bookings');
      showNotification('Reserva actualizada', 'El estado de la reserva ha sido actualizado con éxito.', 'success');
    },
  });

  const deleteBookingMutation = useMutation({
    mutationFn: deleteBooking,
    onSuccess: () => {
      queryClient.invalidateQueries('bookings');
      showNotification('Reserva eliminada', 'La reserva ha sido eliminada con éxito.', 'success');
    },
  });

  const handleStatusChange = (bookingId, newStatus) => {
    updateBookingMutation.mutate({ id: bookingId, status: newStatus });
  };

  const handleDeleteBooking = (bookingId) => {
    if (window.confirm('¿Está seguro de que desea eliminar esta reserva?')) {
      deleteBookingMutation.mutate(bookingId);
    }
  };

  if (isLoading) return <Box>Cargando reservas...</Box>;
  if (error) return <Box>Error al cargar las reservas: {error.message}</Box>;
  if (!bookings || bookings.length === 0) return <Box>No se encontraron reservas.</Box>;

  return (
    <Box>
      <Heading as="h2" size="lg" mb={4}>Gestión de Reservas</Heading>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>Usuario</Th>
            <Th>Servicio</Th>
            <Th>Estado</Th>
            <Th>Acciones</Th>
          </Tr>
        </Thead>
        <Tbody>
          {bookings.map((booking) => (
            <Tr key={booking.id}>
              <Td>{booking.id}</Td>
              <Td>{booking.profiles?.full_name || booking.users?.full_name}</Td>
              <Td>{booking.services?.name}</Td>
              <Td>
                <Select
                  value={booking.status}
                  onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                >
                  <option value="pending">Pendiente</option>
                  <option value="confirmed">Confirmado</option>
                  <option value="completed">Completado</option>
                  <option value="cancelled">Cancelado</option>
                </Select>
              </Td>
              <Td>
                <Button
                  colorScheme="red"
                  size="sm"
                  onClick={() => handleDeleteBooking(booking.id)}
                >
                  Eliminar
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default React.memo(BookingManagement);