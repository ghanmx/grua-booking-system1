import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSupabaseAuth } from '../../integrations/supabase/auth';
import { isAdmin, isSuperAdmin } from '../../utils/adminUtils';

const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { session, loading } = useSupabaseAuth();
    const location = useLocation();
    const testModeUser = JSON.parse(localStorage.getItem('testModeUser'));

    const [isAdminUser, setIsAdminUser] = useState(false);
    const [isSuperAdminUser, setIsSuperAdminUser] = useState(false);
    const [isCheckingAdmin, setIsCheckingAdmin] = useState(true);

    useEffect(() => {
        const checkAdminStatus = async () => {
            if (session?.user?.id) {
                try {
                    const adminStatus = await isAdmin(session.user.id);
                    const superAdminStatus = await isSuperAdmin(session.user.id);
                    setIsAdminUser(adminStatus);
                    setIsSuperAdminUser(superAdminStatus);
                } catch (error) {
                    console.error('Error checking admin status:', error);
                }
            }
            setIsCheckingAdmin(false);
        };
        checkAdminStatus();
    }, [session]);

    if (loading || isCheckingAdmin) {
        return <div>Loading...</div>;
    }

    if (!session && !testModeUser?.isTestMode) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (adminOnly && !testModeUser?.isAdmin && !isAdminUser && !isSuperAdminUser) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;