import { useContext } from "react";
import { BookCategoryContext } from "./BookCategoryContext";

export const useBookCategory = () => useContext(BookCategoryContext);
