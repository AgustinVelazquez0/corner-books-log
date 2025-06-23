import { useState, useEffect } from "react";
import { useBookCategory } from "../../context/useBookCategory";
import { useBookAuthor } from "../../context/useBookAuthor";
import { getAllBooks } from "../../services/bookService";
import localBooks from "../data/books.json"; // Fallback
import styles from "../../styles/Catalogo.module.css";

const Catalogo = () => {
  const { selectedCategory } = useBookCategory();
  const { selectedAuthor } = useBookAuthor();
  const [books, setBooks] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadBooks = async () => {
      try {
        setError(null);

        console.log("🔄 Cargando libros desde la API para el catálogo...");
        const booksFromAPI = await getAllBooks();
        console.log("✅ Libros cargados desde la API:", booksFromAPI.length);

        const normalizedBooks = booksFromAPI.map((book) => ({
          ...book,
          id: book.id || book.numericId || book._id,
        }));

        setBooks(normalizedBooks);
      } catch (err) {
        console.error("❌ Error al cargar libros desde la API:", err);
        console.log("🔄 Usando datos locales como fallback...");

        setError("Error al conectar con el servidor. Mostrando datos locales.");
        setBooks(localBooks);
      }
    };

    loadBooks();
  }, []);

  // Filtro de libros
  const filteredBooks = books.filter((book) => {
    return (
      (!selectedCategory || book.category === selectedCategory) &&
      (!selectedAuthor || book.author === selectedAuthor)
    );
  });

  // Ordenar libros por título
  const sortedBooks = filteredBooks.sort((a, b) =>
    a.title.localeCompare(b.title)
  );

  return (
    <div className={styles.catalogoContainer}>
      <h2>Catálogo de Libros</h2>

      {error && (
        <div
          style={{
            background: "#fff3cd",
            color: "#856404",
            padding: "10px",
            borderRadius: "5px",
            margin: "10px 0",
            border: "1px solid #ffeaa7",
          }}
        >
          ⚠️ {error}
        </div>
      )}

      {/* Mostrar filtros activos */}
      <div className={styles.activeFilters}>
        {selectedCategory && (
          <span className={styles.filterBadge}>
            Categoría: {selectedCategory}
          </span>
        )}
        {selectedAuthor && (
          <span className={styles.filterBadge}>Autor: {selectedAuthor}</span>
        )}
        {filteredBooks.length === 0 && (
          <p>No se encontraron libros con los filtros aplicados.</p>
        )}
      </div>

      {/* Vista en tarjetas de libros */}
      <div className={styles.bookGrid}>
        {sortedBooks.map((book) => (
          <div key={book.id} className={styles.bookCard}>
            <img
              src={book.coverImage}
              alt={book.title}
              className={styles.bookCover}
            />
            <div className={styles.bookInfo}>
              <h3 className={styles.bookTitle}>{book.title}</h3>
              <p className={styles.bookAuthor}>Autor: {book.author}</p>
              <p className={styles.bookCategory}>Categoría: {book.category}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Paginación (opcional) */}
      {/* Aquí podrías agregar componentes de paginación si la lista de libros es muy grande */}
    </div>
  );
};

export default Catalogo;
