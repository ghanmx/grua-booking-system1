import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupabaseAuth, SupabaseAuthUI } from '../integrations/supabase/auth.jsx';

const Login = () => {
    const { session } = useSupabaseAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (session) {
            navigate('/');
        }
    }, [session, navigate]);

    return (
        <div>
            <h1>Login</h1>
            <SupabaseAuthUI />
        </div>
    );
};

export default Login;