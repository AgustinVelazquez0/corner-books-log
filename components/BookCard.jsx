import { useState, useEffect, useCallback } from "react";
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
import * as reviewService from "../services/reviewService";

const BookCard = ({
  id,
  title,
  author,
  description = "No hay descripción disponible",
  driveLink,
  category,
  coverImage = "/api/placeholder/180/270",
  rating = 0,
  numericId, // Añadido para manejar el caso de IDs numéricos
  _id, // Añadido para manejar el caso de ObjectId directamente
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
  const [successMessage, setSuccessMessage] = useState("");

  // Determinar el ID correcto a usar (numericId, _id o id pasado directamente)
  const effectiveId = numericId || _id || id;

  // Obtenemos la información del usuario autenticado
  const { user, isAuthenticated } = useAuth();
  const isAdmin = user?.role === "admin"; // Ajustado para comprobar el rol real del usuario
  // Definimos fetchReviews con useCallback para evitar problemas de dependencias
  const fetchReviews = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log(
        "Intentando cargar reseñas para el libro con ID:",
        effectiveId
      );

      const response = await reviewService.getBookReviews(effectiveId);

      console.log("Respuesta completa de reviews:", response);

      // Verificar si la respuesta contiene un array de reseñas
      if (response.success && Array.isArray(response.data)) {
        console.log(`Se encontraron ${response.data.length} reseñas`);
        setReviews(response.data);
      } else {
        console.warn("Estructura de respuesta inesperada:", response);
        setReviews([]);
      }

      setIsLoading(false);
    } catch (err) {
      console.error("Error al cargar reseñas:", err);
      setError("No se pudieron cargar las reseñas");
      setReviews([]); // Aseguramos un estado válido incluso en caso de error
      setIsLoading(false);
    }
  }, [effectiveId]);

  // Cargar reseñas al montar el componente y cuando showReviews cambia
  useEffect(() => {
    if (showReviews) {
      fetchReviews();
    }
  }, [effectiveId, showReviews, fetchReviews]); // Añadido fetchReviews como dependencia

  // Cargamos el estado de favorito para este libro
  useEffect(() => {
    // Solo cargar favoritos si el usuario está autenticado
    if (isAuthenticated && user) {
      const userFavorites =
        JSON.parse(localStorage.getItem(`favorites_${user.id}`)) || [];
      // Verificar si este libro está en favoritos
      setIsFavorite(userFavorites.includes(effectiveId)); // Cambiado de id a effectiveId
    }
  }, [effectiveId, isAuthenticated, user]); // Cambiado de id a effectiveId

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
      if (!userFavorites.includes(effectiveId)) {
        // Cambiado de id a effectiveId
        updatedFavorites = [...userFavorites, effectiveId]; // Cambiado de id a effectiveId
      } else {
        updatedFavorites = userFavorites;
      }
    } else {
      // Eliminar de favoritos
      updatedFavorites = userFavorites.filter(
        (bookId) => bookId !== effectiveId
      ); // Cambiado de id a effectiveId
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
    // Limpiar mensajes previos
    setSuccessMessage("");
    setError(null);
  };

  // Reemplaza la función handleSendReview actual con esta versión corregida:

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
      setError(null);
      setSuccessMessage("");

      console.log("ID del libro para la reseña:", effectiveId);
      console.log("Título del libro:", title);

      // Preparamos el objeto de datos para la reseña
      const reviewData = {
        bookId: effectiveId,
        rating: userRating,
        comment: comment,
      };

      // Enviamos la reseña a la API usando el método actualizado
      const response = await reviewService.createReview(reviewData);

      console.log("Respuesta del servidor:", response);

      // Recargamos todas las reseñas para asegurarnos de tener los datos actualizados
      await fetchReviews();

      // Limpiamos el formulario
      setComment("");
      setUserRating(0);
      setShowReviewForm(false);

      // Mostrar mensaje de éxito
      setSuccessMessage("¡Gracias por tu reseña!");

      // Asegurarse de que las reseñas se muestran
      setShowReviews(true);

      setIsLoading(false);
    } catch (err) {
      console.error("Error al enviar la reseña:", err);

      // Mostrar mensaje apropiado según el error
      if (err?.message === "Ya has escrito una reseña para este libro") {
        setError("Ya has escrito una reseña para este libro.");
      } else {
        setError(
          typeof err === "string"
            ? err
            : err.message || "No se pudo enviar la reseña"
        );
      }

      setIsLoading(false);
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
        setError(null);

        // Llamamos a la API para eliminar la reseña
        await reviewService.deleteReview(reviewId);

        // Recargamos todas las reseñas para asegurarnos de tener los datos actualizados
        await fetchReviews();

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

      {/* Mensajes de éxito */}
      {successMessage && (
        <div className={styles.successMessage}>{successMessage}</div>
      )}

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

      {/* Debug: Información sobre los IDs y las reseñas - visible siempre para ayudar con la depuración */}
      {showReviews && (
        <div
          className={styles.debug}
          style={{
            background: "#f5f5f5",
            padding: "10px",
            borderRadius: "4px",
            margin: "10px 0",
            fontSize: "12px",
          }}
        >
          <p>Estado de las reseñas: {isLoading ? "Cargando..." : "Listo"}</p>
          <p>Número de reseñas: {reviews ? reviews.length : 0}</p>
          <p>ID usado: {effectiveId}</p>
          <p>ID original: {id}</p>
          <p>numericId: {numericId || "No proporcionado"}</p>
          <p>_id: {_id || "No proporcionado"}</p>
          <p>Error: {error || "Ninguno"}</p>
        </div>
      )}

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
              {reviews.map((review) => {
                // Verificar que la revisión tiene los campos necesarios
                if (!review || typeof review !== "object") {
                  console.error("Reseña inválida:", review);
                  return null;
                }

                const reviewId = review._id || review.id;
                if (!reviewId) {
                  console.error("Reseña sin ID:", review);
                }

                return (
                  <div key={reviewId} className={styles.review}>
                    <div className={styles.reviewHeader}>
                      <div className={styles.reviewUserInfo}>
                        <User size={14} />
                        <span className={styles.reviewUserName}>
                          {review.username || "Usuario anónimo"}
                        </span>
                      </div>
                      <span className={styles.reviewDate}>
                        {review.createdAt
                          ? new Date(review.createdAt).toLocaleDateString()
                          : "Fecha desconocida"}
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

                    <p className={styles.reviewComment}>
                      {review.comment || "Sin comentario"}
                    </p>

                    {/* Información de la revisión - mantiene la depuración para desarrollo */}
                    <div
                      style={{
                        fontSize: "10px",
                        color: "#666",
                        marginTop: "5px",
                      }}
                    >
                      ID de reseña: {reviewId || "Desconocido"}
                      <br />
                      ID de usuario: {review.userId || "Desconocido"}
                    </div>

                    {/* Mostrar botón de eliminar solo si es admin o es el autor de la reseña */}
                    {(isAdmin || (user && user.id === review.userId)) && (
                      <button
                        onClick={() => handleDeleteReview(reviewId)}
                        className={styles.deleteReviewButton}
                        disabled={isLoading}
                      >
                        <Trash2 size={16} />
                        Eliminar
                      </button>
                    )}
                  </div>
                );
              })}
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

        <Link to={`/book/${effectiveId}`} className={styles.detailLink}>
          <button className={styles.detailButton}>Ver detalles</button>
        </Link>
      </div>
    </article>
  );
};

export default BookCard;
