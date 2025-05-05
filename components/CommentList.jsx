import { useCommentContext } from "../context/useCommentContext";
import Comment from "./Comment";
import styles from "../styles/CommentList.module.css";

const CommentList = () => {
  const { comments } = useCommentContext();

  if (comments.length === 0) {
    return <p className={styles.emptyMessage}>Todavía no hay comentarios.</p>;
  }

  return (
    <div className={styles.listContainer}>
      {comments.map((comment) => (
        <Comment key={comment.id} id={comment.id} text={comment.text} />
      ))}
    </div>
  );
};

export default CommentList;
