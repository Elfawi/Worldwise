import styles from "./Footer.module.css";
function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className={styles.footer}>
      <p className={styles.copyright}>
        &copy; copyright {year} by Worldwise Inc.
      </p>
    </footer>
  );
}

export default Footer;
