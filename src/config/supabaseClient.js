import { createClient } from '@supabase/supabase-js';
import config from '../server/config/config.js';

const supabase = createClient(config.supabaseUrl, config.supabaseKey);

export default supabase;