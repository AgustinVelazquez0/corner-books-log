import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import styles from "../../styles/BookDetail.module.css";
import { Star } from "lucide-react";
import axios from "axios"; // Asegúrate de importar axios
import books from "../data/books.json"; // Importamos los datos directamente del JSON

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      // Buscar el libro directamente en el archivo JSON local
      const foundBook = books.find((book) => book.id.toString() === id);

      if (foundBook) {
        setBook(foundBook);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error al cargar el libro:", error);
      setLoading(false);
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/reviews`,
        {
          bookId: id, // El id del libro
          rating,
          comment,
        }
      );
      console.log("Reseña enviada con éxito", response.data);
      // Aquí puedes hacer algo más como mostrar un mensaje de éxito o limpiar los campos
    } catch (err) {
      console.error("Error al enviar la reseña:", err);
      setError("Error al enviar la reseña. Intenta de nuevo.");
    }
  };

  if (loading) return <p>Cargando...</p>;

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
        <img
          src={book.coverImage || "/api/placeholder/180/270"}
          alt={`Portada de ${book.title}`}
        />
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

        {/* Formulario de reseña */}
        <div className={styles.reviewSection}>
          <h3>Deja tu reseña</h3>
          <form onSubmit={handleSubmit}>
            <label>
              Calificación:
              <input
                type="number"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                min="1"
                max="5"
              />
            </label>
            <br />
            <label>
              Comentario:
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </label>
            <br />
            <button type="submit">Enviar Reseña</button>
          </form>
          {error && <p>{error}</p>}
        </div>

        <button className={styles.backButton} onClick={() => navigate(-1)}>
          ← Volver
        </button>
      </div>
    </div>
  );
};

export default BookDetail;
