import { NavLink } from 'react-router-dom';
import { Button } from '../../ui';
import styles from './FinalCta.module.css';

export function FinalCta() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <h2 className={styles.title}>
          Don&apos;t just hand over pixels.
          <br />
          <span className={styles.titleAccent}>Hand over intent.</span>
        </h2>
        <p className={styles.description}>
          Make your next developer handoff clearer, more complete and easier to implement.
        </p>
        <div className={styles.actions}>
          <Button asChild size="lg">
            <NavLink to="/projects/new">Start documenting — Free</NavLink>
          </Button>
          <Button asChild variant="ghost" size="lg">
            <NavLink to="/sample">Explore the sample</NavLink>
          </Button>
        </div>
      </div>
    </section>
  );
}
