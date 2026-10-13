import { Navigate, useLocation } from "react-router-dom";
import {useAuth} from '../context/AuthContext.jsx';

const ProtectedRoute = ({ children, roles = [] }) => {
  const location = useLocation();
  const { user, token } = useAuth();

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (roles.length > 0 && !roles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;