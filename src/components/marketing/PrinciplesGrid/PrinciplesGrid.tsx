import { Database, Globe, ShieldCheck, Wallet, Wifi, Users } from 'lucide-react';
import styles from './PrinciplesGrid.module.css';

const principles = [
  {
    icon: Globe,
    title: 'Browser-based',
    description: 'No install. Open a tab and start working with your design file.',
  },
  {
    icon: Database,
    title: 'Local-first',
    description: 'Your project lives on your machine, not on someone else’s server.',
  },
  {
    icon: ShieldCheck,
    title: 'Privacy-first',
    description: 'Nothing about your file or your work is sent anywhere by default.',
  },
  {
    icon: Wallet,
    title: 'Free to use',
    description: 'No subscription, no seat limits, no paywall on core functionality.',
  },
  {
    icon: Wifi,
    title: 'Offline-capable',
    description: 'Once a project is imported, keep working without a connection.',
  },
  {
    icon: Users,
    title: 'Yours alone',
    description: 'No accounts, no team plans — this is a tool for one designer at a time.',
  },
];

export function PrinciplesGrid() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <span className={styles.eyebrow}>Built differently</span>
          <h2 className={styles.title}>A handoff tool that stays out of your infrastructure.</h2>
        </div>
        <div className={styles.grid}>
          {principles.map(({ icon: Icon, title, description }) => (
            <div key={title} className={styles.item}>
              <span className={styles.icon} aria-hidden="true">
                <Icon size={20} />
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
