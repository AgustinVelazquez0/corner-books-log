import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import styles from "../../styles/BookDetail.module.css";
import { Star } from "lucide-react";
import { getAllBooks } from "../../services/bookService";
import localBooks from "../data/books.json"; // Fallback
import * as reviewService from "../../services/reviewService";
import { useAuth } from "../../context/AuthContext";

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [booksError, setBooksError] = useState(null);

  // Cargar el libro desde la API y las reseñas
  useEffect(() => {
    const loadData = async () => {
      try {
        console.log("🔄 Cargando libro desde la API...");

        // Intentar cargar desde la API
        const books = await getAllBooks();
        console.log("✅ Libros cargados desde la API:", books.length);

        const foundBook = books.find(
          (book) =>
            book.numericId?.toString() === id ||
            book.id?.toString() === id ||
            book._id?.toString() === id
        );
        if (foundBook) {
          setBook(foundBook);
        } else {
          // Si no se encuentra en la API, intentar en datos locales
          console.log(
            "🔄 Libro no encontrado en la API, buscando en datos locales..."
          );
          const localBook = localBooks.find(
            (book) => book.id.toString() === id
          );
          if (localBook) {
            setBook(localBook);
            setBooksError(
              "Libro cargado desde datos locales (servidor no disponible)"
            );
          }
        }

        // Cargar reseñas de la API usando el ID correcto del libro encontrado
        if (foundBook) {
          try {
            const bookId = foundBook.numericId || foundBook.id || foundBook._id;
            console.log("📖 Cargando reseñas para libro ID:", bookId);

            const reviewData = await reviewService.getBookReviews(bookId);
            console.log("Reseñas cargadas:", reviewData);
            setReviews(reviewData.reviews || []);
          } catch (reviewError) {
            console.error("Error al cargar reseñas:", reviewError);
            // No mostramos error si no hay reseñas, es normal para libros nuevos
          }
        }

        setLoadingReviews(false);
      } catch (error) {
        console.error("❌ Error al cargar libro desde la API:", error);
        console.log("🔄 Usando datos locales como fallback...");

        setBooksError(
          "Error al conectar con el servidor. Usando datos locales."
        );

        // Fallback a datos locales
        const foundBook = localBooks.find((book) => book.id.toString() === id);
        if (foundBook) {
          setBook(foundBook);

          // Intentar cargar reseñas incluso con datos locales
          try {
            const bookId = foundBook.numericId || foundBook.id || foundBook._id;
            console.log("📖 Cargando reseñas para libro local ID:", bookId);

            const reviewData = await reviewService.getBookReviews(bookId);
            console.log("Reseñas cargadas desde local:", reviewData);
            setReviews(reviewData.reviews || []);
          } catch (reviewError) {
            console.error(
              "Error al cargar reseñas desde datos locales:",
              reviewError
            );
          }
        }

        setLoadingReviews(false);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  // Enviar una nueva reseña
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Verificar autenticación
    if (!isAuthenticated) {
      setError("Debes iniciar sesión para escribir una reseña.");
      return;
    }

    if (!rating || rating < 1 || rating > 5) {
      setError("Por favor, elige una calificación entre 1 y 5.");
      return;
    }

    if (!comment.trim()) {
      setError("Por favor, escribe un comentario.");
      return;
    }

    try {
      // Determinar el ID correcto del libro
      const bookId = book.numericId || book.id || book._id;

      console.log("📝 Enviando reseña para libro ID:", bookId);

      if (!bookId) {
        throw new Error("No se pudo determinar el ID del libro");
      }

      // Usar el servicio de reseñas para crear una nueva reseña
      await reviewService.createReview(bookId, parseInt(rating), comment);

      setSuccess("¡Reseña enviada con éxito!");
      setRating(0);
      setComment("");

      // Recargar las reseñas para ver la nueva
      const updatedReviews = await reviewService.getBookReviews(bookId);
      setReviews(updatedReviews.reviews || []);
    } catch (err) {
      console.error("Error al enviar la reseña:", err);
      setError(
        "Error al enviar la reseña. " + (err.message || "Intenta de nuevo.")
      );
    }
  };

  if (loading) return <p className={styles.loading}>Cargando...</p>;
  if (!book) return <p className={styles.error}>Libro no encontrado.</p>;

  // Renderizar estrellas para la calificación del libro
  const bookStars = [...Array(5)].map((_, i) => (
    <Star
      key={i}
      size={18}
      fill={i < book.rating ? "#ffc107" : "none"}
      color={i < book.rating ? "#ffc107" : "#ccc"}
    />
  ));

  // Renderizar estrellas para la selección de calificación
  const ratingStars = [...Array(5)].map((_, i) => (
    <Star
      key={i}
      size={24}
      fill={i < rating ? "#ffc107" : "none"}
      color={i < rating ? "#ffc107" : "#ccc"}
      onClick={() => setRating(i + 1)}
      style={{ cursor: "pointer" }}
    />
  ));

  return (
    <div className={styles.detailContainer}>
      {booksError && (
        <div
          style={{
            background: "#fff3cd",
            color: "#856404",
            padding: "10px",
            borderRadius: "5px",
            margin: "10px 0",
            border: "1px solid #ffeaa7",
          }}
        >
          ⚠️ {booksError}
        </div>
      )}

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

        {/* Reseñas existentes */}
        <div className={styles.reviewsContainer}>
          <h3>Reseñas</h3>
          {loadingReviews ? (
            <p>Cargando reseñas...</p>
          ) : reviews.length > 0 ? (
            <div className={styles.reviewsList}>
              {reviews.map((review) => (
                <div key={review._id} className={styles.reviewItem}>
                  <div className={styles.reviewHeader}>
                    <span className={styles.reviewAuthor}>
                      {review.reviewerName || "Anónimo"}
                    </span>
                    <div className={styles.reviewRating}>
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          fill={i < review.rating ? "#ffc107" : "none"}
                          color={i < review.rating ? "#ffc107" : "#ccc"}
                        />
                      ))}
                    </div>
                    <span className={styles.reviewDate}>
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className={styles.reviewComment}>{review.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>No hay reseñas todavía. ¡Sé el primero en opinar!</p>
          )}
        </div>

        {/* Formulario de reseña */}
        <div className={styles.reviewSection}>
          <h3>Deja tu reseña</h3>
          {success && <p className={styles.success}>{success}</p>}
          {error && <p className={styles.error}>{error}</p>}

          {isAuthenticated ? (
            <>
              <div style={{ marginBottom: "10px", color: "#666" }}>
                Publicando como: <strong>{user?.name || "Usuario"}</strong>
              </div>
              <form onSubmit={handleSubmit} className={styles.reviewForm}>
                <div className={styles.ratingSelector}>
                  <label>Calificación:</label>
                  <div className={styles.stars}>{ratingStars}</div>
                </div>

                <div className={styles.commentField}>
                  <label htmlFor="comment">Comentario:</label>
                  <textarea
                    id="comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Escribe tu opinión sobre este libro..."
                    rows={4}
                  />
                </div>

                <button type="submit" className={styles.submitReview}>
                  Enviar Reseña
                </button>
              </form>
            </>
          ) : (
            <div
              style={{
                padding: "20px",
                backgroundColor: "#f8f9fa",
                borderRadius: "8px",
                textAlign: "center",
                color: "#666",
              }}
            >
              <p>Debes iniciar sesión para escribir una reseña.</p>
              <button
                onClick={() => navigate("/login")}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Iniciar Sesión
              </button>
            </div>
          )}
        </div>

        <button className={styles.backButton} onClick={() => navigate(-1)}>
          ← Volver
        </button>
      </div>
    </div>
  );
};

export default BookDetail;
