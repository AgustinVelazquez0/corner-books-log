// Detectar entorno y configurar URL base automáticamente
const getApiBaseUrl = () => {
  // Si estamos en producción (dominio de Render)
  if (window.location.hostname.includes("onrender.com")) {
    return "https://library-back-end-9vgl.onrender.com/api";
  }
  // Si estamos en desarrollo local
  return "http://localhost:5000/api";
};

const API_BASE_URL = getApiBaseUrl();

console.log("🌐 API Base URL configurada:", API_BASE_URL);

// Obtener todos los libros
export const getAllBooks = async () => {
  try {
    console.log("📚 Cargando libros desde API...");
    const response = await fetch(`${API_BASE_URL}/books`);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("✅ Libros cargados exitosamente:", data.length || 0);
    return data;
  } catch (error) {
    console.error("❌ Error al cargar libros desde API:", error);
    throw error;
  }
};

// Búsqueda de libros
export const searchBooks = async (query) => {
  try {
    console.log("🔍 Buscando libros:", query);
    const response = await fetch(
      `${API_BASE_URL}/books/search?q=${encodeURIComponent(query)}`
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("✅ Búsqueda completada:", data.length || 0, "resultados");
    return data;
  } catch (error) {
    console.error("❌ Error en búsqueda de libros:", error);
    throw error;
  }
};

// Obtener libro por ID
export const getBookById = async (id) => {
  try {
    console.log("📖 Cargando libro por ID:", id);
    const response = await fetch(`${API_BASE_URL}/books/${id}`);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("✅ Libro cargado exitosamente:", data.title || "Sin título");
    return data;
  } catch (error) {
    console.error("❌ Error al cargar libro por ID:", error);
    throw error;
  }
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

    console.log("🧠 Búsqueda inteligente:", query);
    const response = await fetch(`${API_BASE_URL}/books/search?${params}`);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("🔍 Resultados de búsqueda inteligente:", data);

    return data.results || data || [];
  } catch (error) {
    console.error("❌ Error en búsqueda inteligente:", error);
    // Fallback a datos locales si falla el backend
    return [];
  }
};
