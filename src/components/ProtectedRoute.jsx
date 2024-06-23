import { Navigate, useLocation } from 'react-router-dom';
import { useSupabaseAuth } from '../integrations/supabase/auth.jsx';

const ProtectedRoute = ({ children }) => {
    const { session, loading } = useSupabaseAuth();
    const location = useLocation();

    if (loading) {
        return <div>Loading...</div>; // Or some loading spinner
    }

    if (!session) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

export default ProtectedRoute;