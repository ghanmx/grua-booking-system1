import supabase from '../config/supabase.config';
import { ROLES } from '../constants/roles';

// Helper function to handle Supabase errors
const handleSupabaseError = (error) => {
  console.error('Supabase error:', error);
  throw new Error(error.message || 'An unexpected error occurred');
};

// User-related functions
export const getUsers = async () => {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, email, full_name, phone_number, role');
  if (error) handleSupabaseError(error);
  return data;
};

export const createUser = async (userData) => {
  const { data, error } = await supabase
    .from('profiles')
    .insert({
      email: userData.email,
      full_name: userData.fullName,
      phone_number: userData.phoneNumber,
      role: userData.role || ROLES.USER
    });
  if (error) handleSupabaseError(error);
  return data;
};

export const updateUser = async (id, userData) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(userData)
    .eq('id', id);
  if (error) handleSupabaseError(error);
  return data;
};

export const deleteUser = async (id) => {
  const { data, error } = await supabase
    .from('profiles')
    .delete()
    .eq('id', id);
  if (error) handleSupabaseError(error);
  return data;
};

// Services registry log functions
export const getServicesLogs = async () => {
  const { data, error } = await supabase
    .from('services_logs')
    .select('*, profiles(full_name), services(name)');
  if (error) handleSupabaseError(error);
  return data;
};

export const createServiceLog = async (serviceData) => {
  const { data, error } = await supabase
    .from('services_logs')
    .insert(serviceData);
  if (error) handleSupabaseError(error);
  return data;
};

export const updateServiceLog = async (id, serviceData) => {
  const { data, error } = await supabase
    .from('services_logs')
    .update(serviceData)
    .eq('id', id);
  if (error) handleSupabaseError(error);
  return data;
};

export const deleteServiceLog = async (id) => {
  const { data, error } = await supabase
    .from('services_logs')
    .delete()
    .eq('id', id);
  if (error) handleSupabaseError(error);
  return data;
};

export const createAdminUser = async (userData) => {
  const { data, error } = await supabase
    .from('profiles')
    .insert({
      email: userData.email,
      full_name: userData.fullName,
      phone_number: userData.phoneNumber,
      role: ROLES.ADMIN
    });
  if (error) handleSupabaseError(error);
  return data;
};

// Service-related functions
export const createService = async (serviceData) => {
  const { data, error } = await supabase
    .from('services')
    .insert(serviceData);
  if (error) handleSupabaseError(error);
  return data;
};

export const getServices = async () => {
  const { data, error } = await supabase
    .from('services')
    .select('*');
  if (error) handleSupabaseError(error);
  return data;
};

// Booking-related functions
export const createBooking = async (bookingData) => {
  const { data, error } = await supabase
    .from('services_logs')
    .insert(bookingData);
  if (error) handleSupabaseError(error);
  return data;
};

export const getBookings = async () => {
  const { data, error } = await supabase
    .from('services_logs')
    .select('*, profiles(full_name), services(name)')
    .order('created_at', { ascending: false });
  if (error) handleSupabaseError(error);
  return data;
};

export const updateBooking = async (id, bookingData) => {
  const { data, error } = await supabase
    .from('services_logs')
    .update(bookingData)
    .eq('id', id);
  if (error) handleSupabaseError(error);
  return data;
};

export const deleteBooking = async (id) => {
  const { data, error } = await supabase
    .from('services_logs')
    .delete()
    .eq('id', id);
  if (error) handleSupabaseError(error);
  return data;
};

// Analytics function
export const getAnalytics = async () => {
  try {
    const [usersCount, bookingsCount, revenueData] = await Promise.all([
      supabase.from('profiles').select('id', { count: 'exact' }),
      supabase.from('services_logs').select('id', { count: 'exact' }),
      supabase.from('services_logs').select('total_cost')
    ]);

    if (usersCount.error) handleSupabaseError(usersCount.error);
    if (bookingsCount.error) handleSupabaseError(bookingsCount.error);
    if (revenueData.error) handleSupabaseError(revenueData.error);

    const totalRevenue = revenueData.data?.reduce((sum, booking) => sum + (booking.total_cost || 0), 0) || 0;

    return {
      usersCount: usersCount.count,
      bookingsCount: bookingsCount.count,
      totalRevenue
    };
  } catch (error) {
    console.error('Error fetching analytics:', error);
    throw new Error('Failed to fetch analytics data');
  }
};

export const addSpecificAdmin = async (email) => {
  const { data, error } = await supabase
    .from('profiles')
    .upsert({ 
      email, 
      role: ROLES.ADMIN 
    }, { 
      onConflict: 'email' 
    });

  if (error) handleSupabaseError(error);
  return data;
};

export const setAdminStatus = async (userId, isAdmin) => {
  const { data, error } = await supabase
    .from('profiles')
    .update({ role: isAdmin ? ROLES.ADMIN : ROLES.USER })
    .eq('id', userId);
  
  if (error) handleSupabaseError(error);
  return data;
};