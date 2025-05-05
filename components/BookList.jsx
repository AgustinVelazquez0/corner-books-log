// BookList.jsx
import { useBookCategory } from "../context/useBookCategory";
import { useBookAuthor } from "../context/useBookAuthor";
import BookCard from "./BookCard";
import styles from "../styles/BookList.module.css";
import books from "../src/data/books.json";

const BookList = () => {
  // Usamos los contextos para obtener la categoría y el autor seleccionado
  const { selectedCategory } = useBookCategory();
  const { selectedAuthor } = useBookAuthor();

  // Filtrar los libros según la categoría seleccionada
  let filteredBooks = selectedCategory
    ? books.filter((book) => book.category === selectedCategory)
    : books;

  // Filtrar los libros según el autor seleccionado
  if (selectedAuthor) {
    filteredBooks = filteredBooks.filter(
      (book) => book.author === selectedAuthor
    );
  }

  return (
    <section className={styles.bookList}>
      <h2 className={styles.title}>Libros Recomendados</h2>

      {filteredBooks.length === 0 ? (
        <div className={styles.noResults}>
          <p>No se encontraron libros con los filtros seleccionados.</p>
        </div>
      ) : (
        <div className={styles.flexContainer}>
          {filteredBooks.map((book) => (
            <div key={book.id} className={styles.flexItem}>
              <BookCard {...book} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default BookList;
