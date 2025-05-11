import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Heart,
  BookOpen,
  Star,
  ChevronDown,
  ChevronUp,
  Send,
  Trash2,
  MessageCircle,
  User,
} from "lucide-react";
import styles from "../styles/BookCard.module.css";
import { useAuth } from "../context/AuthContext";
import reviewService from "../services/reviewService"; // Importamos el servicio de reseñas

const BookCard = ({
  id,
  title,
  author,
  description = "No hay descripción disponible",
  driveLink,
  category,
  coverImage = "/api/placeholder/180/270",
  rating = 0,
}) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [reviews, setReviews] = useState([]);
  const [showReviews, setShowReviews] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Obtenemos la información del usuario autenticado
  const { user, isAuthenticated } = useAuth();
  const isAdmin = true; // Esta lógica deberías ajustarla según tu aplicación

  // Cargamos las reseñas para este libro desde la API
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setIsLoading(true);
        const data = await reviewService.getBookReviews(id);
        setReviews(data);
        setIsLoading(false);
      } catch (err) {
        console.error("Error al cargar reseñas:", err);
        setError("No se pudieron cargar las reseñas");
        setIsLoading(false);
      }
    };

    if (showReviews) {
      fetchReviews();
    }
  }, [id, showReviews]);

  // Cargamos el estado de favorito para este libro
  useEffect(() => {
    // Solo cargar favoritos si el usuario está autenticado
    if (isAuthenticated && user) {
      const userFavorites =
        JSON.parse(localStorage.getItem(`favorites_${user.id}`)) || [];
      // Verificar si este libro está en favoritos
      setIsFavorite(userFavorites.includes(id));
    }
  }, [id, isAuthenticated, user]);

  const isLongDescription = description.length > 150;
  const shortDescription = isLongDescription
    ? `${description.substring(0, 150)}...`
    : description;

  const toggleFavorite = () => {
    // Solo permitir cambiar favoritos si el usuario está autenticado
    if (!isAuthenticated || !user) {
      alert("Debes iniciar sesión para añadir favoritos");
      return;
    }

    const newIsFavorite = !isFavorite;
    setIsFavorite(newIsFavorite);

    // Guardar en localStorage
    const favoritesKey = `favorites_${user.id}`;
    const userFavorites = JSON.parse(localStorage.getItem(favoritesKey)) || [];

    let updatedFavorites;
    if (newIsFavorite) {
      // Añadir a favoritos si no existe ya
      if (!userFavorites.includes(id)) {
        updatedFavorites = [...userFavorites, id];
      } else {
        updatedFavorites = userFavorites;
      }
    } else {
      // Eliminar de favoritos
      updatedFavorites = userFavorites.filter((bookId) => bookId !== id);
    }

    localStorage.setItem(favoritesKey, JSON.stringify(updatedFavorites));
  };

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  const toggleReviews = () => {
    setShowReviews(!showReviews);
  };

  const toggleReviewForm = () => {
    // Si el usuario no está autenticado, mostrar alerta
    if (!isAuthenticated) {
      alert("Debes iniciar sesión para escribir una reseña");
      return;
    }
    setShowReviewForm(!showReviewForm);
  };

  const handleSendReview = async () => {
    // Verificamos que el usuario esté autenticado
    if (!isAuthenticated || !user) {
      alert("Debes iniciar sesión para enviar una reseña");
      return;
    }

    // Validamos que haya puntuación y comentario
    if (userRating === 0 || comment.trim() === "") {
      alert("Por favor, añade una puntuación y un comentario");
      return;
    }

    try {
      setIsLoading(true);
      // Enviamos la reseña a la API
      const response = await reviewService.createReview(
        id,
        userRating,
        comment
      );

      // Actualizamos la lista de reseñas en el estado
      const newReview = response.review;
      setReviews([...reviews, newReview]);

      // Limpiamos el formulario
      setComment("");
      setUserRating(0);
      setShowReviewForm(false);
      setIsLoading(false);

      alert("¡Gracias por tu reseña!");
    } catch (err) {
      console.error("Error al enviar la reseña:", err);
      setError(err.message || "No se pudo enviar la reseña");
      setIsLoading(false);
      alert(
        "Error al enviar la reseña: " +
          (err.message || "Inténtalo de nuevo más tarde")
      );
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!isAuthenticated || !user) {
      alert("Necesitas iniciar sesión para realizar esta acción");
      return;
    }

    if (confirm("¿Estás seguro de que quieres eliminar esta reseña?")) {
      try {
        setIsLoading(true);
        // Llamamos a la API para eliminar la reseña
        await reviewService.deleteReview(reviewId);

        // Actualizamos la lista de reseñas en el estado
        const updatedReviews = reviews.filter(
          (review) => review._id !== reviewId
        );
        setReviews(updatedReviews);

        setIsLoading(false);
        alert("Reseña eliminada correctamente");
      } catch (err) {
        console.error("Error al eliminar la reseña:", err);
        setError(err.message || "No se pudo eliminar la reseña");
        setIsLoading(false);
        alert(
          "Error al eliminar la reseña: " +
            (err.message || "Inténtalo de nuevo más tarde")
        );
      }
    }
  };

  return (
    <article className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.coverImage}>
          <img
            src={coverImage}
            alt={`Portada de ${title}`}
            className={styles.bookCover}
          />
          <button
            onClick={toggleFavorite}
            className={`${styles.favoriteButton} ${
              isFavorite ? styles.isFavorite : ""
            }`}
            aria-label={
              isFavorite ? "Quitar de favoritos" : "Añadir a favoritos"
            }
          >
            <Heart
              fill={isFavorite ? "#ff4d6d" : "none"}
              color={isFavorite ? "#ff4d6d" : "#666"}
              size={18}
            />
          </button>
        </div>

        <div className={styles.cardContent}>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.author}>por {author}</p>

          {rating > 0 && (
            <div className={styles.rating}>
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  fill={i < rating ? "#ffc107" : "none"}
                  color={i < rating ? "#ffc107" : "#d1d1d1"}
                />
              ))}
              <span className={styles.ratingText}>{rating}/5</span>
            </div>
          )}

          <p className={styles.category}>
            <span className={styles.categoryLabel}>Género:</span> {category}
          </p>
        </div>
      </div>

      <div className={styles.description}>
        <p>{expanded ? description : shortDescription}</p>

        {isLongDescription && (
          <button
            className={styles.expandButton}
            onClick={toggleExpand}
            aria-label={expanded ? "Ver menos" : "Ver más"}
          >
            {expanded ? (
              <>
                <span>Ver menos</span>
                <ChevronUp size={16} />
              </>
            ) : (
              <>
                <span>Ver más</span>
                <ChevronDown size={16} />
              </>
            )}
          </button>
        )}
      </div>

      {/* Botones para reseñas */}
      <div className={styles.reviewToggleArea}>
        <button
          onClick={toggleReviewForm}
          className={styles.reviewToggleButton}
        >
          {showReviewForm ? "Cancelar reseña" : "Escribir reseña"}
        </button>

        <button onClick={toggleReviews} className={styles.reviewToggleButton}>
          <MessageCircle size={16} style={{ marginRight: "5px" }} />
          {showReviews
            ? "Ocultar reseñas"
            : `Ver reseñas${reviews.length > 0 ? ` (${reviews.length})` : ""}`}
        </button>
      </div>

      {/* Formulario de reseña - ahora verificando autenticación */}
      {showReviewForm && isAuthenticated && (
        <div className={styles.reviewSection}>
          <div className={styles.userReviewInfo}>
            <User size={16} />
            <span>Publicando como: {user?.name || "Usuario"}</span>
          </div>

          <div className={styles.ratingInput}>
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={20}
                onClick={() => setUserRating(i + 1)}
                onMouseEnter={() => setHoverRating(i + 1)}
                onMouseLeave={() => setHoverRating(0)}
                fill={i < (hoverRating || userRating) ? "#ffc107" : "none"}
                color={i < (hoverRating || userRating) ? "#ffc107" : "#d1d1d1"}
                style={{ cursor: "pointer" }}
              />
            ))}
            <span>{userRating}/5</span>
          </div>

          <textarea
            placeholder="Dejá un comentario..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className={styles.commentInput}
          ></textarea>

          <button
            onClick={handleSendReview}
            className={styles.sendReviewButton}
            disabled={userRating === 0 || comment.trim() === "" || isLoading}
          >
            {isLoading ? (
              "Enviando..."
            ) : (
              <>
                <Send size={16} style={{ marginRight: "4px" }} />
                Enviar reseña
              </>
            )}
          </button>
        </div>
      )}

      {/* Mostrar mensaje de error si existe */}
      {error && <p className={styles.errorMessage}>{error}</p>}

      {/* Reseñas cargadas desde la API */}
      {showReviews && (
        <div className={styles.reviewContainer}>
          <h4>Reseñas:</h4>

          {isLoading && <p>Cargando reseñas...</p>}

          {!isLoading && reviews.length === 0 && (
            <p className={styles.noReviews}>
              No hay reseñas todavía. ¡Sé el primero en opinar!
            </p>
          )}

          {!isLoading && reviews.length > 0 && (
            <div className={styles.reviews}>
              {reviews.map((review) => (
                <div key={review._id} className={styles.review}>
                  <div className={styles.reviewHeader}>
                    <div className={styles.reviewUserInfo}>
                      <User size={14} />
                      <span className={styles.reviewUserName}>
                        {review.username || "Usuario anónimo"}
                      </span>
                    </div>
                    <span className={styles.reviewDate}>
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className={styles.reviewRating}>
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        fill={i < review.rating ? "#ffc107" : "none"}
                        color={i < review.rating ? "#ffc107" : "#d1d1d1"}
                      />
                    ))}
                  </div>

                  <p className={styles.reviewComment}>{review.comment}</p>

                  {/* Mostrar botón de eliminar solo si es admin o es el autor de la reseña */}
                  {(isAdmin || (user && user.id === review.userId)) && (
                    <button
                      onClick={() => handleDeleteReview(review._id)}
                      className={styles.deleteReviewButton}
                      disabled={isLoading}
                    >
                      <Trash2 size={16} />
                      Eliminar
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className={styles.cardActions}>
        {driveLink && (
          <a
            href={driveLink}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.downloadLink}
            aria-label={`Leer o descargar ${title}`}
          >
            <BookOpen size={18} />
            <span>Leer o Descargar</span>
          </a>
        )}

        <Link to={`/book/${id}`} className={styles.detailLink}>
          <button className={styles.detailButton}>Ver detalles</button>
        </Link>
      </div>
    </article>
  );
};

export default BookCard;
