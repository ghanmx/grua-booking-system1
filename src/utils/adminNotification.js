import { supabase } from '../integrations/supabase/index.jsx';

export const sendAdminNotification = async (bookingData, totalCost) => {
  try {
    const notificationData = {
      service_type: bookingData.serviceType,
      user_name: bookingData.userName,
      phone_number: bookingData.phoneNumber,
      vehicle_make: bookingData.vehicleBrand,
      vehicle_model: bookingData.vehicleModel,
      vehicle_size: bookingData.vehicleSize,
      total_cost: totalCost,
      status: 'paid',
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('admin_notifications')
      .insert([notificationData]);

    if (error) throw error;
    console.log('Admin notification sent successfully:', data);

    // Send a real-time notification to admin users
    await supabase
      .from('admin_notifications')
      .on('INSERT', (payload) => {
        // This callback will be triggered when a new notification is inserted
        console.log('New admin notification:', payload.new);
        // Here you can implement additional logic to notify admins in real-time
        // For example, you could use a websocket or push notification service
      })
      .subscribe();

    return data;
  } catch (error) {
    console.error('Error sending admin notification:', error);
    throw new Error('Failed to send admin notification');
  }
};