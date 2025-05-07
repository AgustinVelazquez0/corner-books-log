import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import styles from "../../styles/BookDetail.module.css";
import { Star } from "lucide-react";

const BookDetail = () => {
  const { id } = useParams(); // ✅ Usamos el id que viene desde los parámetros de la URL
  const navigate = useNavigate();
  const [book, setBook] = useState(null); // Estado para el libro
  const [loading, setLoading] = useState(true); // Estado para manejar la carga

  useEffect(() => {
    // Usamos fetch para obtener el libro por su ID desde el backend
    fetch(`http://localhost:5000/api/libros/${id}`) // Esta es la URL que estamos usando en el backend local
      .then((response) => response.json())
      .then((data) => {
        setBook(data); // Cuando recibimos el libro, lo seteamos en el estado
        setLoading(false); // Y cambiamos el estado de loading
      })
      .catch((error) => {
        console.error("Error al cargar el libro:", error);
        setLoading(false); // En caso de error, también cambiamos el estado de loading
      });
  }, [id]); // El efecto se dispara cuando cambia el id

  if (loading) return <p>Cargando...</p>; // Mientras se carga el libro, mostramos un mensaje de carga

  if (!book) return <p>Libro no encontrado.</p>; // Si no encontramos el libro, mostramos este mensaje

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
