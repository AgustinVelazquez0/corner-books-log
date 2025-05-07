import { useRef, useEffect, useState } from "react";
import { useBookCategory } from "../context/useBookCategory";
import { useBookAuthor } from "../context/useBookAuthor";
import BookCard from "./BookCard";
import styles from "../styles/BookList.module.css";

const BookList = () => {
  const { selectedCategory } = useBookCategory();
  const { selectedAuthor } = useBookAuthor();
  const scrollRef = useRef(null);

  // ✅ Estado local para guardar los libros traídos desde el backend
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Traer los libros desde el backend
  useEffect(() => {
    fetch("http://localhost:5000/books")
      .then((res) => res.json())
      .then((data) => {
        setBooks(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al cargar libros:", err);
        setLoading(false);
      });
  }, []);

  // ✅ Aplicar filtros
  let filteredBooks = books;

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

  // ✅ Scroll lateral
  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // ✅ Título estático por ahora
  const listTitle = "Libros Recomendados";

  return (
    <section className={styles.bookList}>
      <h2 className={styles.title}>{listTitle}</h2>

      {loading ? (
        <p className={styles.noResults}>Cargando libros...</p>
      ) : filteredBooks.length === 0 ? (
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
                <div key={book._id} className={styles.flexItem}>
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
