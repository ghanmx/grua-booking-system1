const supabase = require('../config/database');
const { sendAdminNotification } = require('../../utils/adminNotification');
const { logger } = require('../middleware/errorHandler');

exports.createBooking = async (req, res, next) => {
  try {
    const bookingData = req.body;

    // Create booking
    const { data: createdBooking, error: bookingError } = await supabase
      .from('services_logs')
      .insert(bookingData);
    
    if (bookingError) throw bookingError;

    logger.info(`New booking created: ${JSON.stringify(createdBooking)}`);
    await sendAdminNotification(createdBooking[0], createdBooking[0].total_cost);

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      booking: createdBooking[0]
    });
  } catch (error) {
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

    res.status(200).json({
      success: true,
      count,
      data,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (error) {
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
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
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

    res.status(200).json({
      success: true,
      message: 'Booking updated successfully',
      data: data[0]
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteBooking = async (req, res, next) => {
  try {
    const { error } = await supabase
      .from('bookings')
      .delete()
      .eq('id', req.params.id);
    
    if (error) throw error;

    res.status(200).json({
      success: true,
      message: 'Booking deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};