import { NavLink } from 'react-router-dom';
import { Button } from '../../ui';
import styles from './Hero.module.css';

export function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.inner}>
        <span className={styles.eyebrow}>Design → development</span>
        <h1 className={styles.headline}>From pixels to implementation clarity.</h1>
        <p className={styles.subheadline}>
          DevLens turns your Figma designs into structured, developer-ready documentation by
          capturing the decisions, behaviours and edge cases that pixels alone don&apos;t explain.
        </p>
        <div className={styles.actions}>
          <Button asChild size="lg">
            <NavLink to="/projects/new">Start documenting — Free</NavLink>
          </Button>
          <Button asChild variant="secondary" size="lg">
            <NavLink to="/sample">See sample handoff</NavLink>
          </Button>
        </div>
        <p className={styles.microcopy}>Free · Local-first · No account · No database</p>
      </div>
    </section>
  );
}
