import supabase from '../config/supabase.config';

export const getUsers = async () => {
  const { data, error } = await supabase.from('users').select('*');
  if (error) throw error;
  return data;
};

export const createUser = async (userData) => {
  const { data, error } = await supabase.from('users').insert(userData);
  if (error) throw error;
  return data;
};

export const updateUser = async (id, userData) => {
  const { data, error } = await supabase.from('users').update(userData).eq('id', id);
  if (error) throw error;
  return data;
};

export const deleteUser = async (id) => {
  const { data, error } = await supabase.from('users').delete().eq('id', id);
  if (error) throw error;
  return data;
};