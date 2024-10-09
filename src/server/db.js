import { supabase } from '../config/supabaseClient';

export const getBookings = async (page = 1, limit = 50) => {
  const start = (page - 1) * limit;
  const end = start + limit - 1;

  const { data, error, count } = await supabase
    .from('bookings')
    .select('*', { count: 'exact' })
    .range(start, end);

  if (error) throw error;
  return { data, count, page, limit };
};

export const saveDraftBooking = async (draftData) => {
  const { data, error } = await supabase
    .from('draft_bookings')
    .insert(draftData)
    .select();

  if (error) throw error;
  return data[0];
};

export const createBooking = async (bookingData) => {
  const { data, error } = await supabase
    .from('bookings')
    .insert(bookingData)
    .select();

  if (error) throw error;
  return data[0];
};

export const updateBooking = async (id, updateData) => {
  const { data, error } = await supabase
    .from('bookings')
    .update(updateData)
    .eq('id', id)
    .select();

  if (error) throw error;
  return data[0];
};

export const deleteBooking = async (id) => {
  const { error } = await supabase
    .from('bookings')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
};