import { useParams } from "react-router-dom";
import booksData from "../data/books.json"; // asumimos que este archivo tiene los libros
import BookCard from "../components/BookCard";

function BookDetail() {
  const { id } = useParams();

  // Buscamos el libro con ese id
  const book = booksData.find((b) => b.id === parseInt(id));

  if (!book) {
    return <p>Libro no encontrado</p>;
  }

  return (
    <section>
      <h2>Detalles del Libro</h2>
      <BookCard book={book} />
    </section>
  );
}

export default BookDetail;
