import axios from "axios";
import books from "../data/books.json";

// Ajusta la URL base de la API según tu configuración
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const API_URL = `${BASE_URL}/api`; // Aseguramos el prefijo /api

// Axios personalizado que incluye el token JWT en las solicitudes
const authAxios = axios.create();

authAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Servicio para manejar reseñas
const reviewService = {
  // Crear una reseña
  createReview: async (bookTitle, rating, comment) => {
    const book = books.find(
      (b) => b.title.toLowerCase() === bookTitle.toLowerCase()
    );

    if (!book) {
      throw new Error("Libro no encontrado.");
    }

    const bookId = book._id;

    if (!bookId || !rating || !comment) {
      throw new Error("bookId, rating y comment son obligatorios.");
    }

    try {
      const response = await authAxios.post(`${API_URL}/reviews`, {
        bookId,
        rating,
        comment,
      });
      return response.data;
    } catch (error) {
      console.error("Error al crear la reseña:", error);
      throw error.response?.data || error.message;
    }
  },

  // Obtener reseñas de un libro
  getBookReviews: async (bookId) => {
    if (!bookId) {
      throw new Error("El bookId es obligatorio.");
    }

    try {
      const response = await axios.get(`${API_URL}/reviews/book/${bookId}`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener reseñas:", error);
      throw error.response?.data || error.message;
    }
  },

  // Actualizar una reseña existente
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
      throw error.response?.data || error.message;
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
      throw error.response?.data || error.message;
    }
  },

  // Obtener reseñas del usuario autenticado
  getUserReviews: async () => {
    try {
      const response = await authAxios.get(`${API_URL}/reviews/user`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener las reseñas del usuario:", error);
      throw error.response?.data || error.message;
    }
  },
};

export default reviewService;
