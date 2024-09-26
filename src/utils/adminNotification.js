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
          status: 'paid'
        }
      ]);

    if (error) throw error;
    console.log('Admin notification sent successfully');
  } catch (error) {
    console.error('Error sending admin notification:', error);
  }
};