import { supabase } from '../config/supabase.config';

const getRoleFromDatabase = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('role')
      .eq('id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        console.warn(`No user found with id: ${userId}`);
        return null;
      }
      throw error;
    }
    return data?.role;
  } catch (error) {
    console.error('Error fetching user role:', error);
    return null;
  }
};

export const isAdmin = async (userId) => {
  if (!userId) {
    console.warn('No user ID provided for admin check');
    return false;
  }
  const role = await getRoleFromDatabase(userId);
  return role === 'admin' || role === 'super_admin';
};

export const isSuperAdmin = async (userId) => {
  if (!userId) {
    console.warn('No user ID provided for super admin check');
    return false;
  }
  const role = await getRoleFromDatabase(userId);
  return role === 'super_admin';
};