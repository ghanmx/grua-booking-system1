import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSupabaseAuth } from '../../integrations/supabase/auth';
import { getUserRole } from '../../config/supabaseClient';

const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { session, loading } = useSupabaseAuth();
    const location = useLocation();
    const [userRole, setUserRole] = useState(null);
    const [isCheckingRole, setIsCheckingRole] = useState(true);

    useEffect(() => {
        const checkUserRole = async () => {
            if (session?.user?.id) {
                try {
                    const role = await getUserRole(session.user.id);
                    setUserRole(role);
                } catch (error) {
                    console.error('Error checking user role:', error);
                }
            }
            setIsCheckingRole(false);
        };
        checkUserRole();
    }, [session]);

    if (loading || isCheckingRole) {
        return <div>Loading...</div>;
    }

    if (!session) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (adminOnly && userRole !== 'admin' && userRole !== 'super_admin') {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;