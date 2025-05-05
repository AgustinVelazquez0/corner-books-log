import { useCommentContext } from "../context/useCommentContext";
import styles from "../styles/Comment.module.css";

const Comment = ({ id, text }) => {
  const { deleteComment } = useCommentContext();

  return (
    <div className={styles.commentContainer}>
      <div className={styles.commentHeader}>
        <span className={styles.commentAuthor}>Usuario Anónimo</span>
        <span className={styles.commentDate}>
          {new Date().toLocaleDateString()}
        </span>
      </div>
      <p className={styles.commentText}>{text}</p>
      <button onClick={() => deleteComment(id)}>Eliminar</button>
    </div>
  );
};

export default Comment;
