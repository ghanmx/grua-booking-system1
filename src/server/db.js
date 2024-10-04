import supabase, { handleSupabaseError } from '../integrations/supabase/index.jsx';
import { ROLES } from '../constants/roles';

export const getUsers = async () => {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, user_id, full_name, email, role');
  if (error) handleSupabaseError(error);
  return data;
};

export const createUser = async (userData) => {
  const { data, error } = await supabase
    .from('profiles')
    .insert({
      user_id: userData.userId,
      full_name: userData.fullName,
      email: userData.email,
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

export const setAdminStatus = async (userId, isAdmin) => {
  const { data, error } = await supabase
    .from('profiles')
    .update({ role: isAdmin ? ROLES.ADMIN : ROLES.USER })
    .eq('user_id', userId);
  
  if (error) handleSupabaseError(error);
  return data;
};