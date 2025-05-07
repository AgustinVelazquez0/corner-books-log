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
} from "lucide-react";
import styles from "../styles/BookCard.module.css";

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

  const isAdmin = true;

  // Fetch reviews from API
  useEffect(() => {
    fetch(`/api/reviews/${id}`)
      .then((response) => response.json())
      .then((data) => setReviews(data))
      .catch((error) => console.error("Error fetching reviews:", error));
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

  const toggleReviews = () => {
    setShowReviews(!showReviews);
  };

  const toggleReviewForm = () => {
    setShowReviewForm(!showReviewForm);
  };

  const handleSendReview = () => {
    const newReview = {
      id,
      title,
      userRating,
      comment,
      date: new Date().toISOString(),
    };

    // Enviar reseña a la API
    fetch(`/api/reviews/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newReview),
    })
      .then((response) => response.json())
      .then((data) => {
        setReviews((prevReviews) => [...prevReviews, data]);
        alert("¡Gracias por tu reseña!");
        setComment("");
        setUserRating(0);
      })
      .catch((error) => console.error("Error sending review:", error));
  };

  const handleDeleteReview = (reviewToDelete) => {
    fetch(`/api/reviews/${id}/${reviewToDelete.date}`, {
      method: "DELETE",
    })
      .then(() => {
        setReviews((prevReviews) =>
          prevReviews.filter((review) => review.date !== reviewToDelete.date)
        );
        alert("Reseña eliminada");
      })
      .catch((error) => console.error("Error deleting review:", error));
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

        {reviews.length > 0 && (
          <button onClick={toggleReviews} className={styles.reviewToggleButton}>
            <MessageCircle size={16} style={{ marginRight: "4px" }} />
            {showReviews
              ? "Ocultar reseñas"
              : `Ver reseñas (${reviews.length})`}
          </button>
        )}
      </div>

      {/* Formulario de reseña */}
      {showReviewForm && (
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
      )}

      {/* Reseñas guardadas */}
      {reviews.length > 0 && showReviews && (
        <div className={styles.reviewContainer}>
          <h4>Reseñas:</h4>
          <div className={styles.reviews}>
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
