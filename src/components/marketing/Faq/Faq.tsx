import { Plus } from 'lucide-react';
import styles from './Faq.module.css';

const faqs = [
  {
    question: 'Is DevLens free?',
    answer: 'Yes. The initial product is designed as a free browser-based tool.',
  },
  {
    question: 'Where is my project stored?',
    answer:
      'Projects are intended to be stored locally in your browser rather than in a central database.',
  },
  {
    question: 'Does DevLens replace Figma Dev Mode?',
    answer:
      'No. Figma remains the design source. DevLens focuses on documenting design intent, behaviour and implementation decisions.',
  },
  {
    question: 'Does DevLens use AI?',
    answer:
      'The initial version does not require AI. Its handoff questions and audit rules are deterministic.',
  },
  {
    question: 'Can developers use the output?',
    answer: 'Yes. DevLens generates structured developer-facing documentation.',
  },
  {
    question: 'Does the readiness score measure design quality?',
    answer: 'No. It measures handoff and documentation completeness.',
  },
  {
    question: 'Can I export my documentation?',
    answer: 'Yes. Later versions will support Markdown, HTML, PDF, JSON and ZIP exports.',
  },
];

export function Faq() {
  return (
    <section className={styles.section} id="faq">
      <div className={styles.inner}>
        <h2 className={styles.title}>Frequently asked questions</h2>
        <div className={styles.list}>
          {faqs.map((item) => (
            <details key={item.question} className={styles.item}>
              <summary className={styles.summary}>
                {item.question}
                <Plus size={18} className={styles.icon} aria-hidden="true" />
              </summary>
              <p className={styles.answer}>{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
