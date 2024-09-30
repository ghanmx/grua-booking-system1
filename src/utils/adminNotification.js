import { supabase } from '../integrations/supabase';

export const sendAdminNotification = async (bookingData, action) => {
  try {
    const notificationData = {
      action,
      booking_id: bookingData.id,
      service_type: bookingData.serviceType,
      user_name: bookingData.userName,
      phone_number: bookingData.phoneNumber,
      vehicle_make: bookingData.vehicleMake,
      vehicle_model: bookingData.vehicleModel,
      vehicle_size: bookingData.vehicleSize,
      total_cost: bookingData.totalCost,
      status: 'active',
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('admin_notifications')
      .insert([notificationData]);

    if (error) throw error;
    console.log(`Admin notification sent: ${action}`, data);
    return data;
  } catch (error) {
    console.error('Error sending admin notification:', error);
    throw new Error('Failed to send admin notification');
  }
};