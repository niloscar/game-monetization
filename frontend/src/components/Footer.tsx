import styles from "./footer.module.css"

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <p>pizza arcade &copy; 2026</p>

      <div className={styles.links}>

        <a href="/terms">villkor</a>
        <a href="/contact">kontakt</a>

      </div>
    </footer>
  )
}

export default Footer