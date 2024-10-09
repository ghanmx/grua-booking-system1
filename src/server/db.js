import { supabase } from '../config/supabaseClient';

export const getBookings = async () => {
  const { data, error } = await supabase
    .from('bookings')
    .select('*');

  if (error) throw error;
  return data;
};

const saveDraftBooking = async (draftData) => {
  try {
    const { data, error } = await supabase
      .from('draft_bookings')
      .insert(draftData)
      .select();

    if (error) throw error;
    return data[0];
  } catch (error) {
    logger.error(`Error saving draft booking: ${error.message}`);
    throw error;
  }
};

const createBooking = async (bookingData) => {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .insert(bookingData)
      .select();

    if (error) throw error;
    return data[0];
  } catch (error) {
    logger.error(`Error creating booking: ${error.message}`);
    throw error;
  }
};

const updateBooking = async (id, updateData) => {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .update(updateData)
      .eq('id', id)
      .select();

    if (error) throw error;
    return data[0];
  } catch (error) {
    logger.error(`Error updating booking: ${error.message}`);
    throw error;
  }
};

const deleteBooking = async (id) => {
  try {
    const { error } = await supabase
      .from('bookings')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    logger.error(`Error deleting booking: ${error.message}`);
    throw error;
  }
};

module.exports = {
  getBookings,
  createBooking,
  updateBooking,
  deleteBooking,
  saveDraftBooking
};
