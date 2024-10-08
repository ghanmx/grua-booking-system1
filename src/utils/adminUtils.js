import { supabase } from '../integrations/supabase/supabase';

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

    return data?.role === ROLES.SUPER_ADMIN;
  } catch (error) {
    console.error('Error checking super admin status:', error);
    return false;
  }
};

export const getAdminUsers = async () => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .in('role', [ROLES.ADMIN, ROLES.SUPER_ADMIN]);

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error('Error fetching admin users:', error);
    return [];
  }
};

export const setUserRole = async (userId, role) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .update({ role })
      .eq('id', userId);

    if (error) throw error;

    return true;
  } catch (error) {
    console.error('Error updating user role:', error);
    return false;
  }
};