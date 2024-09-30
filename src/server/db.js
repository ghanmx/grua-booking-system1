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

export const createService = async (serviceData) => {
  const { data, error } = await supabase
    .from('services_logs')
    .insert(serviceData);
  if (error) throw error;
  return data;
};

export const createBooking = async (bookingData) => {
  const { data, error } = await supabase
    .from('services_logs')
    .insert(bookingData);
  if (error) throw error;
  return data;
};

// New function to get paid services waiting to be performed
export const getPaidServicesWaiting = async () => {
  const { data, error } = await supabase
    .from('services_logs')
    .select('*')
    .eq('status', 'paid')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

// New function to update service status
export const updateServiceStatus = async (id, newStatus) => {
  const { data, error } = await supabase
    .from('services_logs')
    .update({ status: newStatus })
    .eq('id', id);
  if (error) throw error;
  return data;
};

// Add the missing getBookings function
export const getBookings = async () => {
  const { data, error } = await supabase
    .from('services_logs')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

// Add the missing updateBooking function
export const updateBooking = async (id, bookingData) => {
  const { data, error } = await supabase
    .from('services_logs')
    .update(bookingData)
    .eq('id', id);
  if (error) throw error;
  return data;
};

// Add the missing deleteBooking function
export const deleteBooking = async (id) => {
  const { data, error } = await supabase
    .from('services_logs')
    .delete()
    .eq('id', id);
  if (error) throw error;
  return data;
};