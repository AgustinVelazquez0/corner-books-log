import { Routes, Route } from "react-router-dom";
import Header from "../components/Header";
import BookList from "../components/BookList";
import Footer from "../components/Footer";
import CommentForm from "../components/CommentForm";
import CommentList from "../components/CommentList";
import Account from "./pages/Account";
import BookDetail from "./pages/BookDetail";
import Catalogo from "./pages/Catalogo";
import SearchResults from "./pages/SearchResults";

function App() {
  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route
            path="/"
            element={
              <section>
                <BookList />
                <CommentForm />
                <CommentList />
              </section>
            }
          />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/account" element={<Account />} />
          <Route path="/book/:id" element={<BookDetail />} />
          <Route path="/search" element={<SearchResults />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;
