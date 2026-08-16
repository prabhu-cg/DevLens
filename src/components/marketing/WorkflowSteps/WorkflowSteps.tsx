import styles from './WorkflowSteps.module.css';

const steps = [
  { number: '01', text: 'Import your design.' },
  { number: '02', text: 'DevLens analyses what is defined.' },
  { number: '03', text: 'Answer the questions developers will ask.' },
  { number: '04', text: 'Resolve ambiguity and improve handoff readiness.' },
  { number: '05', text: 'Export developer-ready documentation.' },
];

export function WorkflowSteps() {
  return (
    <section className={styles.section} id="how-it-works">
      <div className={styles.inner}>
        <h2 className={styles.title}>From Figma to implementation clarity.</h2>
        <ol className={styles.list}>
          {steps.map((step) => (
            <li key={step.number} className={styles.step}>
              <span className={styles.circle} aria-hidden="true">
                {step.number}
              </span>
              <p className={styles.stepText}>{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
