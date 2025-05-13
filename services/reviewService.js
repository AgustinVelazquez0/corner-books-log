// services/reviewService.js

// URL base para las APIs de reseñas
const API_URL = "https://library-back-end-9vgl.onrender.com/api";

/**
 * Obtiene las reseñas para un libro específico
 * @param {string} bookId - ID del libro
 * @returns {Promise<Object>} - Respuesta de la API con las reseñas
 */
export const getBookReviews = async (bookId) => {
  try {
    // Obtener el token de autenticación (si existe)
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("No hay token de autenticación para obtener reseñas");
    }

    const response = await fetch(`${API_URL}/reviews/book/${bookId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    // Si la respuesta no es exitosa, lanzar un error
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al obtener reseñas");
    }

    const data = await response.json();
    console.log("Reseñas recibidas:", data);

    // Normalizar la respuesta para manejar diferentes estructuras
    return {
      success: true,
      data: data.data || data.reviews || [],
    };
  } catch (error) {
    console.error("Error en getBookReviews:", error);
    return {
      success: false,
      error: error.message || "Error al obtener las reseñas",
      data: [],
    };
  }
};

/**
 * Crea una nueva reseña para un libro
 * @param {Object} reviewData - Datos de la reseña (bookId, rating, comment)
 * @returns {Promise<Object>} - Respuesta de la API
 */
export const createReview = async (reviewData) => {
  try {
    // Validar estructura de datos
    if (!reviewData.bookId) {
      throw new Error("El ID del libro es requerido");
    }

    if (!reviewData.rating || reviewData.rating < 1 || reviewData.rating > 5) {
      throw new Error("La calificación debe estar entre 1 y 5");
    }

    if (!reviewData.comment || reviewData.comment.trim() === "") {
      throw new Error("El comentario es requerido");
    }

    // Verificar el token de autenticación
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Necesitas iniciar sesión para enviar una reseña");
    }

    // Hacer la solicitud POST
    const response = await fetch(`${API_URL}/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(reviewData),
    });

    // Manejar errores específicos del servidor
    if (!response.ok) {
      const errorData = await response.json();

      // Si ya existe una reseña del usuario para este libro
      if (
        errorData.message &&
        errorData.message.includes("Ya has escrito una reseña")
      ) {
        throw new Error("Ya has escrito una reseña para este libro");
      }

      throw new Error(errorData.message || "Error al crear la reseña");
    }

    const data = await response.json();
    return {
      success: true,
      data: data.data || data,
    };
  } catch (error) {
    console.error("Error en createReview:", error);
    throw error;
  }
};

/**
 * Elimina una reseña
 * @param {string} reviewId - ID de la reseña a eliminar
 * @returns {Promise<Object>} - Respuesta de la API
 */
export const deleteReview = async (reviewId) => {
  try {
    // Verificar el token de autenticación
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Necesitas iniciar sesión para eliminar una reseña");
    }

    // Hacer la solicitud DELETE
    const response = await fetch(`${API_URL}/reviews/${reviewId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Manejar errores específicos del servidor
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al eliminar la reseña");
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error en deleteReview:", error);
    throw error;
  }
};

/**
 * Actualiza una reseña existente
 * @param {string} reviewId - ID de la reseña a actualizar
 * @param {Object} reviewData - Datos actualizados de la reseña
 * @returns {Promise<Object>} - Respuesta de la API
 */
export const updateReview = async (reviewId, reviewData) => {
  try {
    // Verificar el token de autenticación
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Necesitas iniciar sesión para actualizar una reseña");
    }

    // Hacer la solicitud PUT
    const response = await fetch(`${API_URL}/reviews/${reviewId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(reviewData),
    });

    // Manejar errores específicos del servidor
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al actualizar la reseña");
    }

    const data = await response.json();
    return {
      success: true,
      data: data.data || data,
    };
  } catch (error) {
    console.error("Error en updateReview:", error);
    throw error;
  }
};

export default {
  getBookReviews,
  createReview,
  deleteReview,
  updateReview,
};
