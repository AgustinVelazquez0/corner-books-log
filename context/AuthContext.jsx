// context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from "react";

// Crear el contexto
const AuthContext = createContext();

// Proveedor del contexto
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Cargar el usuario al iniciar
  // En el useEffect, modifica la función fetchUser para agregar logs de depuración:

  useEffect(() => {
    const fetchUser = async () => {
      console.log("Iniciando verificación de token...");
      const token = localStorage.getItem("token");
      console.log("Token en localStorage:", token ? "Existe" : "No existe");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        console.log("Enviando solicitud al endpoint /users/me");
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/users/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("Respuesta recibida:", response.status);

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
          setIsAuthenticated(true);
        } else {
          console.log("Respuesta no exitosa:", response.status);
          // No remover el token inmediatamente, intenta recuperar el mensaje de error
          const errorData = await response.json().catch(() => ({}));
          console.log("Mensaje de error:", errorData);

          // Solo remover el token si es un error de autenticación (401)
          if (response.status === 401) {
            console.log("Eliminando token por error de autenticación");
            localStorage.removeItem("token");
          }
        }
      } catch (error) {
        console.error("Error al obtener usuario:", error);
        // No eliminar el token automáticamente, podría ser un error de red temporal
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Función para iniciar sesión
  const login = (token, userData) => {
    localStorage.setItem("token", token);
    setUser(userData);
    setIsAuthenticated(true);
  };

  // Función para cerrar sesión
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, isAuthenticated, login, logout }}
    >
      {/* Si loading es true, muestra el mensaje de carga, si no, muestra los children */}
      {loading ? <p>Cargando autenticación...</p> : children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useAuth = () => useContext(AuthContext);
