import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import BookList from "../../components/BookList";
import books from "../data/books.json";
import styles from "../../styles/SearchResults.module.css";
import { Search } from "lucide-react";

const SearchResults = () => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [noResults, setNoResults] = useState(false);

  useEffect(() => {
    // Extraer el query de la URL
    const query = new URLSearchParams(location.search).get("q") || "";
    setSearchQuery(query);

    // Filtrar libros basados en el query
    if (query) {
      const queryLower = query.toLowerCase();
      const results = books.filter(
        (book) =>
          book.title.toLowerCase().includes(queryLower) ||
          book.author.toLowerCase().includes(queryLower) ||
          book.description.toLowerCase().includes(queryLower) ||
          book.category.toLowerCase().includes(queryLower)
      );

      setFilteredBooks(results);
      setNoResults(results.length === 0);
    } else {
      setFilteredBooks([]);
      setNoResults(false);
    }
  }, [location.search]);

  return (
    <div className={styles.searchResultsContainer}>
      <div className={styles.searchHeader}>
        <Search size={24} className={styles.searchIcon} />
        <h1 className={styles.searchTitle}>
          Resultados de búsqueda para: <span>"{searchQuery}"</span>
        </h1>
      </div>

      {searchQuery ? (
        <>
          <div className={styles.resultsInfo}>
            {filteredBooks.length > 0 ? (
              <p>
                Se encontraron <strong>{filteredBooks.length}</strong>{" "}
                {filteredBooks.length === 1 ? "libro" : "libros"}
              </p>
            ) : (
              <p className={styles.noResults}>
                No se encontraron libros que coincidan con tu búsqueda
              </p>
            )}
          </div>

          {filteredBooks.length > 0 && <BookList books={filteredBooks} />}

          {noResults && (
            <div className={styles.suggestionsContainer}>
              <h2>Sugerencias:</h2>
              <ul className={styles.suggestions}>
                <li>Verifica la ortografía del término de búsqueda.</li>
                <li>Utiliza palabras más generales.</li>
                <li>Prueba con un autor o categoría específica.</li>
                <li>
                  Explora nuestro catálogo completo para descubrir más libros.
                </li>
              </ul>
            </div>
          )}
        </>
      ) : (
        <div className={styles.emptySearch}>
          <p>Ingresa un término de búsqueda para encontrar libros</p>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
