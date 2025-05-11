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

// Mapeo de IDs simples a ObjectIds válidos de MongoDB
// Aquí mapeamos algunos IDs comunes que podrías estar usando
const idToObjectIdMap = {
  1: "507f1f77bcf86cd799439001",
  2: "507f1f77bcf86cd799439002",
  3: "507f1f77bcf86cd799439003",
  4: "507f1f77bcf86cd799439004",
  5: "507f1f77bcf86cd799439005",
  6: "507f1f77bcf86cd799439006",
  7: "507f1f77bcf86cd799439007",
  8: "507f1f77bcf86cd799439008",
  9: "507f1f77bcf86cd799439009",
  10: "507f1f77bcf86cd799439010",
  // Añade más mapeos según sea necesario
};

// Función para convertir un ID simple a ObjectId
const convertToObjectId = (simpleId) => {
  const stringId = String(simpleId);
  // Si ya tiene formato de ObjectId, lo devolvemos tal cual
  if (/^[a-fA-F0-9]{24}$/.test(stringId)) {
    return stringId;
  }

  // Si tenemos un mapeo para este ID, lo usamos
  if (idToObjectIdMap[stringId]) {
    return idToObjectIdMap[stringId];
  }

  // Si no tenemos un mapeo, generamos un ObjectId basado en el ID simple
  // Esto es una simplificación y no garantiza unicidad, pero sirve para pruebas
  const paddedId = stringId.padStart(4, "0");
  return `507f1f77bcf86cd7994390${paddedId}`;
};

// Servicio para gestionar las reseñas
const reviewService = {
  // Crear una nueva reseña
  createReview: async (bookId, rating, comment) => {
    console.log({ bookId, rating, comment });
    console.log(
      "ID recibido:",
      bookId,
      "Tipo:",
      typeof bookId,
      "Longitud:",
      String(bookId).length
    );

    if (!bookId || !rating || !comment) {
      throw new Error("bookId, rating y comment son obligatorios.");
    }

    // Convertir el ID simple a un ObjectId válido
    const mongoObjectId = convertToObjectId(bookId);
    console.log("ID convertido a ObjectId:", mongoObjectId);

    try {
      const response = await authAxios.post(`${API_URL}/reviews`, {
        bookId: mongoObjectId, // Usamos el ObjectId
        rating,
        comment,
      });

      return response.data;
    } catch (error) {
      console.error("Error al crear la reseña:", error);
      throw error.response?.data || error.message;
    }
  },

  // Obtener todas las reseñas de un libro
  getBookReviews: async (bookId) => {
    if (!bookId) {
      throw new Error("El bookId es obligatorio.");
    }

    // Convertir el ID simple a un ObjectId válido para la consulta
    const mongoObjectId = convertToObjectId(bookId);

    try {
      const response = await axios.get(`${API_URL}/reviews/${mongoObjectId}`);

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
