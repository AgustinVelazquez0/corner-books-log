import { useCommentContext } from "../context/useCommentContext";
import { useAuth } from "../context/AuthContext"; // Importar el contexto de autenticación
import styles from "../styles/Comment.module.css";

const Comment = ({ id, text, authorId, authorName }) => {
  const { deleteComment } = useCommentContext();
  const { user, isAuthenticated } = useAuth(); // Obtener información del usuario actual

  // Determinar si el comentario es del usuario actual
  const isOwnComment = isAuthenticated && user && authorId === user.id;

  return (
    <div className={styles.commentContainer}>
      <div className={styles.commentHeader}>
        <span className={styles.commentAuthor}>
          {authorName || "Usuario Anónimo"}
        </span>
        <span className={styles.commentDate}>
          {new Date().toLocaleDateString()}
        </span>
      </div>
      <p className={styles.commentText}>{text}</p>
      {/* Solo mostrar el botón eliminar si es el propio comentario del usuario */}
      {isOwnComment && (
        <button onClick={() => deleteComment(id)}>Eliminar</button>
      )}
    </div>
  );
};

export default Comment;
