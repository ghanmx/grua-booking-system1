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

// Services registry log functions
export const getServicesLogs = async () => {
  const { data, error } = await supabase
    .from('services_logs')
    .select('*');
  if (error) throw error;
  return data;
};

export const createServiceLog = async (serviceData) => {
  const { data, error } = await supabase
    .from('services_logs')
    .insert(serviceData);
  if (error) throw error;
  return data;
};

export const updateServiceLog = async (id, serviceData) => {
  const { data, error } = await supabase
    .from('services_logs')
    .update(serviceData)
    .eq('id', id);
  if (error) throw error;
  return data;
};

export const deleteServiceLog = async (id) => {
  const { data, error } = await supabase
    .from('services_logs')
    .delete()
    .eq('id', id);
  if (error) throw error;
  return data;
};

export const createAdminUser = async (userData) => {
  const { data, error } = await supabase
    .from('users')
    .insert({
      email: userData.email,
      full_name: userData.fullName,
      phone_number: userData.phoneNumber,
      is_admin: true
    });
  if (error) throw error;
  return data;
};

// Add the createService function
export const createService = async (serviceData) => {
  const { data, error } = await supabase
    .from('services_logs')
    .insert(serviceData);
  if (error) throw error;
  return data;
};

// Add the createBooking function (assuming it's needed based on the import in BookingForm.jsx)
export const createBooking = async (bookingData) => {
  const { data, error } = await supabase
    .from('bookings')
    .insert(bookingData);
  if (error) throw error;
  return data;
};