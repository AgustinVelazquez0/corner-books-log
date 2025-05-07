import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { CommentProvider } from "../context/CommentProvider";
import BookCategoryProvider from "../context/BookCategoryProvider";
import { BookAuthorProvider } from "../context/BookAuthorProvider";
import { AuthProvider } from "../context/AuthContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <BookCategoryProvider>
          <BookAuthorProvider>
            <CommentProvider>
              <App />
            </CommentProvider>
          </BookAuthorProvider>
        </BookCategoryProvider>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
