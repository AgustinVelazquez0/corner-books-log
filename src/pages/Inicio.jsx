import { useState, useEffect } from "react";
import BookList from "../../components/BookList";
import styles from "../../styles/Inicio.module.css";
import { getAllBooks } from "../../services/bookService";
import localBooks from "../data/books.json"; // Fallback

const Inicio = () => {
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [recentBooks, setRecentBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadBooks = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log("🔄 Cargando libros desde la API...");

        // Intentar cargar desde la API
        const books = await getAllBooks();

        console.log("✅ Libros cargados desde la API:", books.length);

        // Normalizar estructura: asegurar que todos los libros tengan id
        const normalizedBooks = books.map((book) => ({
          ...book,
          id: book.id || book.numericId || book._id,
        }));

        // Filtrar para obtener libros destacados (con rating >= 4)
        const featured = normalizedBooks
          .filter((book) => book.rating >= 4)
          .slice(0, 10);

        // Obtener los libros más recientes
        const recent = [...normalizedBooks]
          .sort(
            (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
          )
          .slice(0, 10);

        setFeaturedBooks(featured);
        setRecentBooks(recent);
      } catch (err) {
        console.error("❌ Error al cargar libros desde la API:", err);
        console.log("🔄 Usando datos locales como fallback...");

        setError("Error al conectar con el servidor. Mostrando datos locales.");

        // Fallback a datos locales
        const featured = localBooks
          .filter((book) => book.rating >= 4)
          .slice(0, 10);
        const recent = [...localBooks]
          .sort(
            (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
          )
          .slice(0, 10);

        setFeaturedBooks(featured);
        setRecentBooks(recent);
      } finally {
        setLoading(false);
      }
    };

    loadBooks();
  }, []);

  if (loading) {
    return <div className={styles.loading}>🔄 Cargando libros...</div>;
  }

  return (
    <div className={styles.inicioContainer}>
      {error && (
        <div
          style={{
            background: "#fff3cd",
            color: "#856404",
            padding: "10px",
            borderRadius: "5px",
            margin: "10px 0",
            border: "1px solid #ffeaa7",
          }}
        >
          ⚠️ {error}
        </div>
      )}

      <section className={styles.hero}>
        <h1>Biblioteca Virtual</h1>
        <p>
          Explora nuestra colección de libros, deja reseñas y encuentra tus
          próximas lecturas favoritas
        </p>
      </section>

      <section className={styles.featuredSection}>
        <BookList books={featuredBooks} listTitle="Libros Mejor Valorados" />
      </section>

      <section className={styles.recentSection}>
        <BookList books={recentBooks} listTitle="Últimas Incorporaciones" />
      </section>
    </div>
  );
};

export default Inicio;
