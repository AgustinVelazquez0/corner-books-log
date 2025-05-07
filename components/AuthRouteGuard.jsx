import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Componente para proteger rutas y redirigir usuarios no autenticados
const AuthRouteGuard = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Solo verificamos después de que la autenticación se haya cargado
    if (!loading) {
      // Lista de rutas públicas que no requieren autenticación
      const publicRoutes = ["/login", "/register"];

      // Si el usuario no está autenticado y no está en una ruta pública
      if (!isAuthenticated && !publicRoutes.includes(location.pathname)) {
        navigate("/register");
      }
    }
  }, [isAuthenticated, loading, navigate, location.pathname]);

  // Si está cargando, puedes mostrar un spinner o nada
  if (loading) {
    return null; // O un componente de carga
  }

  // Renderiza los hijos cuando la verificación esté completa
  return children;
};

export default AuthRouteGuard;
