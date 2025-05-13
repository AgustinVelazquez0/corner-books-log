import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import styles from "../../styles/BookDetail.module.css";
import { Star, User, MessageCircle, Send, Trash2 } from "lucide-react";
import * as reviewService from "../../services/reviewService";
import { useAuth } from "../../context/AuthContext"; // Asegúrate de importar el contexto de autenticación

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0); // Añadido para efecto hover en estrellas
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false); // Controla visibilidad del formulario

  // Obtenemos la información del usuario autenticado
  const { user, isAuthenticated } = useAuth();
  const isAdmin = user?.role === "admin";

  // Cargar el libro desde la API
  useEffect(() => {
    const loadData = async () => {
      try {
        console.log("Intentando cargar libro con ID:", id);
        setLoading(true);

        // Cargar libro desde la API (sin requerir token para esta operación)
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

        // CORRECCIÓN: Accediendo correctamente a la estructura de la respuesta
        if (bookData && bookData.book) {
          setBook(bookData.book);
        } else {
          console.error("Estructura de respuesta inesperada:", bookData);
          throw new Error("Formato de respuesta incorrecto");
        }

        // Intentamos cargar las reseñas del libro
        await loadReviews(id);
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

  // Función separada para cargar reseñas
  const loadReviews = async (bookId) => {
    try {
      setLoadingReviews(true);

      // Intentar obtener token si existe (para contenido protegido)
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const reviewResponse = await fetch(
        `https://library-back-end-9vgl.onrender.com/api/reviews/book/${bookId}`,
        { headers }
      );

      if (!reviewResponse.ok) {
        console.warn("No se pudieron cargar las reseñas. Continuando...");
        return;
      }

      const reviewData = await reviewResponse.json();
      console.log("Reseñas cargadas:", reviewData);

      // Establecer las reseñas según la estructura correcta de respuesta
      if (reviewData && Array.isArray(reviewData.data)) {
        setReviews(reviewData.data);
      } else if (reviewData && Array.isArray(reviewData.reviews)) {
        setReviews(reviewData.reviews);
      } else {
        console.warn("Formato de reseñas inesperado:", reviewData);
        setReviews([]);
      }
    } catch (reviewError) {
      console.error("Error al cargar reseñas:", reviewError);
    } finally {
      setLoadingReviews(false);
    }
  };

  // Alternar mostrar/ocultar formulario de reseña
  const toggleReviewForm = () => {
    // Si el usuario no está autenticado, mostrar alerta
    if (!isAuthenticated) {
      alert("Debes iniciar sesión para escribir una reseña");
      return;
    }
    setShowReviewForm(!showReviewForm);
    // Limpiar mensajes previos
    setSuccess("");
    setError("");
  };

  // Eliminar una reseña
  const handleDeleteReview = async (reviewId) => {
    if (!isAuthenticated || !user) {
      alert("Necesitas iniciar sesión para realizar esta acción");
      return;
    }

    if (confirm("¿Estás seguro de que quieres eliminar esta reseña?")) {
      try {
        setLoadingReviews(true);
        setError("");

        // Llamamos a la API para eliminar la reseña
        await reviewService.deleteReview(reviewId);

        // Recargamos todas las reseñas para asegurarnos de tener los datos actualizados
        await loadReviews(id);

        alert("Reseña eliminada correctamente");
      } catch (err) {
        console.error("Error al eliminar la reseña:", err);
        setError(err.message || "No se pudo eliminar la reseña");
        alert(
          "Error al eliminar la reseña: " +
            (err.message || "Inténtalo de nuevo más tarde")
        );
      } finally {
        setLoadingReviews(false);
      }
    }
  };

  // Enviar una nueva reseña
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!rating || rating < 1 || rating > 5) {
      setError("Por favor, elige una calificación entre 1 y 5.");
      return;
    }

    if (!comment.trim()) {
      setError("Por favor, escribe un comentario.");
      return;
    }

    try {
      // Comprobamos que tenemos un token
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Necesitas iniciar sesión para enviar una reseña");
        return;
      }

      // Usar el servicio de reseñas para crear una nueva reseña
      const reviewData = {
        bookId: id,
        rating: parseInt(rating),
        comment: comment,
      };

      const response = await reviewService.createReview(reviewData);
      console.log("Respuesta al crear reseña:", response);

      setSuccess("¡Reseña enviada con éxito!");
      setRating(0);
      setComment("");
      setShowReviewForm(false); // Ocultar formulario después de enviar

      // Recargar las reseñas para ver la nueva
      await loadReviews(id);
    } catch (err) {
      console.error("Error al enviar la reseña:", err);
      setError(
        "Error al enviar la reseña. " + (err.message || "Intenta de nuevo.")
      );
    }
  };

  if (loading) return <p className={styles.loading}>Cargando libro...</p>;
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
      onClick={() => setRating(i + 1)}
      onMouseEnter={() => setHoverRating(i + 1)}
      onMouseLeave={() => setHoverRating(0)}
      fill={i < (hoverRating || rating) ? "#ffc107" : "none"}
      color={i < (hoverRating || rating) ? "#ffc107" : "#ccc"}
      style={{ cursor: "pointer" }}
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

        {/* Botones para reseñas */}
        <div className={styles.reviewToggleArea}>
          <button
            onClick={toggleReviewForm}
            className={styles.reviewToggleButton}
          >
            {showReviewForm ? "Cancelar reseña" : "Escribir reseña"}
          </button>

          <button className={styles.reviewToggleButton}>
            <MessageCircle size={16} style={{ marginRight: "5px" }} />
            Ver reseñas {reviews.length > 0 ? `(${reviews.length})` : ""}
          </button>
        </div>

        {/* Sección de reseñas y formulario */}
        <div className={styles.reviewSection}>
          {/* Contenedor de reseñas existentes */}
          <div className={styles.reviewsDetails}>
            <h3>Reseñas</h3>
            {loadingReviews ? (
              <p>Cargando reseñas...</p>
            ) : reviews.length > 0 ? (
              <div className={styles.reviewsList}>
                {reviews.map((review) => {
                  const reviewId = review._id || review.id;

                  return (
                    <div key={reviewId} className={styles.reviewItem}>
                      <div className={styles.reviewHeader}>
                        <div className={styles.reviewUserInfo}>
                          <User size={14} />
                          <span className={styles.reviewAuthor}>
                            {review.username || "Usuario anónimo"}
                          </span>
                        </div>
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

                      {/* Mostrar botón de eliminar solo si es admin o es el autor de la reseña */}
                      {(isAdmin || (user && user.id === review.userId)) && (
                        <button
                          onClick={() => handleDeleteReview(reviewId)}
                          className={styles.deleteReviewButton}
                          disabled={loadingReviews}
                        >
                          <Trash2 size={16} />
                          Eliminar
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className={styles.noReviews}>
                No hay reseñas todavía. ¡Sé el primero en opinar!
              </p>
            )}
          </div>

          {/* Formulario para añadir reseñas - visible solo cuando showReviewForm es true */}
          {showReviewForm ? (
            <>
              <h3>Deja tu reseña</h3>
              {success && <p className={styles.success}>{success}</p>}
              {error && <p className={styles.error}>{error}</p>}

              <div className={styles.userReviewInfo}>
                <User size={16} />
                <span>Publicando como: {user?.name || "Usuario"}</span>
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
                    className={styles.commentInput}
                  />
                </div>

                <button
                  type="submit"
                  className={styles.submitReview || styles.sendReviewButton}
                  disabled={rating === 0 || comment.trim() === "" || loading}
                >
                  {loading ? (
                    "Enviando..."
                  ) : (
                    <>
                      <Send size={16} style={{ marginRight: "4px" }} />
                      Enviar reseña
                    </>
                  )}
                </button>
              </form>
            </>
          ) : null}
        </div>

        <button className={styles.backButton} onClick={() => navigate(-1)}>
          ← Volver
        </button>
      </div>
    </div>
  );
};

export default BookDetail;
