import supabase, { handleSupabaseError } from '../integrations/supabase/index.jsx';
import { ROLES } from '../constants/roles';

export const getUsers = async () => {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, user_id, full_name, phone_number, role');
  if (error) handleSupabaseError(error);
  return data;
};

export const createUser = async (userData) => {
  const { data, error } = await supabase
    .from('profiles')
    .insert({
      user_id: userData.userId,
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

export const addSpecificAdmin = async (email) => {
  const { data, error } = await supabase
    .from('profiles')
    .update({ role: ROLES.ADMIN })
    .eq('email', email);
  
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

export const createService = async (serviceData) => {
  const { data, error } = await supabase
    .from('services')
    .insert(serviceData);
  if (error) handleSupabaseError(error);
  return data;
};

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

export const setAdminStatus = async (userId, isAdmin) => {
  const { data, error } = await supabase
    .from('profiles')
    .update({ role: isAdmin ? ROLES.ADMIN : ROLES.USER })
    .eq('user_id', userId);
  
  if (error) handleSupabaseError(error);
  return data;
};