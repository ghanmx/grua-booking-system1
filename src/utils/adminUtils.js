import { getUserRole } from '../config/supabase.config';

export const isAdmin = async (userId) => {
  if (!userId) {
    console.warn('No user ID provided for admin check');
    return false;
  }
  try {
    const role = await getUserRole(userId);
    return role === 'admin' || role === 'super_admin';
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};

export const isSuperAdmin = async (userId) => {
  if (!userId) {
    console.warn('No user ID provided for super admin check');
    return false;
  }
  try {
    const role = await getUserRole(userId);
    return role === 'super_admin';
  } catch (error) {
    console.error('Error checking super admin status:', error);
    return false;
  }
};