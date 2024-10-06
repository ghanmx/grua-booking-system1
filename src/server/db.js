import { createClient } from '@supabase/supabase-js';
import { supabaseUrl, supabaseKey } from '../config/supabase.config';

const supabase = createClient(supabaseUrl, supabaseKey);

const handleSupabaseError = async (operation) => {
  const maxRetries = 3;
  let retries = 0;

  while (retries < maxRetries) {
    try {
      return await operation();
    } catch (error) {
      console.error('Supabase error:', error);
      retries++;
      if (retries === maxRetries) {
        throw new Error(`Failed after ${maxRetries} attempts: ${error.message}`);
      }
      await new Promise(resolve => setTimeout(resolve, 1000 * retries));
    }
  }
};

export const getBookings = async (page = 1, limit = 10) => {
  return handleSupabaseError(async () => {
    const startIndex = (page - 1) * limit;
    const { data, error, count } = await supabase
      .from('bookings')
      .select(`
        *,
        user:users(id, email),
        service:services(id, name)
      `, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(startIndex, startIndex + limit - 1);
    
    if (error) throw error;
    return { data, count, totalPages: Math.ceil(count / limit) };
  });
};

export const createBooking = async (bookingData) => {
  return handleSupabaseError(async () => {
    const { data, error } = await supabase
      .from('bookings')
      .insert({
        user_id: bookingData.userId,
        service_type: bookingData.serviceType,
        pickup_location: bookingData.pickupAddress,
        dropoff_location: bookingData.dropOffAddress,
        vehicle_details: {
          brand: bookingData.vehicleBrand,
          model: bookingData.vehicleModel,
          color: bookingData.vehicleColor,
          license_plate: bookingData.licensePlate,
          size: bookingData.vehicleSize,
          position: bookingData.vehiclePosition,
          in_neutral: bookingData.inNeutral,
          engine_starts: bookingData.engineStarts,
          wheels_steer: bookingData.wheelsSteer,
        },
        distance: bookingData.distance,
        total_cost: bookingData.totalCost,
        pickup_datetime: bookingData.pickupDateTime,
        additional_details: bookingData.additionalDetails,
        status: 'pending',
        payment_status: 'pending',
      })
      .select();
    
    if (error) throw error;
    return data[0];
  });
};

export const updateBooking = async (id, bookingData) => {
  return handleSupabaseError(async () => {
    const { data, error } = await supabase
      .from('bookings')
      .update(bookingData)
      .eq('id', id)
      .select();
    
    if (error) throw error;

    return data[0];
  });
};

export const deleteBooking = async (id) => {
  return handleSupabaseError(async () => {
    const { error } = await supabase
      .from('bookings')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return { success: true };
  });
};
