import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSupabaseAuth } from '../../integrations/supabase/auth';
import { isAdmin, isSuperAdmin } from '../../utils/adminUtils';

const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { session, loading } = useSupabaseAuth();
    const location = useLocation();
    const testModeUser = JSON.parse(localStorage.getItem('testModeUser'));

    const [isAdminUser, setIsAdminUser] = React.useState(false);
    const [isSuperAdminUser, setIsSuperAdminUser] = React.useState(false);

    React.useEffect(() => {
        const checkAdminStatus = async () => {
            if (session?.user?.id) {
                const adminStatus = await isAdmin(session.user.id);
                const superAdminStatus = await isSuperAdmin(session.user.id);
                setIsAdminUser(adminStatus);
                setIsSuperAdminUser(superAdminStatus);
            }
        };
        checkAdminStatus();
    }, [session]);

    if (loading) {
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