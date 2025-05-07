import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [name, setName] = useState("");
  const [document, setDocument] = useState(""); // Añadir estado para document
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch("http://localhost:5000/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, document, email, password }), // Incluir document
      });

      const data = await response.json();

      if (response.ok) {
        // Guardar token si lo devuelve, o redirigir al login
        if (data.token) {
          localStorage.setItem("token", data.token);
          navigate("/account"); // Redirigir directamente si ya está logueado
        } else {
          navigate("/login");
        }
      } else {
        setError(data.message || "Error al registrarse");
      }
    } catch (err) {
      setError("Error al conectarse con el servidor");
      console.error(err);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Crear cuenta</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleRegister}>
        <div>
          <label>Nombre:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        {/* Añadir campo de documento */}
        <div>
          <label>Documento de identidad:</label>
          <input
            type="text"
            value={document}
            onChange={(e) => setDocument(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Correo electrónico:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Contraseña:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Registrarme</button>
      </form>
    </div>
  );
};

export default Register;
