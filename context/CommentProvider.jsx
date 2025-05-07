// context/CommentProvider.jsx
import React, { useState } from "react";
import { CommentContext } from "./CommentContext";
import { useAuth } from "./AuthContext"; // Importar useAuth

export const CommentProvider = ({ children }) => {
  const [comments, setComments] = useState([]);
  const { user, isAuthenticated } = useAuth(); // Obtener información del usuario autenticado

  const addComment = (text) => {
    const newComment = {
      id: Date.now().toString(),
      text,
      createdAt: new Date(),
      // Incluir información del autor si está autenticado
      authorId: isAuthenticated ? user.id : null,
      authorName: isAuthenticated ? user.name : "Usuario Anónimo",
    };

    setComments((prevComments) => [...prevComments, newComment]);
  };

  const deleteComment = (commentId) => {
    setComments((prevComments) =>
      prevComments.filter((comment) => comment.id !== commentId)
    );
  };

  return (
    <CommentContext.Provider value={{ comments, addComment, deleteComment }}>
      {children}
    </CommentContext.Provider>
  );
};
