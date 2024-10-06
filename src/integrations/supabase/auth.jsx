import { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from './index.jsx';
import { useQueryClient } from '@tanstack/react-query';
import { login as dbLogin, createAccount } from '../../server/db';

const SupabaseAuthContext = createContext();

export const SupabaseAuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();

  useEffect(() => {
    const getSession = async () => {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setLoading(false);
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      queryClient.invalidateQueries('user');
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [queryClient]);

  const login = async (email, password) => {
    try {
      const { session, user } = await dbLogin(email, password);
      setSession(session);
      setUser(user);
      return { session, user };
    } catch (error) {
      throw error;
    }
  };

  const signup = async (email, password, userData) => {
    try {
      const { user, profile } = await createAccount(email, password, userData);
      setUser(user);
      return { user, profile };
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
    queryClient.invalidateQueries('user');
  };

  return (
    <SupabaseAuthContext.Provider value={{ session, user, loading, login, signup, logout }}>
      {children}
    </SupabaseAuthContext.Provider>
  );
};

export const useSupabaseAuth = () => {
  return useContext(SupabaseAuthContext);
};