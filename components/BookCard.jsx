import { useState } from "react";
import { Link } from "react-router-dom"; // ✅ 1. Importar Link
import { Heart, BookOpen, Star, ChevronDown, ChevronUp } from "lucide-react";
import styles from "../styles/BookCard.module.css";

const BookCard = ({
  id, // ✅ 2. Agregar prop id
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
