// context/useCommentContext.jsx
import { useContext } from "react";
import { CommentContext } from "./CommentContext";

export const useCommentContext = () => {
  return useContext(CommentContext);
};
