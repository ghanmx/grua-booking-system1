import supabase from '../config/supabase.config';

const handleSupabaseError = async (operation, entityName) => {
  const maxRetries = 3;
  let retries = 0;

  while (retries < maxRetries) {
    try {
      const result = await operation();
      return result;
    } catch (error) {
      console.error(`Supabase error (${entityName}):`, error);
      retries++;
      if (retries === maxRetries) {
        throw new Error(`Failed after ${maxRetries} attempts: ${error.message}`);
      }
      await new Promise(resolve => setTimeout(resolve, 1000 * retries));
    }
  }
};

export const getUsers = async (page = 1, limit = 10) => {
  return handleSupabaseError(async () => {
    const startIndex = (page - 1) * limit;
    const { data, error, count } = await supabase
      .from('users')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(startIndex, startIndex + limit - 1);
    
    if (error) throw new Error(`Failed to fetch users: ${error.message}`);
    if (!data) throw new Error('No user data returned from Supabase');
    
    return { data, count, totalPages: Math.ceil(count / limit) };
  }, 'users');
};

export const getBookings = async (page = 1, limit = 10) => {
  return handleSupabaseError(async () => {
    const startIndex = (page - 1) * limit;
    const { data, error, count } = await supabase
      .from('bookings')
      .select(`
        *,
        users (id, email),
        services (id, name, tow_truck_type)
      `, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(startIndex, startIndex + limit - 1);
    
    if (error) throw new Error(`Failed to fetch bookings: ${error.message}`);
    if (!data) throw new Error('No booking data returned from Supabase');
    
    return { data, count, totalPages: Math.ceil(count / limit) };
  }, 'bookings');
};

export const getServices = async () => {
  return handleSupabaseError(async () => {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('name', { ascending: true });
    
    if (error) throw new Error(`Failed to fetch services: ${error.message}`);
    if (!data) throw new Error('No service data returned from Supabase');
    
    return data;
  }, 'services');
};

export const createBooking = async (bookingData) => {
  return handleSupabaseError(async () => {
    const { data, error } = await supabase
      .from('bookings')
      .insert(bookingData)
      .select();
    if (error) throw new Error(`Failed to create booking: ${error.message}`);
    return data[0];
  }, 'bookings');
};

export const updateBooking = async (id, bookingData) => {
  return handleSupabaseError(async () => {
    const { data, error } = await supabase
      .from('bookings')
      .update(bookingData)
      .eq('id', id)
      .select();
    if (error) throw new Error(`Failed to update booking: ${error.message}`);
    return data[0];
  }, 'bookings');
};

export const deleteBooking = async (id) => {
  return handleSupabaseError(async () => {
    const { error } = await supabase
      .from('bookings')
      .delete()
      .eq('id', id);
    if (error) throw new Error(`Failed to delete booking: ${error.message}`);
    return { success: true };
  }, 'bookings');
};

export const createPayment = async (paymentData) => {
  return handleSupabaseError(async () => {
    const { data, error } = await supabase
      .from('payments')
      .insert(paymentData)
      .select();
    if (error) throw new Error(`Failed to create payment: ${error.message}`);
    return data[0];
  }, 'payments');
};

export const updatePayment = async (id, paymentData) => {
  return handleSupabaseError(async () => {
    const { data, error } = await supabase
      .from('payments')
      .update(paymentData)
      .eq('id', id)
      .select();
    if (error) throw new Error(`Failed to update payment: ${error.message}`);
    return data[0];
  }, 'payments');
};