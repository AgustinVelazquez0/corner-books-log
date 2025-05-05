import { useState, useEffect } from "react";
import { CommentContext } from "./CommentContext";

export const CommentProvider = ({ children }) => {
  const [comments, setComments] = useState([]);

  // Cargar los comentarios desde localStorage al iniciar
  useEffect(() => {
    const storedComments = JSON.parse(localStorage.getItem("comments"));
    if (storedComments) {
      setComments(storedComments);
    }
  }, []);

  // Guardar los comentarios en localStorage cada vez que cambian
  useEffect(() => {
    if (comments.length > 0) {
      localStorage.setItem("comments", JSON.stringify(comments));
    } else {
      localStorage.removeItem("comments"); // Eliminar localStorage si no hay comentarios
    }
  }, [comments]);

  const addComment = (text) => {
    const newComment = {
      id: Date.now(),
      text,
    };
    const updatedComments = [newComment, ...comments];
    setComments(updatedComments);
  };

  const deleteComment = (id) => {
    const updatedComments = comments.filter((c) => c.id !== id);
    setComments(updatedComments);
  };

  return (
    <CommentContext.Provider value={{ comments, addComment, deleteComment }}>
      {children}
    </CommentContext.Provider>
  );
};
