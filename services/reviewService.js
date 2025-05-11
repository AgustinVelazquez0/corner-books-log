import axios from "axios";

// Ajusta la URL base de la API según tu configuración
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const API_URL = `${BASE_URL}/api`;

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
    console.log("Enviando reseña:", { bookId, rating, comment });

    if (!bookId || !rating || !comment) {
      throw new Error("bookId, rating y comment son obligatorios.");
    }

    try {
      // Usamos directamente el ID tal como viene, el backend se encargará de validarlo
      const response = await authAxios.post(`${API_URL}/reviews`, {
        bookId,
        rating,
        comment,
      });

      return response.data;
    } catch (error) {
      console.error("Error al crear la reseña:", error);
      if (error.response?.status === 404) {
        throw new Error("El libro no fue encontrado. Verifica el ID.");
      } else if (error.response?.status === 401) {
        throw new Error("Debes iniciar sesión para dejar una reseña.");
      }
      throw error.response?.data || new Error(error.message);
    }
  },

  // Obtener todas las reseñas de un libro
  getBookReviews: async (bookId) => {
    if (!bookId) {
      throw new Error("El bookId es obligatorio.");
    }

    try {
      console.log(`Obteniendo reseñas para el libro con ID: ${bookId}`);
      const response = await axios.get(`${API_URL}/reviews/${bookId}`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener reseñas:", error);
      if (error.response?.status === 404) {
        // No es un error crítico si no hay reseñas
        return { reviews: [] };
      }
      throw error.response?.data || new Error(error.message);
    }
  },

  // Actualizar una reseña
  updateReview: async (reviewId, rating, comment) => {
    if (!reviewId || !rating || !comment) {
      throw new Error("reviewId, rating y comment son obligatorios.");
    }

    try {
      const response = await authAxios.put(`${API_URL}/reviews/${reviewId}`, {
        rating,
        comment,
      });
      return response.data;
    } catch (error) {
      console.error("Error al actualizar la reseña:", error);
      throw error.response?.data || new Error(error.message);
    }
  },

  // Eliminar una reseña
  deleteReview: async (reviewId) => {
    if (!reviewId) {
      throw new Error("El reviewId es obligatorio.");
    }

    try {
      const response = await authAxios.delete(`${API_URL}/reviews/${reviewId}`);
      return response.data;
    } catch (error) {
      console.error("Error al eliminar la reseña:", error);
      throw error.response?.data || new Error(error.message);
    }
  },

  // Obtener las reseñas del usuario actual
  getUserReviews: async () => {
    try {
      const response = await authAxios.get(`${API_URL}/reviews/user`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener las reseñas del usuario:", error);
      throw error.response?.data || new Error(error.message);
    }
  },
};

export default reviewService;
