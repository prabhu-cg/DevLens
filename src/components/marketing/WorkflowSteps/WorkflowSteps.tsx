import styles from './WorkflowSteps.module.css';

const steps = [
  {
    title: 'Import',
    description: 'Bring in a Figma file and DevLens reads its structure locally.',
  },
  {
    title: 'Analyse',
    description: 'Pages, components, tokens, and interactions are indexed automatically.',
  },
  {
    title: 'Identify ambiguity',
    description: 'DevLens flags states, spacing, and behaviour left open to interpretation.',
  },
  {
    title: 'Document intent',
    description: 'Capture the reasoning behind decisions before it lives only in your head.',
  },
  {
    title: 'Resolve questions',
    description: 'Answer the specific questions a developer would otherwise ask you directly.',
  },
  {
    title: 'Audit handoff',
    description: 'Every screen is checked against the documentation you’ve written.',
  },
  {
    title: 'Calculate readiness',
    description: 'See exactly how much of the file is genuinely ready to build.',
  },
  {
    title: 'Generate documentation',
    description: 'Produce developer-facing docs straight from what you’ve resolved.',
  },
];

export function WorkflowSteps() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <span className={styles.eyebrow}>How it works</span>
          <h2 className={styles.title}>One file, eight steps to a handoff worth trusting.</h2>
          <p className={styles.description}>
            DevLens follows the same path a careful designer already takes before sending a file to
            engineering — it just makes each step visible and repeatable.
          </p>
        </div>
        <ol className={styles.list}>
          {steps.map((step, index) => (
            <li key={step.title} className={styles.step}>
              <span className={styles.index}>{String(index + 1).padStart(2, '0')}</span>
              <span className={styles.stepTitle}>{step.title}</span>
              <span className={styles.stepDescription}>{step.description}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
