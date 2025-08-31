import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';

interface ProtectedRouteProps {
    children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/signin" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
