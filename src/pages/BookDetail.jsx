import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import styles from "../../styles/BookDetail.module.css";
import { Star } from "lucide-react";

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Cargar el libro desde la API
  useEffect(() => {
    const loadData = async () => {
      try {
        console.log("Intentando cargar libro con ID:", id);
        setLoading(true);

        const response = await fetch(
          `https://library-back-end-9vgl.onrender.com/api/books/${id}`
        );

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Error al cargar libro:", errorData);
          throw new Error("No se pudo cargar el libro");
        }

        const bookData = await response.json();
        console.log("Datos del libro recibidos:", bookData);

        if (bookData && bookData.book) {
          setBook(bookData.book);
        } else {
          console.error("Estructura de respuesta inesperada:", bookData);
          throw new Error("Formato de respuesta incorrecto");
        }
      } catch (error) {
        console.error("Error al cargar datos:", error);
        setError(
          "No se pudo cargar la información del libro: " + error.message
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  if (loading) return <p className={styles.loading}>Cargando libro...</p>;
  if (!book) return <p className={styles.error}>Libro no encontrado.</p>;

  const bookStars = [...Array(5)].map((_, i) => (
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
        <div className={styles.rating}>{bookStars}</div>

        <div className={styles.extraInfo}>
          <p>
            <strong>Año de publicación:</strong>{" "}
            {book.publicationYear || "No disponible"}
          </p>
          <p>
            <strong>Idioma:</strong> {book.language || "No especificado"}
          </p>
          <p>
            <strong>Páginas:</strong> {book.pages || "No especificado"}
          </p>
        </div>

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
