import { NavLink } from 'react-router-dom';
import styles from './Footer.module.css';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <p className={styles.tagline}>From pixels to implementation clarity.</p>
        <nav className={styles.links} aria-label="Footer">
          <NavLink to="/sample" className={styles.link}>
            Sample documentation
          </NavLink>
          <NavLink to="/projects" className={styles.link}>
            Projects
          </NavLink>
        </nav>
      </div>
    </footer>
  );
}
