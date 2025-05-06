import { useRef } from "react";
import { useBookCategory } from "../context/useBookCategory";
import { useBookAuthor } from "../context/useBookAuthor";
import BookCard from "./BookCard";
import styles from "../styles/BookList.module.css";
import books from "../src/data/books.json";

const BookList = () => {
  const { selectedCategory } = useBookCategory();
  const { selectedAuthor } = useBookAuthor();

  const scrollRef = useRef(null);

  let filteredBooks = selectedCategory
    ? books.filter((book) => book.category === selectedCategory)
    : books;

  if (selectedAuthor) {
    filteredBooks = filteredBooks.filter(
      (book) => book.author === selectedAuthor
    );
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

  return (
    <section className={styles.bookList}>
      <h2 className={styles.title}>Libros Recomendados</h2>

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
