// src/pages/Account.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // Importar useAuth

const Account = () => {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirigir si no está autenticado y no está cargando
    if (!loading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, loading, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (loading) {
    return <p>Cargando...</p>;
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Mi Cuenta</h2>
      <p>Bienvenido, {user.name}!</p>
      <p>Email: {user.email}</p>

      <button
        onClick={handleLogout}
        style={{
          backgroundColor: "#f44336",
          color: "white",
          padding: "10px 15px",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          marginTop: "20px",
        }}
      >
        Cerrar Sesión
      </button>
    </div>
  );
};

export default Account;
