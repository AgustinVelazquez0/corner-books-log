// src/App.jsx
import { CommentProvider } from "../context/CommentProvider";
import BookCategoryProvider from "../context/BookCategoryProvider";
import { BookAuthorProvider } from "../context/BookAuthorProvider";

import Header from "../components/Header";
import BookList from "../components/BookList";
import Footer from "../components/Footer";
import CommentForm from "../components/CommentForm";
import CommentList from "../components/CommentList";

function App() {
  return (
    <BookCategoryProvider>
      <BookAuthorProvider>
        {" "}
        {/* Asegúrate de envolver BookList con BookAuthorProvider */}
        <Header />
        <main>
          <BookList />
          <CommentProvider>
            <section>
              <CommentForm />
              <CommentList />
            </section>
          </CommentProvider>
        </main>
        <Footer />
      </BookAuthorProvider>
    </BookCategoryProvider>
  );
}

export default App;
