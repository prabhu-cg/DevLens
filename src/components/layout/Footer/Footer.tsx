import { Link } from 'react-router-dom';
import logo from '../../../assets/devlens-logo.svg';
import styles from './Footer.module.css';

const links = [
  { label: 'How it works', to: '/#how-it-works' },
  { label: 'Sample', to: '/sample' },
  { label: 'FAQ', to: '/#faq' },
  { label: 'Privacy', to: '/#privacy' },
  { label: 'Terms', to: '/terms' },
];

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.top}>
          <div>
            <Link to="/" className={styles.brand}>
              <img src={logo} alt="" className={styles.mark} />
              <span className={styles.name}>
                Dev<span className={styles.accent}>Lens</span>
              </span>
            </Link>
            <p className={styles.tagline}>From pixels to implementation clarity.</p>
          </div>
          <nav className={styles.links} aria-label="Footer">
            {links.map((link) => (
              <Link key={link.label} to={link.to} className={styles.link}>
                {link.label}
              </Link>
            ))}
            <a
              href="https://github.com/prabhu-cg/DevLens"
              className={styles.link}
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
          </nav>
        </div>
        <p className={styles.bottom}>
          Built for designers who care about what happens after the handoff.
        </p>
      </div>
    </footer>
  );
}
