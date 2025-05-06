import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { CommentProvider } from "../context/CommentProvider";
import BookCategoryProvider from "../context/BookCategoryProvider";
import { BookAuthorProvider } from "../context/BookAuthorProvider";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <BookCategoryProvider>
        <BookAuthorProvider>
          <CommentProvider>
            <App />
          </CommentProvider>
        </BookAuthorProvider>
      </BookCategoryProvider>
    </BrowserRouter>
  </React.StrictMode>
);
