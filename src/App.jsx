import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import AuthRouteGuard from "../components/AuthRouteGuard";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Catalogo from "./pages/Catalogo";
import BookDetail from "./pages/BookDetail";
import Register from "./pages/Register";
import Account from "./pages/Account";
import SearchResults from "./pages/SearchResults";
import Login from "./pages/Login"; // Asumiendo que tienes este componente
import "./App.css";

// Importar los providers
import BookCategoryProvider from "../context/BookCategoryProvider";
import { BookAuthorProvider } from "../context/BookAuthorProvider";
import { CommentProvider } from "../context/CommentProvider";

function App() {
  return (
    <AuthProvider>
      <BookCategoryProvider>
        <BookAuthorProvider>
          <CommentProvider>
            <div className="app-container">
              <Header />
              <main className="content">
                <AuthRouteGuard>
                  <Routes>
                    <Route path="/" element={<Catalogo />} />
                    <Route path="/catalogo" element={<Catalogo />} />
                    <Route path="/book/:id" element={<BookDetail />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/account" element={<Account />} />
                    <Route path="/search" element={<SearchResults />} />
                  </Routes>
                </AuthRouteGuard>
              </main>
              <Footer />
            </div>
          </CommentProvider>
        </BookAuthorProvider>
      </BookCategoryProvider>
    </AuthProvider>
  );
}

export default App;
