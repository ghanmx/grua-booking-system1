import { createClient } from '@supabase/supabase-js';

export const supabaseUrl = 'https://gjwhxrajesykwmomorhw.supabase.co';
export const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdqd2h4cmFqZXN5a3dtb21vcmh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTg4NTYzOTIsImV4cCI6MjAzNDQzMjM5Mn0.fDk88E2zfp64VhiEYL7KCh7KSEF1mNioaII7IaRwRgQ';

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;