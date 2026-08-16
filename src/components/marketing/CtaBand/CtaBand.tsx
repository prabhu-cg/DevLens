import { NavLink } from 'react-router-dom';
import { Button } from '../../ui';
import styles from './CtaBand.module.css';

export function CtaBand() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <h2 className={styles.title}>Ready to see what your file is actually saying?</h2>
        <div className={styles.actions}>
          <Button asChild size="lg">
            <NavLink to="/projects/new">Start a project</NavLink>
          </Button>
          <Button asChild variant="ghost" size="lg">
            <NavLink to="/sample">See a sample first</NavLink>
          </Button>
        </div>
      </div>
    </section>
  );
}
