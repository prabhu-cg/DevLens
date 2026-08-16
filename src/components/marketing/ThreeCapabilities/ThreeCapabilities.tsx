import styles from './ThreeCapabilities.module.css';

const capabilities = [
  {
    index: '01 — Detect',
    title: 'Find what is missing.',
    description:
      'Identify undocumented states, interactions, responsive behaviours and edge cases.',
  },
  {
    index: '02 — Document',
    title: 'Capture the intent behind the pixels.',
    description: 'Turn design decisions into structured documentation developers can actually use.',
  },
  {
    index: '03 — Handoff',
    title: 'Give developers clarity, not another Figma file.',
    description:
      'Generate structured documentation with components, behaviours, states, tokens and implementation notes.',
  },
];

export function ThreeCapabilities() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <h2 className={styles.title}>Make your handoff clearer before development starts.</h2>
        <div className={styles.grid}>
          {capabilities.map((item) => (
            <div key={item.index} className={styles.item}>
              <span className={styles.index}>{item.index}</span>
              <h3 className={styles.itemTitle}>{item.title}</h3>
              <p className={styles.itemDescription}>{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
