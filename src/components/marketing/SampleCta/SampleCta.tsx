import { NavLink } from 'react-router-dom';
import { Button } from '../../ui';
import { useCreateEditableSample } from '../../../hooks/useCreateEditableSample';
import styles from './SampleCta.module.css';

export function SampleCta() {
  const { createEditableSample, isCreating } = useCreateEditableSample();

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.text}>
          <h2 className={styles.title}>See what a complete handoff looks like.</h2>
          <p className={styles.description}>
            Explore a fictional banking dashboard documented from design intent through
            implementation behaviour.
          </p>
          <span className={styles.projectName}>FinEdge Banking Dashboard</span>
        </div>
        <div className={styles.actions}>
          <Button asChild size="lg">
            <NavLink to="/sample">View sample handoff</NavLink>
          </Button>
          <Button
            variant="secondary"
            size="lg"
            isLoading={isCreating}
            onClick={createEditableSample}
          >
            Create editable copy
          </Button>
        </div>
      </div>
    </section>
  );
}
