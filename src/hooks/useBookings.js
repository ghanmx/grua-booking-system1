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
    const subscription = supabase
      .from('services_logs')
      .on('INSERT', (payload) => {
        if (payload.new.status === 'paid') {
          setBookings((prevBookings) => [...prevBookings, payload.new]);
        }
      })
      .on('UPDATE', (payload) => {
        if (payload.new.status === 'paid') {
          setBookings((prevBookings) =>
            prevBookings.map((booking) =>
              booking.id === payload.new.id ? payload.new : booking
            )
          );
        }
      })
      .subscribe();

    return () => {
      supabase.removeSubscription(subscription);
    };
  }, []);

  return { bookings, isLoading, error };
};