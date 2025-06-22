import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import styles from "../../styles/Account.module.css"; // Importar los estilos CSS Modules

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
    return (
      <div className={styles.loadingContainer}>
        <p className={styles.loadingText}>Cargando...</p>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className={styles.accountContainer}>
      <div className={styles.accountHeader}>
        <h2 className={styles.title}>Mi Cuenta</h2>
        <p className={styles.welcome}>Bienvenido, {user.name}!</p>
      </div>

      <div className={styles.infoSection}>
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>Nombre:</span>
          <span className={styles.infoValue}>{user.name}</span>
        </div>

        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>Email:</span>
          <span className={styles.infoValue}>{user.email}</span>
        </div>
      </div>

      <button onClick={handleLogout} className={styles.logoutButton}>
        Cerrar Sesión
      </button>
    </div>
  );
};

export default Account;
