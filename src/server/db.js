import supabase from '../config/supabase.config';

// User-related functions
export const getUsers = async () => {
  const { data, error } = await supabase
    .from('users')
    .select('id, email, full_name, phone_number, is_admin');
  if (error) throw error;
  return data;
};

export const createUser = async (userData) => {
  const { data, error } = await supabase
    .from('users')
    .insert({
      email: userData.email,
      full_name: userData.fullName,
      phone_number: userData.phoneNumber,
      is_admin: userData.isAdmin || false
    });
  if (error) throw error;
  return data;
};

export const updateUser = async (id, userData) => {
  const { data, error } = await supabase
    .from('users')
    .update(userData)
    .eq('id', id);
  if (error) throw error;
  return data;
};

export const deleteUser = async (id) => {
  const { data, error } = await supabase
    .from('users')
    .delete()
    .eq('id', id);
  if (error) throw error;
  return data;
};

// Service-related functions
export const getServices = async () => {
  const { data, error } = await supabase
    .from('services')
    .select('*');
  if (error) throw error;
  return data;
};

export const createService = async (serviceData) => {
  const { data, error } = await supabase
    .from('services')
    .insert(serviceData);
  if (error) throw error;
  return data;
};

export const updateService = async (id, serviceData) => {
  const { data, error } = await supabase
    .from('services')
    .update(serviceData)
    .eq('id', id);
  if (error) throw error;
  return data;
};

export const deleteService = async (id) => {
  const { data, error } = await supabase
    .from('services')
    .delete()
    .eq('id', id);
  if (error) throw error;
  return data;
};

// Booking-related functions
export const getBookings = async () => {
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      users (id, full_name, email, phone_number),
      services (id, name)
    `);
  if (error) throw error;
  return data;
};

export const createBooking = async (bookingData) => {
  const { data, error } = await supabase
    .from('bookings')
    .insert(bookingData);
  if (error) throw error;
  return data;
};

export const updateBooking = async (id, bookingData) => {
  const { data, error } = await supabase
    .from('bookings')
    .update(bookingData)
    .eq('id', id);
  if (error) throw error;
  return data;
};

export const deleteBooking = async (id) => {
  const { data, error } = await supabase
    .from('bookings')
    .delete()
    .eq('id', id);
  if (error) throw error;
  return data;
};
