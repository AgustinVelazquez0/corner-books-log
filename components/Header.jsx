import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../styles/Header.module.css";
import { useBookCategory } from "../context/useBookCategory";
import { useBookAuthor } from "../context/useBookAuthor";
import {
  Book,
  Search,
  User,
  Menu,
  X,
  Home,
  Filter,
  BookOpen,
  RefreshCcw,
} from "lucide-react";
import books from "../src/data/books.json";

const Header = () => {
  const navigate = useNavigate();

  // Estados para manejo de UI
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCategoryDropdownVisible, setIsCategoryDropdownVisible] =
    useState(false);
  const [isAuthorDropdownVisible, setIsAuthorDropdownVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Referencias para cerrar los dropdowns al hacer clic fuera
  const categoryDropdownRef = useRef(null);
  const authorDropdownRef = useRef(null);
  const searchRef = useRef(null);

  // Contextos para filtros
  const { selectedCategory, setSelectedCategory } = useBookCategory();
  const { selectedAuthor, setSelectedAuthor } = useBookAuthor();

  // Extraer categorías y autores únicos del JSON de libros
  const uniqueCategories = [
    ...new Set(books.map((book) => book.category)),
  ].sort();
  const uniqueAuthors = [...new Set(books.map((book) => book.author))].sort();

  // Manejar clics fuera de los dropdowns
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(event.target)
      ) {
        setIsCategoryDropdownVisible(false);
      }
      if (
        authorDropdownRef.current &&
        !authorDropdownRef.current.contains(event.target)
      ) {
        setIsAuthorDropdownVisible(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Toggle para el menú móvil
  const toggleMobileMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Toggle para filtros
  const toggleCategoryDropdown = (e) => {
    e.stopPropagation();
    setIsCategoryDropdownVisible(!isCategoryDropdownVisible);
    setIsAuthorDropdownVisible(false);
  };

  const toggleAuthorDropdown = (e) => {
    e.stopPropagation();
    setIsAuthorDropdownVisible(!isAuthorDropdownVisible);
    setIsCategoryDropdownVisible(false);
  };

  // Manejadores de selección
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setIsCategoryDropdownVisible(false);
  };

  const handleAuthorSelect = (author) => {
    setSelectedAuthor(author);
    setIsAuthorDropdownVisible(false);
  };

  // Nueva función para realizar la búsqueda
  const handleSearch = () => {
    if (searchQuery.trim()) {
      // Navegar a la página de resultados de búsqueda con el query como parámetro
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      // También cerramos el menú móvil si está abierto
      setIsMenuOpen(false);
    }
  };

  // Manejar evento de tecla Enter en la búsqueda
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Limpiar todos los filtros
  const clearAllFilters = () => {
    setSelectedCategory(null);
    setSelectedAuthor(null);
    setSearchQuery("");
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        {/* Logo y título */}
        <div className={styles.logoContainer}>
          <BookOpen size={28} className={styles.logoIcon} />
          <div className={styles.titleContainer}>
            <h1 className={styles.title}>Corner Rare Books</h1>
            <p className={styles.subtitle}>
              Tu rincón para descubrir y comentar libros
            </p>
          </div>
        </div>

        {/* Botón de menú móvil */}
        <button
          className={styles.mobileMenuButton}
          onClick={toggleMobileMenu}
          aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Navegación */}
        <nav className={`${styles.nav} ${isMenuOpen ? styles.navOpen : ""}`}>
          {/* Barra de búsqueda */}
          <div
            className={`${styles.searchContainer} ${
              isSearchFocused ? styles.searchFocused : ""
            }`}
            ref={searchRef}
          >
            <button
              onClick={handleSearch}
              style={{
                background: "none",
                border: "none",
                padding: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
              aria-label="Buscar"
            >
              <Search size={18} className={styles.searchIcon} />
            </button>
            <input
              type="text"
              placeholder="Buscar libros..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className={styles.searchInput}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
            />
          </div>

          {/* Enlaces de navegación */}
          <ul className={styles.navLinks}>
            <li className={styles.navItem}>
              {/* Link a Home */}
              <Link to="/" className={styles.navLink}>
                <Home size={18} />
                <span>Inicio</span>
              </Link>
            </li>
            <li className={styles.navItem}>
              {/* Link a Catalogo */}
              <Link to="/catalogo" className={styles.navLink}>
                <Book size={18} />
                <span>Catálogo</span>
              </Link>
            </li>
            <li className={styles.navItem}>
              {/* Link a Mi Cuenta */}
              <Link to="/account" className={styles.navLink}>
                <User size={18} />
                <span>Mi Cuenta</span>
              </Link>
            </li>
          </ul>

          {/* Filtros */}
          <div className={styles.filterContainer}>
            {/* Indicador de filtros activos */}
            {(selectedCategory || selectedAuthor) && (
              <div className={styles.activeFilters}>
                <Filter size={16} />
                <span>Filtros activos:</span>
                {selectedCategory && (
                  <span className={styles.filterBadge}>
                    {selectedCategory}
                    <button
                      onClick={() => setSelectedCategory(null)}
                      className={styles.clearFilterButton}
                      aria-label="Eliminar filtro de categoría"
                    >
                      <X size={12} />
                    </button>
                  </span>
                )}
                {selectedAuthor && (
                  <span className={styles.filterBadge}>
                    {selectedAuthor}
                    <button
                      onClick={() => setSelectedAuthor(null)}
                      className={styles.clearFilterButton}
                      aria-label="Eliminar filtro de autor"
                    >
                      <X size={12} />
                    </button>
                  </span>
                )}
                <button
                  onClick={clearAllFilters}
                  className={styles.clearAllButton}
                  aria-label="Limpiar todos los filtros"
                >
                  <RefreshCcw size={14} />
                  <span>Limpiar</span>
                </button>
              </div>
            )}

            {/* Dropdown de categorías */}
            <div className={styles.dropdownWrapper} ref={categoryDropdownRef}>
              <button
                className={`${styles.dropdownButton} ${
                  selectedCategory ? styles.activeButton : ""
                }`}
                onClick={toggleCategoryDropdown}
                aria-expanded={isCategoryDropdownVisible}
                aria-label="Filtrar por categoría"
              >
                <span>Categorías</span>
                {selectedCategory && (
                  <span className={styles.filterCount}>1</span>
                )}
              </button>

              {isCategoryDropdownVisible && (
                <div className={styles.dropdownMenu}>
                  <div className={styles.dropdownHeader}>
                    <span>Filtrar por categoría</span>
                    {selectedCategory && (
                      <button
                        onClick={() => setSelectedCategory(null)}
                        className={styles.clearButton}
                        aria-label="Limpiar selección de categoría"
                      >
                        Limpiar
                      </button>
                    )}
                  </div>
                  <ul className={styles.dropdownList}>
                    {uniqueCategories.map((category) => (
                      <li
                        key={category}
                        className={`${styles.dropdownItem} ${
                          selectedCategory === category ? styles.active : ""
                        }`}
                        onClick={() => handleCategorySelect(category)}
                      >
                        {category}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Dropdown de autores */}
            <div className={styles.dropdownWrapper} ref={authorDropdownRef}>
              <button
                className={`${styles.dropdownButton} ${
                  selectedAuthor ? styles.activeButton : ""
                }`}
                onClick={toggleAuthorDropdown}
                aria-expanded={isAuthorDropdownVisible}
                aria-label="Filtrar por autor"
              >
                <span>Autores</span>
                {selectedAuthor && (
                  <span className={styles.filterCount}>1</span>
                )}
              </button>

              {isAuthorDropdownVisible && (
                <div className={styles.dropdownMenu}>
                  <div className={styles.dropdownHeader}>
                    <span>Filtrar por autor</span>
                    {selectedAuthor && (
                      <button
                        onClick={() => setSelectedAuthor(null)}
                        className={styles.clearButton}
                        aria-label="Limpiar selección de autor"
                      >
                        Limpiar
                      </button>
                    )}
                  </div>
                  <ul className={styles.dropdownList}>
                    {uniqueAuthors.map((author) => (
                      <li
                        key={author}
                        className={`${styles.dropdownItem} ${
                          selectedAuthor === author ? styles.active : ""
                        }`}
                        onClick={() => handleAuthorSelect(author)}
                      >
                        {author}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
