const API_BASE_URL = "/api";

// Obtener todos los libros
export const getAllBooks = async () => {
  const response = await fetch(`${API_BASE_URL}/books`);
  return response.json();
};

// Búsqueda de libros
export const searchBooks = async (query) => {
  const response = await fetch(`${API_BASE_URL}/books/search?q=${query}`);
  return response.json();
};

// Obtener libro por ID
export const getBookById = async (id) => {
  const response = await fetch(`${API_BASE_URL}/books/${id}`);
  return response.json();
};

// Función anterior de búsqueda inteligente (mantenida para compatibilidad)
export const searchBooksIntelligent = async (query, filters = {}) => {
  try {
    if (!query || query.trim().length < 2) {
      return [];
    }

    const params = new URLSearchParams({
      q: query.trim(),
      ...filters,
    });

    const response = await fetch(`${API_BASE_URL}/books/search?${params}`);

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    console.log("🔍 Resultados de búsqueda inteligente:", data);

    return data.results || [];
  } catch (error) {
    console.error("Error en búsqueda inteligente:", error);
    // Fallback a datos locales si falla el backend
    return [];
  }
};
