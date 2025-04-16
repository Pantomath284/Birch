
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireVerified?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireVerified = false 
}) => {
  const { user, loading, isVerified } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  // If verification is required and user is not verified
  if (requireVerified && !isVerified) {
    return <Navigate to="/verify-email" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
