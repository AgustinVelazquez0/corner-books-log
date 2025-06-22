import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import BookList from "../../components/BookList";
import { searchBooksIntelligent } from "../../services/bookService";
import styles from "../../styles/SearchResults.module.css";
import books from "../data/books.json"; // Fallback local

const SearchResults = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("q");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const performSearch = async () => {
      if (!query) {
        setSearchResults([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        console.log(`🔍 Buscando: "${query}"`);

        // Usar búsqueda inteligente del backend
        const results = await searchBooksIntelligent(query);

        if (results.length > 0) {
          console.log(
            `✅ Encontrados ${results.length} resultados con búsqueda inteligente`
          );
          setSearchResults(results);
        } else {
          // Fallback a búsqueda local si no hay resultados del backend
          console.log("🔄 Fallback a búsqueda local");
          const lowerCaseQuery = query.toLowerCase();
          const localResults = books.filter(
            (book) =>
              book.title.toLowerCase().includes(lowerCaseQuery) ||
              book.author.toLowerCase().includes(lowerCaseQuery) ||
              (book.description &&
                book.description.toLowerCase().includes(lowerCaseQuery)) ||
              (book.category &&
                book.category.toLowerCase().includes(lowerCaseQuery))
          );
          setSearchResults(localResults);
        }
      } catch (error) {
        console.error("Error en búsqueda:", error);
        setError("Error al realizar la búsqueda");

        // Fallback a búsqueda local en caso de error
        const lowerCaseQuery = query.toLowerCase();
        const localResults = books.filter(
          (book) =>
            book.title.toLowerCase().includes(lowerCaseQuery) ||
            book.author.toLowerCase().includes(lowerCaseQuery) ||
            (book.description &&
              book.description.toLowerCase().includes(lowerCaseQuery)) ||
            (book.category &&
              book.category.toLowerCase().includes(lowerCaseQuery))
        );
        setSearchResults(localResults);
      } finally {
        setLoading(false);
      }
    };

    performSearch();
  }, [query]);

  if (loading) {
    return (
      <div className={styles.loading}>
        <div>🔍 Buscando "{query}"...</div>
      </div>
    );
  }

  return (
    <div className={styles.searchResultsContainer}>
      {error && (
        <div className={styles.error}>⚠️ {error} (usando búsqueda local)</div>
      )}

      <h2 className={styles.searchTitle}>
        {searchResults.length > 0
          ? `Resultados para "${query}" (${searchResults.length} encontrados)`
          : `No se encontraron resultados para "${query}"`}
      </h2>

      {searchResults.length > 0 ? (
        <BookList books={searchResults} />
      ) : (
        <div className={styles.noResults}>
          <p>
            Intenta con diferentes palabras clave o navega por nuestras
            categorías.
          </p>
          <p className={styles.suggestion}>
            💡 Sugerencia: La búsqueda es inteligente y tolera errores de
            escritura
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
