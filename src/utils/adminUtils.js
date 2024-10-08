import { supabase } from '../integrations/supabase/supabase';

const getRoleFromDatabase = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('role')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data?.role;
  } catch (error) {
    console.error('Error fetching user role:', error);
    return null;
  }
};

export const isAdmin = async (userId) => {
  const role = await getRoleFromDatabase(userId);
  return role === 'admin' || role === 'super_admin';
};

export const isSuperAdmin = async (userId) => {
  const role = await getRoleFromDatabase(userId);
  return role === 'super_admin';
};