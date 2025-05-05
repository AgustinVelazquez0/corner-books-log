import { useState } from "react";
import { useCommentContext } from "../context/useCommentContext";
import styles from "../styles/CommentForm.module.css";

const CommentForm = () => {
  const [text, setText] = useState("");
  const { addComment } = useCommentContext();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim() === "") return;
    addComment(text);
    setText("");
  };

  return (
    <form className={styles.formContainer} onSubmit={handleSubmit}>
      <textarea
        className={styles.textarea}
        placeholder="Escribí tu comentario..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={4}
      />
      <button className={styles.submitButton} type="submit">
        Enviar
      </button>
    </form>
  );
};

export default CommentForm;
