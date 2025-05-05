// src/context/BookAuthorProvider.js
import React, { useState } from "react";
import { BookAuthorContext } from "./BookAuthorContext";

// El proveedor de contexto
export const BookAuthorProvider = ({ children }) => {
  const [selectedAuthor, setSelectedAuthor] = useState(null);

  return (
    <BookAuthorContext.Provider value={{ selectedAuthor, setSelectedAuthor }}>
      {children}
    </BookAuthorContext.Provider>
  );
};
