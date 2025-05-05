import { useState } from "react";
import { BookCategoryContext } from "./BookCategoryContext";

const BookCategoryProvider = ({ children }) => {
  const [selectedCategory, setSelectedCategory] = useState("");

  return (
    <BookCategoryContext.Provider
      value={{ selectedCategory, setSelectedCategory }}
    >
      {children}
    </BookCategoryContext.Provider>
  );
};

export default BookCategoryProvider;
