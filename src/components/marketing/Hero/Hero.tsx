import { NavLink } from 'react-router-dom';
import { Lock, MonitorSmartphone, WifiOff } from 'lucide-react';
import { Button } from '../../ui';
import styles from './Hero.module.css';

const meta = [
  { icon: MonitorSmartphone, label: 'Runs entirely in your browser' },
  { icon: Lock, label: 'Your designs never leave your device' },
  { icon: WifiOff, label: 'Works offline after import' },
];

export function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.inner}>
        <span className={styles.eyebrow}>Design handoff, clarified</span>
        <h1 className={styles.headline}>From pixels to implementation clarity.</h1>
        <p className={styles.subheadline}>
          DevLens reads your Figma file, surfaces the decisions it can&apos;t make for you, and
          turns your intent into documentation a developer can build from — without a server in
          between.
        </p>
        <div className={styles.actions}>
          <Button asChild size="lg">
            <NavLink to="/projects/new">Start a project</NavLink>
          </Button>
          <Button asChild variant="secondary" size="lg">
            <NavLink to="/sample">View sample documentation</NavLink>
          </Button>
        </div>
        <div className={styles.meta}>
          {meta.map(({ icon: Icon, label }) => (
            <span key={label} className={styles.metaItem}>
              <Icon size={16} className={styles.metaIcon} aria-hidden="true" />
              {label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
