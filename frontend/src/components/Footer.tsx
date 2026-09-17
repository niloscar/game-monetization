import { Link } from "react-router-dom";
import styles from "./footer.module.css";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <p>pizza arcade &copy; 2026</p>

      <div className={styles.links}>
        <Link to="/terms">villkor</Link>
        <Link to="/contact">kontakt</Link>
      </div>
    </footer>
  );
};

export default Footer;