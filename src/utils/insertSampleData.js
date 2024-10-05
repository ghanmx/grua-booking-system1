import { supabase } from '../config/supabase.config';
import fs from 'fs';
import path from 'path';

const clearAllTables = async () => {
  const tables = ['payments', 'bookings', 'services', 'profiles', 'users'];
  for (const table of tables) {
    const { error } = await supabase.from(table).delete();
    if (error) console.error(`Error clearing table ${table}:`, error);
  }
};

export const resetAndInsertSampleData = async () => {
  try {
    console.log('Clearing all existing data...');
    await clearAllTables();
    
    console.log('Reinserting schema and sample data...');
    const sqlFilePath = path.join(__dirname, '../database/setup.sql');
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
    
    const { data, error } = await supabase.rpc('exec_sql', { sql: sqlContent });
    
    if (error) throw error;
    
    console.log('Database reset and sample data inserted successfully:', data);
  } catch (error) {
    console.error('Error resetting database and inserting sample data:', error);
  }
};