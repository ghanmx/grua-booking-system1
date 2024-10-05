import React, { createContext, useContext } from 'react';
import supabase from '../../config/supabase.config';

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

export { supabase };