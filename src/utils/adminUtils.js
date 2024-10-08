import { supabase } from '../config/supabase.config';

export const ROLES = {
  USER: 'user',
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin'
};

export const isAdmin = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('role')
      .eq('id', userId)
      .single();

    if (error) throw error;

    console.log('User role:', data?.role);
    return data?.role === ROLES.ADMIN || data?.role === ROLES.SUPER_ADMIN;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};

export const isSuperAdmin = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('role')
      .eq('id', userId)
      .single();

    if (error) throw error;

    console.log('User role:', data?.role);
    return data?.role === ROLES.SUPER_ADMIN;
  } catch (error) {
    console.error('Error checking super admin status:', error);
    return false;
  }
};

export const getAdminUsers = async () => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .in('role', [ROLES.ADMIN, ROLES.SUPER_ADMIN]);

  if (error) {
    console.error('Error fetching admin users:', error);
    return [];
  }

  return data || [];
};

export const setUserRole = async (userId, role) => {
  const { data, error } = await supabase
    .from('users')
    .update({ role })
    .eq('id', userId);

  if (error) {
    console.error('Error updating user role:', error);
    return false;
  }

  return true;
};
