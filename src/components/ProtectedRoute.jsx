import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSupabaseAuth } from '../integrations/supabase/auth';

const ProtectedRoute = ({ children }) => {
    const { session, loading } = useSupabaseAuth();
    const location = useLocation();
    const testModeUser = JSON.parse(localStorage.getItem('testModeUser'));

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!session && !testModeUser?.isTestMode) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

export default ProtectedRoute;