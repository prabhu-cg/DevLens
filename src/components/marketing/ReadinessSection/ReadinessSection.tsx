import { ProgressBar } from '../../ui';
import styles from './ReadinessSection.module.css';

const breakdown = [
  { label: 'Components', value: 96 },
  { label: 'States', value: 90 },
  { label: 'Interactions', value: 91 },
  { label: 'Responsive', value: 94 },
  { label: 'Accessibility', value: 89 },
  { label: 'Tokens', value: 98 },
];

export function ReadinessSection() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <h2 className={styles.title}>Know when your design is ready to hand off.</h2>
        <div className={styles.panel}>
          <div className={styles.scoreColumn}>
            <span className={styles.score}>92%</span>
            <span className={styles.scoreLabel}>Handoff ready</span>
            <p className={styles.disclaimer}>
              Readiness measures documentation completeness — not design quality.
            </p>
          </div>
          <div className={styles.bars}>
            {breakdown.map((item) => (
              <ProgressBar key={item.label} label={item.label} value={item.value} tone="success" />
            ))}
            <div className={styles.openQuestions}>
              <span className={styles.openQuestionsLabel}>Open questions</span>
              <span className={styles.openQuestionsValue}>3</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
