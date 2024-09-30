const supabase = require('../config/supabase.config').default;

const getUsers = async () => {
  const { data, error } = await supabase.from('users').select('*');
  if (error) throw error;
  return data;
};

const createUser = async (userData) => {
  const { data, error } = await supabase.from('users').insert(userData);
  if (error) throw error;
  return data;
};

const updateUser = async (id, userData) => {
  const { data, error } = await supabase.from('users').update(userData).eq('id', id);
  if (error) throw error;
  return data;
};

const deleteUser = async (id) => {
  const { data, error } = await supabase.from('users').delete().eq('id', id);
  if (error) throw error;
  return data;
};

module.exports = {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
};