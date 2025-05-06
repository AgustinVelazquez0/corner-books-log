import { useRef } from "react";
import { useBookCategory } from "../context/useBookCategory";
import { useBookAuthor } from "../context/useBookAuthor";
import BookCard from "./BookCard";
import styles from "../styles/BookList.module.css";
import defaultBooks from "../src/data/books.json";

const BookList = ({ books }) => {
  const { selectedCategory } = useBookCategory();
  const { selectedAuthor } = useBookAuthor();

  const scrollRef = useRef(null);

  // Usar los libros pasados como prop si existen, de lo contrario usar los libros por defecto
  const booksToUse = books || defaultBooks;

  // Aplicar filtros solo si no se reciben libros específicos como prop
  let filteredBooks = booksToUse;

  if (!books) {
    // Solo aplicar filtros adicionales si estamos usando los libros por defecto
    if (selectedCategory) {
      filteredBooks = filteredBooks.filter(
        (book) => book.category === selectedCategory
      );
    }

    if (selectedAuthor) {
      filteredBooks = filteredBooks.filter(
        (book) => book.author === selectedAuthor
      );
    }
  }

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Determinar el título basado en si estamos mostrando resultados de búsqueda o libros recomendados
  const listTitle = books ? "Resultados de búsqueda" : "Libros Recomendados";

  return (
    <section className={styles.bookList}>
      <h2 className={styles.title}>{listTitle}</h2>

      {filteredBooks.length === 0 ? (
        <div className={styles.noResults}>
          <p>No se encontraron libros con los filtros seleccionados.</p>
        </div>
      ) : (
        <>
          <button
            className={`${styles.scrollButton} ${styles.leftButton}`}
            onClick={() => scroll("left")}
          >
            ◀
          </button>

          <div className={styles.scrollWrapper} ref={scrollRef}>
            <div className={styles.flexContainer}>
              {filteredBooks.map((book) => (
                <div key={book.id} className={styles.flexItem}>
                  <BookCard {...book} />
                </div>
              ))}
            </div>
          </div>

          <button
            className={`${styles.scrollButton} ${styles.rightButton}`}
            onClick={() => scroll("right")}
          >
            ▶
          </button>
        </>
      )}
    </section>
  );
};

export default BookList;
