import { getUserRole } from '../config/supabase.config';

export const isAdmin = async (userId) => {
  if (!userId) {
    console.warn('No user ID provided for admin check');
    return false;
  }
  const role = await getUserRole(userId);
  return role === 'admin' || role === 'super_admin';
};

export const isSuperAdmin = async (userId) => {
  if (!userId) {
    console.warn('No user ID provided for super admin check');
    return false;
  }
  const role = await getUserRole(userId);
  return role === 'super_admin';
};