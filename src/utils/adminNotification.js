import { supabase } from '../integrations/supabase';

export const sendAdminNotification = async (formData, totalCost) => {
  try {
    const { data, error } = await supabase
      .from('admin_notifications')
      .insert([
        {
          service_type: formData.serviceType,
          user_name: formData.userName,
          phone_number: formData.phoneNumber,
          vehicle_make: formData.vehicleMake,
          vehicle_model: formData.vehicleModel,
          vehicle_size: formData.vehicleSize,
          total_cost: totalCost,
          status: 'paid',
          created_at: new Date().toISOString()  // Ensuring the notification has a timestamp
        }
      ]);

    if (error) throw error;
    console.log('Admin notification sent successfully:', data);
    return data; // Return data for further use if needed
  } catch (error) {
    console.error('Error sending admin notification:', error);
    throw new Error('Failed to send admin notification'); // Ensure error is propagated
  }
};
