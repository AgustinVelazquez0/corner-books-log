import axios from "axios";

// Ajusta la URL base de la API según tu configuración
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const API_URL = `${BASE_URL}/api`; // Añade /api aquí

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
    console.log("API URL being used:", `${API_URL}/reviews`);
    console.log("bookId siendo enviado:", bookId, "tipo:", typeof bookId);

    // Validación simple de los parámetros
    if (!bookId || !rating || !comment) {
      throw new Error("bookId, rating y comment son obligatorios.");
    }

    try {
      // Validación adicional para asegurarse de que bookId es un string
      const bookIdStr = bookId;

      console.log("bookId después de conversión:", bookIdStr);

      // Luego lo envías como en tu código actual:
      const response = await authAxios.post(`${API_URL}/reviews`, {
        bookId: bookIdStr,
        rating,
        comment,
      });

      return response.data;
    } catch (error) {
      // Mejor manejo de errores con detalles específicos
      console.error("Error al crear la reseña:", error);
      throw error.response?.data || error.message;
    }
  },

  // Obtener todas las reseñas de un libro
  getBookReviews: async (bookId) => {
    if (!bookId) {
      throw new Error("El bookId es obligatorio.");
    }

    try {
      // Al obtener reseñas, pasamos el _id del libro
      const response = await axios.get(`${API_URL}/reviews/book/${bookId}`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener reseñas:", error);
      throw error.response?.data || error.message;
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

  // Obtener las reseñas del usuario actual
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
