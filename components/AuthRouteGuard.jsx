import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AuthRouteGuard = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <p>Cargando...</p>; // Mostrar mensaje mientras verifica
  }

  const publicRoutes = ["/login", "/register"];

  if (!isAuthenticated && !publicRoutes.includes(location.pathname)) {
    return <Navigate to="/register" />;
  }

  return children;
};

export default AuthRouteGuard;
