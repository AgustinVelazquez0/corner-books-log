import { useBookCategory } from "../../context/useBookCategory";
import { useBookAuthor } from "../../context/useBookAuthor";
import books from "../data/books.json";
import styles from "../../styles/Catalogo.module.css";

const Catalogo = () => {
  const { selectedCategory } = useBookCategory();
  const { selectedAuthor } = useBookAuthor();

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
