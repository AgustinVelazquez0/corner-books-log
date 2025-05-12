// services/reviewService.js
import axios from "axios";

// Asumiendo que tienes una variable de entorno para la URL base de la API
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Obtiene el token de autenticación del localStorage
const getToken = () => {
  return localStorage.getItem("token");
};

// Configura los headers para las peticiones autenticadas
const getAuthHeaders = () => {
  const token = getToken();
  return {
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
};

const reviewService = {
  // Obtener todas las reseñas de un libro
  getBookReviews: async (bookId) => {
    try {
      console.log(`Obteniendo reseñas para el libro con ID: ${bookId}`);
      const response = await axios.get(`${API_URL}/reviews/book/${bookId}`);
      console.log("Respuesta de reseñas:", response.data);
      return response.data; // Asegúrate de que esto devuelva un array
    } catch (error) {
      console.error("Error al obtener reseñas:", error);
      throw error.response?.data || error.message;
    }
  },

  // Crear una nueva reseña
  createReview: async (bookId, rating, comment) => {
    try {
      console.log(`Creando reseña para el libro con ID: ${bookId}`);
      const reviewData = { bookId, rating, comment };
      console.log("Datos de la reseña a enviar:", reviewData);

      const response = await axios.post(
        `${API_URL}/reviews`,
        reviewData,
        getAuthHeaders()
      );

      console.log("Respuesta al crear reseña:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error al crear reseña:", error);
      throw error.response?.data || error.message;
    }
  },

  // Eliminar una reseña
  deleteReview: async (reviewId) => {
    try {
      console.log(`Eliminando reseña con ID: ${reviewId}`);
      const response = await axios.delete(
        `${API_URL}/reviews/${reviewId}`,
        getAuthHeaders()
      );
      console.log("Respuesta al eliminar reseña:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error al eliminar reseña:", error);
      throw error.response?.data || error.message;
    }
  },
};

export default reviewService;
