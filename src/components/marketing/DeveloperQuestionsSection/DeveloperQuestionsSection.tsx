import styles from './DeveloperQuestionsSection.module.css';

const questions = [
  { component: 'Button', question: 'What happens while the action is loading?' },
  { component: 'Search', question: 'What happens when no results are returned?' },
  { component: 'Form', question: 'What validation appears when the field is invalid?' },
  { component: 'Modal', question: 'Can the user dismiss this with Escape?' },
  { component: 'Table', question: 'What happens on mobile?' },
];

export function DeveloperQuestionsSection() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <h2 className={styles.title}>What will your developer ask?</h2>
          <p className={styles.description}>
            DevLens looks beyond the pixels to surface the questions that usually appear during
            development.
          </p>
        </div>
        <div className={styles.list}>
          {questions.map((item) => (
            <div key={item.component} className={styles.item}>
              <span className={styles.marker} aria-hidden="true" />
              <div>
                <p className={styles.component}>{item.component}</p>
                <p className={styles.question}>{item.question}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
