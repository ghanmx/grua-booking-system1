import { supabase } from '../config/supabaseClient';

export const getBookings = async () => {
  const { data, error, count } = await supabase
    .from('bookings')
    .select('*', { count: 'exact' });

  if (error) throw error;
  return { data, count };
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
    .insert({
      ...bookingData,
      additional_details: bookingData.additionalDetails,
    })
    .select();

  if (error) throw error;
  return data[0];
};

export const updateBooking = async (id, updateData) => {
  const { data, error } = await supabase
    .from('bookings')
    .update({
      ...updateData,
      additional_details: updateData.additionalDetails,
    })
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

export const getPaidServicesWaiting = async () => {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('payment_status', 'paid')
    .eq('status', 'pending')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const updateServiceStatus = async (id, newStatus) => {
  const { data, error } = await supabase
    .from('bookings')
    .update({ status: newStatus })
    .eq('id', id)
    .select();

  if (error) throw error;
  return data[0];
};