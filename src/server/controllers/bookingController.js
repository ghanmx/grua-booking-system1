const supabase = require('../db');
const { sendAdminNotification } = require('../../utils/adminNotification');
const { logger } = require('../middleware/errorHandler');

exports.createBooking = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .insert(req.body);
    
    if (error) throw error;

    console.log(`New booking created: ${JSON.stringify(data)}`);
    await sendAdminNotification(data[0], 'New booking created');

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: data[0]
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    logger.error('Error creating booking:', error);
    next(error);
  }
};

exports.getAllBookings = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;

    const { data, error, count } = await supabase
      .from('bookings')
      .select('*', { count: 'exact' })
      .range(startIndex, startIndex + limit - 1);
    
    if (error) throw error;

    logger.info(`Retrieved ${data.length} bookings`);

    res.status(200).json({
      success: true,
      count: count,
      data: data,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (error) {
    logger.error('Error fetching bookings:', error);
    next(error);
  }
};

exports.getBookingById = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', req.params.id)
      .single();
    
    if (error) throw error;
    if (!data) {
      console.log(`Booking not found: ${req.params.id}`);
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    console.log(`Retrieved booking: ${JSON.stringify(data)}`);

    res.status(200).json({
      success: true,
      data: data
    });
  } catch (error) {
    console.error(`Error fetching booking ${req.params.id}:`, error);
    logger.error(`Error fetching booking ${req.params.id}:`, error);
    next(error);
  }
};

exports.updateBooking = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .update(req.body)
      .eq('id', req.params.id);
    
    if (error) throw error;

    console.log(`Updated booking ${req.params.id}: ${JSON.stringify(data)}`);
    await sendAdminNotification(data[0], 'Booking updated');

    res.status(200).json({
      success: true,
      message: 'Booking updated successfully',
      data: data[0]
    });
  } catch (error) {
    console.error(`Error updating booking ${req.params.id}:`, error);
    logger.error(`Error updating booking ${req.params.id}:`, error);
    next(error);
  }
};

exports.deleteBooking = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .delete()
      .eq('id', req.params.id);
    
    if (error) throw error;

    console.log(`Deleted booking: ${req.params.id}`);
    await sendAdminNotification({ id: req.params.id }, 'Booking deleted');

    res.status(200).json({
      success: true,
      message: 'Booking deleted successfully'
    });
  } catch (error) {
    console.error(`Error deleting booking ${req.params.id}:`, error);
    logger.error(`Error deleting booking ${req.params.id}:`, error);
    next(error);
  }
};
