const API_BASE_URL = "/api";

// Obtener reseñas de un libro específico
export const getBookReviews = async (bookId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/reviews/book/${bookId}`);
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const data = await response.json();
    return {
      success: data.success,
      reviews: data.data || [],
      count: data.count || 0,
    };
  } catch (error) {
    console.error("Error al obtener reseñas:", error);
    throw error;
  }
};

// Crear una nueva reseña
export const createReview = async (bookId, rating, comment) => {
  try {
    // Obtener token del localStorage - usando "token" como en AuthContext
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No estás autenticado. Por favor, inicia sesión.");
    }

    console.log("📝 Creando reseña:", {
      bookId,
      rating,
      comment,
      token: "Presente",
    });

    const response = await fetch(`${API_BASE_URL}/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        bookId,
        rating,
        comment,
        // Ya no necesitamos userId ni username
      }),
    });

    console.log("📥 Respuesta recibida:", response.status, response.statusText);

    if (!response.ok) {
      const errorData = await response.json();
      console.error("❌ Error del servidor:", errorData);
      throw new Error(errorData.message || `Error: ${response.status}`);
    }

    const result = await response.json();
    console.log("✅ Reseña creada exitosamente:", result);
    return result;
  } catch (error) {
    console.error("Error al crear reseña:", error);
    throw error;
  }
};

// Eliminar una reseña
export const deleteReview = async (reviewId) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No estás autenticado. Por favor, inicia sesión.");
    }

    const response = await fetch(`${API_BASE_URL}/reviews/${reviewId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error("Error al eliminar reseña:", error);
    throw error;
  }
};

// Actualizar una reseña
export const updateReview = async (reviewId, rating, comment) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No estás autenticado. Por favor, inicia sesión.");
    }

    const response = await fetch(`${API_BASE_URL}/reviews/${reviewId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        rating,
        comment,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error("Error al actualizar reseña:", error);
    throw error;
  }
};

// Obtener todas las reseñas (cuando se agregue al backend)
export const getAllReviews = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/reviews`);
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const data = await response.json();
    return {
      success: data.success,
      reviews: data.data || [],
      count: data.count || 0,
    };
  } catch (error) {
    console.error("Error al obtener todas las reseñas:", error);
    throw error;
  }
};
