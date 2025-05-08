import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "/context/AuthContext";
import styles from "../../styles/Login.module.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // ⬅️ Nuevo estado
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true); // ⬅️ Activamos loading

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        login(data.token, data.user);
        navigate("/account");
      } else {
        setError(data.message || "Error al iniciar sesión");
      }
    } catch (err) {
      setError("Error al conectarse con el servidor");
      console.error(err);
    } finally {
      setLoading(false); // ⬅️ Desactivamos loading
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Iniciar Sesión</h2>
      {error && <p className={styles.error}>{error}</p>}
      {loading && <div className={styles.spinner}></div>}{" "}
      {/* ⬅️ Indicador de carga */}
      <form onSubmit={handleLogin} className={styles.form}>
        <div className={styles.group}>
          <label htmlFor="email">Correo electrónico:</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <div className={styles.group}>
          <label htmlFor="password">Contraseña:</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <button type="submit" className={styles.button} disabled={loading}>
          {loading ? "Cargando..." : "Iniciar Sesión"}
        </button>
      </form>
      <p className={styles.register}>
        ¿No tenés una cuenta?
        <Link to="/register">Registrate acá</Link>
      </p>
    </div>
  );
};

export default Login;
