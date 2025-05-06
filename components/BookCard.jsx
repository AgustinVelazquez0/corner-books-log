import { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // ✅ 1. Importar Link
import {
  Heart,
  BookOpen,
  Star,
  ChevronDown,
  ChevronUp,
  Send,
  Trash2, // ✅ 2. Importar el ícono de eliminar
} from "lucide-react"; // ✅ Agregado Trash2
import styles from "../styles/BookCard.module.css";

const BookCard = ({
  id, // ✅ 3. Agregar prop id
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

  const [userRating, setUserRating] = useState(0); // ✅ rating interactivo
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState(""); // ✅ comentario
  const [reviews, setReviews] = useState([]); // ✅ Reseñas guardadas

  const isAdmin = true; // ✅ 4. Solo tú puedes borrar comentarios (pónlo a `true` para pruebas)

  useEffect(() => {
    // Obtener reseñas del localStorage al cargar el componente
    const storedReviews = JSON.parse(localStorage.getItem("bookReviews")) || [];
    setReviews(storedReviews.filter((review) => review.id === id)); // Filtrar por ID del libro
  }, [id]);

  const isLongDescription = description.length > 150;
  const shortDescription = isLongDescription
    ? `${description.substring(0, 150)}...`
    : description;

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  const handleSendReview = () => {
    const newReview = {
      id,
      title,
      userRating,
      comment,
      date: new Date().toISOString(),
    };

    const existingReviews =
      JSON.parse(localStorage.getItem("bookReviews")) || [];
    const updatedReviews = [...existingReviews, newReview];
    localStorage.setItem("bookReviews", JSON.stringify(updatedReviews));

    // Actualizamos el estado de reseñas para mostrar la nueva reseña sin recargar
    setReviews([...reviews, newReview]);

    alert("¡Gracias por tu reseña!");
    setComment("");
    setUserRating(0);
  };

  // Función para borrar la reseña
  const handleDeleteReview = (reviewToDelete) => {
    // Filtra las reseñas locales para excluir la reseña que se quiere eliminar
    const updatedReviews = reviews.filter(
      (review) => review.date !== reviewToDelete.date // Comparando por fecha o puedes usar otro campo único
    );
    setReviews(updatedReviews); // Actualiza el estado de reseñas

    // Actualiza el localStorage con las reseñas filtradas (sin la que se eliminó)
    const allReviews = JSON.parse(localStorage.getItem("bookReviews")) || [];
    const filteredReviews = allReviews.filter(
      (review) => review.date !== reviewToDelete.date // Filtra por la fecha (o ID único)
    );
    localStorage.setItem("bookReviews", JSON.stringify(filteredReviews)); // Guarda la nueva lista en localStorage

    alert("Reseña eliminada");
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

      {/* ✅ NUEVA sección de reseña */}
      <div className={styles.reviewSection}>
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
          disabled={userRating === 0 || comment.trim() === ""}
        >
          <Send size={16} style={{ marginRight: "4px" }} />
          Enviar reseña
        </button>
      </div>

      {/* ✅ Mostrar reseñas guardadas */}
      {reviews.length > 0 && (
        <div className={styles.reviews}>
          <h4>Reseñas:</h4>
          {reviews.map((review, index) => (
            <div key={index} className={styles.review}>
              <div className={styles.reviewRating}>
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    fill={i < review.userRating ? "#ffc107" : "none"}
                    color={i < review.userRating ? "#ffc107" : "#d1d1d1"}
                  />
                ))}
                <span className={styles.reviewDate}>
                  {new Date(review.date).toLocaleDateString()}
                </span>
              </div>
              <p className={styles.reviewComment}>{review.comment}</p>

              {/* ✅ Botón para borrar reseña */}
              {isAdmin && (
                <button
                  onClick={() => handleDeleteReview(review)}
                  className={styles.deleteReviewButton}
                >
                  <Trash2 size={16} />
                  Eliminar
                </button>
              )}
            </div>
          ))}
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

        {/* ✅ 3. Link al detalle del libro */}
        <Link to={`/book/${id}`} className={styles.detailLink}>
          <button className={styles.detailButton}>Ver detalles</button>
        </Link>
      </div>
    </article>
  );
};

export default BookCard;
