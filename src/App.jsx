import { Routes, Route } from "react-router-dom";
import Header from "../components/Header";
import BookList from "../components/BookList";
import Footer from "../components/Footer";
import CommentForm from "../components/CommentForm";
import CommentList from "../components/CommentList";
import Account from "./pages/Account";
import BookDetail from "./pages/BookDetail";

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
          <Route path="/account" element={<Account />} />
          <Route path="/book/:id" element={<BookDetail />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;
