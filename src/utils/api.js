import { supabase } from '../config/supabase.config';

export const saveSMTPSettings = async (settings) => {
  const { data, error } = await supabase
    .from('smtp_settings')
    .upsert([settings], { onConflict: 'user_id' });

  if (error) throw error;
  return data;
};