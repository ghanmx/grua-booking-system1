const supabase = require('../db');
const { sendAdminNotification } = require('../../utils/adminNotification');

exports.createBooking = async (req, res) => {
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
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getAllBookings = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*');
    
    if (error) throw error;

    console.log(`Retrieved ${data.length} bookings`);

    res.status(200).json({
      success: true,
      count: data.length,
      data: data
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getBookingById = async (req, res) => {
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
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateBooking = async (req, res) => {
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
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.deleteBooking = async (req, res) => {
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
    res.status(500).json({ success: false, error: error.message });
  }
};