import { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from './supabase';
import { useQueryClient } from '@tanstack/react-query';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';

const SupabaseAuthContext = createContext();

export const SupabaseAuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();

  useEffect(() => {
    const setData = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) console.error('Error fetching session:', error);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    };

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      queryClient.invalidateQueries('user');
    });

    setData();

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, [queryClient]);

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  };

  const signup = async (email, password, userData) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
      },
    });
    if (error) throw error;
    
    if (data.user) {
      try {
        const { error: profileError } = await supabase.from('profiles').insert([
          { user_id: data.user.id, ...userData }
        ]);
        if (profileError) throw profileError;
      } catch (profileError) {
        console.error('Error creating profile:', profileError);
        // Consider handling this error, possibly by deleting the created user
      }
    }
    
    return data;
  };

  const logout = () => supabase.auth.signOut();

  return (
    <SupabaseAuthContext.Provider value={{ session, user, loading, login, signup, logout }}>
      {children}
    </SupabaseAuthContext.Provider>
  );
};

export const useSupabaseAuth = () => {
  return useContext(SupabaseAuthContext);
};

export const SupabaseAuthUI = ({ redirectTo }) => (
  <Auth
    supabaseClient={supabase}
    appearance={{ theme: ThemeSupa }}
    theme="dark"
    providers={['google', 'github']}
    redirectTo={redirectTo}
  />
);