// services/reviewService.js
import axios from "axios";

// Uso correcto de las variables de entorno
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const API_URL = `${BASE_URL}/api`; // Asegúrate de que siempre incluya '/api'

// Obtener el token de autenticación del almacenamiento local
const getAuthToken = () => {
  return localStorage.getItem("token");
};

// Configurar los headers de autenticación
const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Crear una reseña
export const createReview = async (reviewData) => {
  try {
    // Añadimos información del usuario desde localStorage
    const userData = JSON.parse(localStorage.getItem("user")) || {};

    const completeReviewData = {
      ...reviewData,
      userId: userData._id || "guest",
      username: userData.name || "Usuario Anónimo",
    };

    console.log("Datos de la reseña a enviar:", completeReviewData);
    console.log("URL de la petición:", `${API_URL}/reviews`);

    // Enviamos los datos al backend con el token
    const response = await axios.post(
      `${API_URL}/reviews`,
      completeReviewData,
      getAuthHeaders()
    );

    console.log("Respuesta al crear reseña:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error al crear reseña:", error);

    // Información detallada sobre el error
    if (error.response) {
      console.log("Detalles de la respuesta de error:", {
        status: error.response.status,
        data: error.response.data,
      });
      throw error.response.data;
    }
    throw error;
  }
};

// Obtener reseñas de un libro
export const getBookReviews = async (bookId) => {
  try {
    const response = await axios.get(`${API_URL}/reviews/book/${bookId}`);
    return response.data; // Devolver directamente la respuesta completa
  } catch (error) {
    console.error("Error al obtener reseñas del libro:", error);
    throw error.response?.data || error;
  }
};

// Obtener todas las reseñas
export const getAllReviews = async () => {
  try {
    const response = await axios.get(`${API_URL}/reviews`, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Error al obtener todas las reseñas:", error);
    throw error.response?.data || error;
  }
};

// Eliminar una reseña (si implementas esta función)
export const deleteReview = async (reviewId) => {
  try {
    const response = await axios.delete(
      `${API_URL}/reviews/${reviewId}`,
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error("Error al eliminar la reseña:", error);
    throw error.response?.data || error;
  }
};
