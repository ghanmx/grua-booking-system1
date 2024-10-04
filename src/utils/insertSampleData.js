import { supabase } from '../config/supabase.config';
import fs from 'fs';
import path from 'path';

export const insertSampleData = async () => {
  try {
    const sqlFilePath = path.join(__dirname, '../database/sample_data.sql');
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
    
    const { data, error } = await supabase.rpc('exec_sql', { sql: sqlContent });
    
    if (error) throw error;
    
    console.log('Sample data inserted successfully:', data);
  } catch (error) {
    console.error('Error inserting sample data:', error);
  }
};