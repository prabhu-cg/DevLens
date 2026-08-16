import styles from './CoreProblem.module.css';

const figmaTellsYou = ['Spacing', 'Typography', 'Colour', 'Layout', 'Assets', 'Components'];

const devLensHelpsDocument = [
  'States',
  'Behaviour',
  'Responsive rules',
  'Accessibility',
  'Validation',
  'Edge cases',
  'Content constraints',
  'Design decisions',
];

export function CoreProblem() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <h2 className={styles.title}>Figma shows what the interface looks like.</h2>
          <p className={styles.statement}>
            Developers also need to know what happens when users interact with it.
          </p>
        </div>
        <div className={styles.columns}>
          <div className={styles.column}>
            <span className={styles.columnTitle}>Figma tells you</span>
            <ul className={styles.list}>
              {figmaTellsYou.map((item) => (
                <li key={item} className={styles.listItem}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className={`${styles.column} ${styles.columnAccent}`}>
            <span className={styles.columnTitle}>DevLens helps document</span>
            <ul className={styles.list}>
              {devLensHelpsDocument.map((item) => (
                <li key={item} className={styles.listItem}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
