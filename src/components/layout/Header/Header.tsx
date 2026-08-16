import { NavLink } from 'react-router-dom';
import { Button } from '../../ui';
import { cn } from '../../../utils/cn';
import styles from './Header.module.css';

const navItems = [
  { to: '/projects', label: 'Projects' },
  { to: '/sample', label: 'Sample' },
];

export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <NavLink to="/" className={styles.brand}>
          <span className={styles.mark} aria-hidden="true">
            D
          </span>
          <span className={styles.name}>DevLens</span>
        </NavLink>
        <nav className={styles.nav} aria-label="Primary">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => cn(styles.navLink, isActive && styles.navLinkActive)}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className={styles.actions}>
          <Button variant="secondary" size="sm" asChild>
            <NavLink to="/projects/new">New project</NavLink>
          </Button>
        </div>
      </div>
    </header>
  );
}
