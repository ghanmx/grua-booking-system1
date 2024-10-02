import supabase from '../config/supabase.config';

export const ROLES = {
  USER: 'user',
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin'
};

export const isAdmin = async (userId) => {
  const { data, error } = await supabase
    .from('users')
    .select('role')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error checking admin status:', error);
    return false;
  }

  return data?.role === ROLES.ADMIN || data?.role === ROLES.SUPER_ADMIN;
};

export const isSuperAdmin = async (userId) => {
  const { data, error } = await supabase
    .from('users')
    .select('role')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error checking super admin status:', error);
    return false;
  }

  return data?.role === ROLES.SUPER_ADMIN;
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