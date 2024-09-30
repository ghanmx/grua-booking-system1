import supabase from '../config/supabase.config';

// Fetch all users from the Supabase database
export const getUsers = async () => {
  const { data, error } = await supabase.from('users').select('*');
  if (error) throw error;
  return data;
};

// Create a new user in the Supabase database
export const createUser = async (userData) => {
  const { data, error } = await supabase.from('users').insert(userData);
  if (error) throw error;
  return data;
};

// Update an existing user in the Supabase database
export const updateUser = async (id, userData) => {
  const { data, error } = await supabase.from('users').update(userData).eq('id', id);
  if (error) throw error;
  return data;
};

// Delete a user from the Supabase database
export const deleteUser = async (id) => {
  const { data, error } = await supabase.from('users').delete().eq('id', id);
  if (error) throw error;
  return data;
};
