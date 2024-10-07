const supabase = require('../config/database');
const { sendAdminNotification } = require('../../utils/adminNotification');
const { logger } = require('../middleware/errorHandler');
const { body, validationResult } = require('express-validator');

exports.validateBookingInput = [
  body('userName').notEmpty().withMessage('User name is required').isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('phoneNumber').matches(/^\d{10}$/).withMessage('Phone number must be 10 digits'),
  body('serviceType').notEmpty().withMessage('Service type is required'),
  body('pickupAddress').notEmpty().withMessage('Pickup address is required').isLength({ min: 5 }).withMessage('Address must be at least 5 characters'),
  body('dropOffAddress').notEmpty().withMessage('Drop off address is required').isLength({ min: 5 }).withMessage('Address must be at least 5 characters'),
  body('vehicleBrand').notEmpty().withMessage('Vehicle brand is required'),
  body('vehicleModel').notEmpty().withMessage('Vehicle model is required'),
  body('vehicleColor').notEmpty().withMessage('Vehicle color is required'),
  body('licensePlate').notEmpty().withMessage('License plate is required').isLength({ min: 2 }).withMessage('License plate must be at least 2 characters'),
  body('pickupDateTime').isISO8601().toDate().withMessage('Invalid pickup date and time'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

exports.createBooking = async (req, res, next) => {
  try {
    const bookingData = {
      user_id: req.body.userId,
      service_id: req.body.serviceId,
      status: 'pending',
      total_cost: req.body.totalCost,
      payment_status: 'pending',
      pickup_location: req.body.pickupAddress,
      dropoff_location: req.body.dropOffAddress,
      vehicle_brand: req.body.vehicleBrand,
      vehicle_model: req.body.vehicleModel,
      vehicle_color: req.body.vehicleColor,
      license_plate: req.body.licensePlate,
      vehicle_size: req.body.vehicleSize,
      in_neutral: req.body.inNeutral,
      engine_starts: req.body.engineStarts,
      wheels_turn: req.body.wheelsTurn,
      vehicle_position: req.body.vehiclePosition,
      requires_maneuver: req.body.requiresManeuver,
      distance: req.body.distance,
      pickup_datetime: req.body.pickupDateTime,
      additional_details: req.body.additionalDetails
    };

    const { data: createdBooking, error: bookingError } = await supabase
      .from('bookings')
      .insert(bookingData)
      .select();
    
    if (bookingError) throw bookingError;

    logger.info(`New booking created: ${JSON.stringify(createdBooking)}`);
    
    try {
      await sendAdminNotification(createdBooking[0], createdBooking[0].total_cost);
    } catch (notificationError) {
      logger.error(`Failed to send admin notification: ${notificationError.message}`);
      // Continue execution even if notification fails
    }

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      booking: createdBooking[0]
    });
  } catch (error) {
    logger.error(`Error creating booking: ${error.message}`);
    next(error);
  }
};

exports.getAllBookings = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;

    const { data, error, count } = await supabase
      .from('services_logs')
      .select('*, profiles(full_name), services(service_name)', { count: 'exact' })
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
    logger.error(`Error fetching bookings: ${error.message}`);
    next(error);
  }
};

exports.getBookingById = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('services_logs')
      .select('*, profiles(full_name), services(service_name)')
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
    logger.error(`Error fetching booking by ID: ${error.message}`);
    next(error);
  }
};

exports.updateBooking = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('services_logs')
      .update(req.body)
      .eq('id', req.params.id);
    
    if (error) throw error;

    res.status(200).json({
      success: true,
      message: 'Booking updated successfully',
      data: data[0]
    });
  } catch (error) {
    logger.error(`Error updating booking: ${error.message}`);
    next(error);
  }
};

exports.deleteBooking = async (req, res, next) => {
  try {
    const { error } = await supabase
      .from('services_logs')
      .delete()
      .eq('id', req.params.id);
    
    if (error) throw error;

    res.status(200).json({
      success: true,
      message: 'Booking deleted successfully'
    });
  } catch (error) {
    logger.error(`Error deleting booking: ${error.message}`);
    next(error);
  }
};