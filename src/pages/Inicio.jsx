import { useState, useEffect } from "react";
import BookList from "../../components/BookList";
import styles from "../../styles/Inicio.module.css";
import books from "../data/books.json";

const Inicio = () => {
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [recentBooks, setRecentBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Usar directamente los datos del archivo JSON local
    try {
      // Filtrar para obtener libros destacados (con rating >= 4)
      const featured = books.filter((book) => book.rating >= 4).slice(0, 10);

      // Obtener los libros más recientes
      const recent = [...books]
        .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
        .slice(0, 10);

      setFeaturedBooks(featured);
      setRecentBooks(recent);
      setLoading(false);
    } catch (err) {
      console.error("Error al cargar libros:", err);
      setLoading(false);
    }
  }, []);

  if (loading) {
    return <div className={styles.loading}>Cargando libros...</div>;
  }

  return (
    <div className={styles.inicioContainer}>
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
