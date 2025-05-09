import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styles from "../../styles/Register.module.css";

const Register = () => {
  const [name, setName] = useState("");
  const [document, setDocument] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const validateForm = () => {
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return false;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return false;
    }

    return true;
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setError(null);
    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, document, email, password }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        navigate("/login"); // ✅ Navegar a la ruta /register
      } else {
        setError(data.message || "Error al registrarse");
      }
    } catch (err) {
      setError("Error al conectarse con el servidor");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.registerContainer}>
      <h2 className={styles.formTitle}>Crear cuenta</h2>

      {error && <div className={styles.errorMessage}>{error}</div>}

      <form onSubmit={handleRegister}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Nombre completo</label>
          <input
            className={styles.inputField}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ingresa tu nombre completo"
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Documento de identidad</label>
          <input
            className={styles.inputField}
            type="text"
            value={document}
            onChange={(e) => setDocument(e.target.value)}
            placeholder="Ingresa tu documento de identidad"
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Correo electrónico</label>
          <input
            className={styles.inputField}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ejemplo@correo.com"
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Contraseña</label>
          <input
            className={styles.inputField}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mínimo 6 caracteres"
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Confirmar contraseña</label>
          <input
            className={styles.inputField}
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repite tu contraseña"
            required
          />
        </div>

        <button
          className={styles.submitButton}
          type="submit"
          disabled={loading}
        >
          {loading ? "Procesando..." : "Registrarme"}
        </button>
      </form>

      <div className={styles.loginPrompt}>
        ¿Ya tienes cuenta?{" "}
        <Link to="/login" className={styles.loginLink}>
          Iniciar sesión
        </Link>
      </div>
    </div>
  );
};

export default Register;
