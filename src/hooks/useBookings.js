import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getPaidBookings } from '../server/db';
import { supabase } from '../integrations/supabase/index';

export const useBookings = () => {
  const [bookings, setBookings] = useState([]);

  const { data, isLoading, error } = useQuery({
    queryKey: ['paidBookings'],
    queryFn: getPaidBookings,
  });

  useEffect(() => {
    if (data) {
      setBookings(data);
    }
  }, [data]);

  useEffect(() => {
    const channel = supabase
      .channel('services_logs_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'services_logs' }, (payload) => {
        if (payload.new.status === 'paid') {
          setBookings((prevBookings) => [...prevBookings, payload.new]);
        } else if (payload.eventType === 'UPDATE' && payload.old.status !== 'paid' && payload.new.status === 'paid') {
          setBookings((prevBookings) =>
            prevBookings.map((booking) =>
              booking.id === payload.new.id ? payload.new : booking
            )
          );
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { bookings, isLoading, error };
};