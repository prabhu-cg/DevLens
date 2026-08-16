import { CircleCheck, TriangleAlert } from 'lucide-react';
import { Badge, Card, ProgressBar } from '../../ui';
import styles from './HeroPreview.module.css';

const readiness = [
  { label: 'Components', value: 94 },
  { label: 'States', value: 72 },
  { label: 'Interactions', value: 81 },
  { label: 'Responsive', value: 91 },
  { label: 'Accessibility', value: 76 },
];

const questions = [
  {
    component: 'Button',
    question: 'What happens while the action is loading?',
    status: 'open' as const,
  },
  {
    component: 'Search',
    question: 'What happens when there are no results?',
    status: 'open' as const,
  },
  {
    component: 'Transaction table',
    question: 'How does this behave on mobile?',
    status: 'open' as const,
  },
  {
    component: 'Modal',
    question: 'Escape closes the modal.',
    status: 'resolved' as const,
  },
];

export function HeroPreview() {
  return (
    <section className={styles.section} aria-label="Example DevLens handoff preview">
      <div className={styles.inner}>
        <Card className={styles.panel}>
          <span className={styles.eyebrow}>Handoff readiness</span>
          <div className={styles.score}>
            86<span className={styles.scoreUnit}>%</span>
          </div>
          <div className={styles.bars}>
            {readiness.map((item) => (
              <ProgressBar key={item.label} label={item.label} value={item.value} />
            ))}
          </div>
          <div className={styles.footerRow}>
            <Badge variant="neutral">7 developer questions</Badge>
            <Badge variant="warning">4 open questions</Badge>
          </div>
        </Card>

        <Card className={styles.panel}>
          <span className={styles.questionsTitle}>Developer questions</span>
          <div className={styles.questionList}>
            {questions.map((item) => (
              <div key={item.component + item.question} className={styles.question}>
                {item.status === 'open' ? (
                  <TriangleAlert
                    size={16}
                    className={`${styles.questionIcon} ${styles.iconOpen}`}
                    aria-hidden="true"
                  />
                ) : (
                  <CircleCheck
                    size={16}
                    className={`${styles.questionIcon} ${styles.iconResolved}`}
                    aria-hidden="true"
                  />
                )}
                <div>
                  <p className={styles.questionComponent}>{item.component}</p>
                  <p className={styles.questionText}>{item.question}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </section>
  );
}
