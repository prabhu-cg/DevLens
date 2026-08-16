import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { Button, Drawer, IconButton } from '../../ui';
import logo from '../../../assets/devlens-logo.svg';
import styles from './Header.module.css';

type NavItem =
  { kind: 'hash'; hash: string; label: string } | { kind: 'route'; to: string; label: string };

const navItems: NavItem[] = [
  { kind: 'hash', hash: 'how-it-works', label: 'How it works' },
  { kind: 'route', to: '/sample', label: 'Sample handoff' },
  { kind: 'hash', hash: 'faq', label: 'FAQ' },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link to="/" className={styles.brand}>
          <img src={logo} alt="" className={styles.mark} />
          <span className={styles.name}>
            Dev<span className={styles.accent}>Lens</span>
          </span>
        </Link>

        <nav className={styles.nav} aria-label="Primary">
          {navItems.map((item) =>
            item.kind === 'hash' ? (
              <Link key={item.label} to={`/#${item.hash}`} className={styles.navLink}>
                {item.label}
              </Link>
            ) : (
              <NavLink key={item.label} to={item.to} className={styles.navLink}>
                {item.label}
              </NavLink>
            ),
          )}
        </nav>

        <div className={styles.actions}>
          <span className={styles.desktopCta}>
            <Button asChild size="sm">
              <NavLink to="/projects/new">Start free</NavLink>
            </Button>
          </span>
          <span className={styles.menuButton}>
            <IconButton
              icon={<Menu aria-hidden="true" />}
              label="Open menu"
              onClick={() => setMobileOpen(true)}
            />
          </span>
        </div>
      </div>

      <Drawer
        open={mobileOpen}
        onOpenChange={setMobileOpen}
        title="Menu"
        description="Navigate DevLens"
      >
        <nav className={styles.mobileNav} aria-label="Mobile">
          {navItems.map((item) =>
            item.kind === 'hash' ? (
              <Link
                key={item.label}
                to={`/#${item.hash}`}
                className={styles.mobileNavLink}
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            ) : (
              <NavLink
                key={item.label}
                to={item.to}
                className={styles.mobileNavLink}
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </NavLink>
            ),
          )}
        </nav>
        <div className={styles.mobileActions}>
          <Button asChild fullWidth onClick={() => setMobileOpen(false)}>
            <NavLink to="/projects/new">Start free</NavLink>
          </Button>
        </div>
      </Drawer>
    </header>
  );
}
