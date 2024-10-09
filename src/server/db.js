const supabase = require('../config/database');
const { logger } = require('../middleware/errorHandler');

const getBookings = async () => {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    logger.error(`Error fetching bookings: ${error.message}`);
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

const saveDraftBooking = async (draftData) => {
  try {
    const { data, error } = await supabase
      .from('booking_drafts')
      .insert({
        user_id: draftData.userId,
        draft_data: draftData,
        created_at: new Date().toISOString(),
      });

    if (error) throw error;
    return data;
  } catch (error) {
    logger.error(`Error saving draft booking: ${error.message}`);
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