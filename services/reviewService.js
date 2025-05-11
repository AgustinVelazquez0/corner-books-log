import axios from "axios";

// Ajusta la URL base de la API según tu configuración
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Configurar axios para incluir el token en cada solicitud
const authAxios = axios.create();

authAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Servicio para gestionar las reseñas
const reviewService = {
  // Crear una nueva reseña
  createReview: async (bookId, rating, comment) => {
    try {
      const response = await authAxios.post(`${API_URL}/reviews`, {
        bookId,
        rating,
        comment,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Obtener todas las reseñas de un libro
  getBookReviews: async (bookId) => {
    try {
      const response = await axios.get(`${API_URL}/reviews/book/${bookId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Actualizar una reseña
  updateReview: async (reviewId, rating, comment) => {
    try {
      const response = await authAxios.put(`${API_URL}/reviews/${reviewId}`, {
        rating,
        comment,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Eliminar una reseña
  deleteReview: async (reviewId) => {
    try {
      const response = await authAxios.delete(`${API_URL}/reviews/${reviewId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Obtener las reseñas del usuario actual
  getUserReviews: async () => {
    try {
      const response = await authAxios.get(`${API_URL}/reviews/user`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default reviewService;
