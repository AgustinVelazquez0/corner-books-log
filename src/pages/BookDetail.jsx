import { useParams, useNavigate } from "react-router-dom";
import books from "../data/books.json";
import styles from "../../styles/BookDetail.module.css";
import { Star } from "lucide-react";

const BookDetail = () => {
  const { id } = useParams(); // ✅ AHORA se usa useParams
  const navigate = useNavigate();

  const book = books.find((b) => String(b.id) === String(id)); // ✅ AHORA se usa books

  if (!book) return <p>Libro no encontrado.</p>;

  const stars = [...Array(5)].map((_, i) => (
    <Star
      key={i}
      size={18}
      fill={i < book.rating ? "#ffc107" : "none"}
      color={i < book.rating ? "#ffc107" : "#ccc"}
    />
  ));

  return (
    <div className={styles.detailContainer}>
      <div className={styles.cover}>
        <img src={book.coverImage} alt={`Portada de ${book.title}`} />
      </div>
      <div className={styles.info}>
        <h2 className={styles.title}>{book.title}</h2>
        <p className={styles.author}>por {book.author}</p>
        <p className={styles.category}>Género: {book.category}</p>
        <div className={styles.rating}>{stars}</div>
        <p className={styles.description}>{book.description}</p>

        {book.driveLink && (
          <a
            href={book.driveLink}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.downloadLink}
          >
            Leer o Descargar
          </a>
        )}

        <button className={styles.backButton} onClick={() => navigate(-1)}>
          ← Volver
        </button>
      </div>
    </div>
  );
};

export default BookDetail;
