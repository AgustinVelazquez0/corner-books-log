// src/App.jsx
import { CommentProvider } from "../context/CommentProvider";
import BookCategoryProvider from "../context/BookCategoryProvider";
import { BookAuthorProvider } from "../context/BookAuthorProvider";

import { Routes, Route, BrowserRouter } from "react-router-dom"; // Importa BrowserRouter
import Header from "../components/Header";
import BookList from "../components/BookList";
import Footer from "../components/Footer";
import CommentForm from "../components/CommentForm";
import CommentList from "../components/CommentList";
import Account from "./pages/Account";

function App() {
  return (
    <BrowserRouter>
      {" "}
      {/* Asegúrate de envolver toda la aplicación con BrowserRouter */}
      <BookCategoryProvider>
        <BookAuthorProvider>
          <Header />
          <main>
            <Routes>
              {/* ✅ Ruta del home, ahora renderiza el contenido que antes se mostraba siempre */}
              <Route
                path="/"
                element={
                  <CommentProvider>
                    <section>
                      <BookList />
                      <CommentForm />
                      <CommentList />
                    </section>
                  </CommentProvider>
                }
              />

              {/* ✅ Ruta hacia Mi Cuenta */}
              <Route path="/account" element={<Account />} />
            </Routes>
          </main>
          <Footer />
        </BookAuthorProvider>
      </BookCategoryProvider>
    </BrowserRouter>
  );
}

export default App;
