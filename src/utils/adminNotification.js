import { supabase } from '../integrations/supabase';

export const sendAdminNotification = async (formData, totalCost, isTestMode = false) => {
  try {
    const notificationData = {
      service_type: formData.serviceType,
      user_name: formData.userName,
      phone_number: formData.phoneNumber,
      vehicle_make: formData.vehicleMake,
      vehicle_model: formData.vehicleModel,
      vehicle_size: formData.vehicleSize,
      total_cost: totalCost,
      status: isTestMode ? 'test_mode' : 'paid',
      created_at: new Date().toISOString(),
      is_test_mode: isTestMode
    };

    const { data, error } = await supabase
      .from('admin_notifications')
      .insert([notificationData]);

    if (error) throw error;
    console.log('Admin notification sent successfully:', data);
    return data;
  } catch (error) {
    console.error('Error sending admin notification:', error);
    throw new Error('Failed to send admin notification');
  }
};