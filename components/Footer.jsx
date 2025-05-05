import styles from "../styles/Footer.module.css";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <p>
        &copy; {new Date().getFullYear()} Corner Books. Todos los derechos
        reservados.
      </p>
    </footer>
  );
};

export default Footer;
