import React, { createContext, useContext } from 'react';
import { createClient } from '@supabase/supabase-js';
import { SupabaseAuthProvider, useSupabaseAuth } from './auth';

const supabaseUrl = import.meta.env.VITE_SUPABASE_PROJECT_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_API_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Add error handling for Supabase operations
export const handleSupabaseError = (error) => {
  console.error('Supabase error:', error);
  // You can add more error handling logic here, such as showing a toast notification
};

const SupabaseContext = createContext();

export const SupabaseProvider = ({ children }) => {
  return (
    <SupabaseContext.Provider value={supabase}>
      {children}
    </SupabaseContext.Provider>
  );
};

export const useSupabase = () => {
  const context = useContext(SupabaseContext);
  if (context === undefined) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }
  return context;
};

export { SupabaseAuthProvider, useSupabaseAuth };