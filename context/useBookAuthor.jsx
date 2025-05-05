import { useContext } from "react";
import { BookAuthorContext } from "./BookAuthorContext"; // ✅ Esta es la correcta

export const useBookAuthor = () => {
  const context = useContext(BookAuthorContext);

  if (!context) {
    throw new Error(
      "useBookAuthor debe usarse dentro de un BookAuthorProvider"
    );
  }

  return context;
};
