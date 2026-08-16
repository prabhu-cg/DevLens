import { CircleOff, Database, HardDrive, WifiOff } from 'lucide-react';
import styles from './PrivacySection.module.css';

const points = [
  {
    icon: CircleOff,
    title: 'No account',
    description: 'Start using DevLens without creating an account.',
  },
  {
    icon: Database,
    title: 'No database',
    description:
      'Projects are intended to be stored locally in your browser, not in a central database.',
  },
  {
    icon: HardDrive,
    title: 'Local-first',
    description: 'Documentation is designed to remain on your device.',
  },
  {
    icon: WifiOff,
    title: 'Offline-friendly',
    description:
      'Once local persistence ships, documentation work will continue without a network connection.',
  },
];

export function PrivacySection() {
  return (
    <section className={styles.section} id="privacy">
      <div className={styles.inner}>
        <h2 className={styles.title}>Your design stays yours.</h2>
        <div className={styles.grid}>
          {points.map(({ icon: Icon, title, description }) => (
            <div key={title} className={styles.item}>
              <span className={styles.icon} aria-hidden="true">
                <Icon size={18} />
              </span>
              <span className={styles.itemTitle}>{title}</span>
              <p className={styles.itemDescription}>{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
