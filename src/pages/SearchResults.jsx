import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import BookList from "../../components/BookList";
import styles from "../../styles/SearchResults.module.css";
import books from "../data/books.json"; // Importamos datos directamente del JSON

const SearchResults = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("q");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Realizar la búsqueda local en el JSON
    try {
      if (!query) {
        setSearchResults([]);
        setLoading(false);
        return;
      }

      const lowerCaseQuery = query.toLowerCase();
      const results = books.filter(
        (book) =>
          book.title.toLowerCase().includes(lowerCaseQuery) ||
          book.author.toLowerCase().includes(lowerCaseQuery) ||
          (book.description &&
            book.description.toLowerCase().includes(lowerCaseQuery)) ||
          (book.category &&
            book.category.toLowerCase().includes(lowerCaseQuery))
      );

      setSearchResults(results);
      setLoading(false);
    } catch (error) {
      console.error("Error al buscar libros:", error);
      setLoading(false);
    }
  }, [query]);

  if (loading) {
    return <div className={styles.loading}>Buscando...</div>;
  }

  return (
    <div className={styles.searchResultsContainer}>
      <h2 className={styles.searchTitle}>
        {searchResults.length > 0
          ? `Resultados para "${query}"`
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
        </div>
      )}
    </div>
  );
};

export default SearchResults;
