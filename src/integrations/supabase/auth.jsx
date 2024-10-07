import { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from './index.jsx';
import { useQueryClient } from '@tanstack/react-query';
import { login as dbLogin, createAccount, logout as dbLogout, getCurrentUser } from '../../server/db';

const SupabaseAuthContext = createContext();

export const SupabaseAuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();

  useEffect(() => {
    const initializeAuth = async () => {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      if (session) {
        const currentUser = await getCurrentUser();
        if (currentUser) {
          setUser(currentUser.user);
          setProfile(currentUser.profile);
        }
      }
      setLoading(false);
    };

    initializeAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      if (session) {
        const currentUser = await getCurrentUser();
        if (currentUser) {
          setUser(currentUser.user);
          setProfile(currentUser.profile);
        }
      } else {
        setUser(null);
        setProfile(null);
      }
      queryClient.invalidateQueries('user');
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [queryClient]);

  const login = async (email, password) => {
    try {
      const result = await dbLogin(email, password);
      if (result && result.session) {
        setSession(result.session);
        setUser(result.user);
        setProfile(result.profile);
        return result;
      } else {
        throw new Error('Invalid login response');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const signup = async (email, password, userData) => {
    try {
      const { user, profile } = await createAccount(email, password, userData);
      setUser(user);
      setProfile(profile);
      return { user, profile };
    } catch (error) {
      if (error.message.includes('For security purposes, you can only request this after')) {
        throw new Error('Too many signup attempts. Please try again later.');
      }
      throw error;
    }
  };

  const logout = async () => {
    await dbLogout();
    setSession(null);
    setUser(null);
    setProfile(null);
    queryClient.invalidateQueries('user');
  };

  return (
    <SupabaseAuthContext.Provider value={{ session, user, profile, loading, login, signup, logout }}>
      {children}
    </SupabaseAuthContext.Provider>
  );
};

export const useSupabaseAuth = () => {
  return useContext(SupabaseAuthContext);
};