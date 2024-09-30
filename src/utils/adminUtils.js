import supabase from '../config/supabase.config';

export const isAdmin = async (userId) => {
  const { data, error } = await supabase
    .from('users')
    .select('is_admin')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error checking admin status:', error);
    return false;
  }

  return data?.is_admin || false;
};

export const getAdminUsers = async () => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('is_admin', true);

  if (error) {
    console.error('Error fetching admin users:', error);
    return [];
  }

  return data || [];
};

export const setAdminStatus = async (userId, isAdmin) => {
  const { data, error } = await supabase
    .from('users')
    .update({ is_admin: isAdmin })
    .eq('id', userId);

  if (error) {
    console.error('Error updating admin status:', error);
    return false;
  }

  return true;
};