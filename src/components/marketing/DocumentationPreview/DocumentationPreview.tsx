import { Badge } from '../../ui';
import { cn } from '../../../utils/cn';
import styles from './DocumentationPreview.module.css';

const navItems = [
  'Overview',
  'Pages',
  'Components',
  'Tokens',
  'Interactions',
  'Responsive',
  'Accessibility',
  'Questions',
];

const variants = ['Primary', 'Secondary', 'Destructive'];
const states = ['Default', 'Hover', 'Focus', 'Disabled', 'Loading'];
const tokens = ['action.primary', 'text.on-primary', 'radius.medium'];

export function DocumentationPreview() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <h2 className={styles.title}>One design. One source of implementation clarity.</h2>
        </div>

        <div className={styles.frame}>
          <nav className={styles.nav} aria-label="Documentation sections">
            {navItems.map((item) => (
              <span
                key={item}
                className={cn(styles.navItem, item === 'Components' && styles.navItemActive)}
              >
                {item}
              </span>
            ))}
          </nav>

          <div className={styles.content}>
            <h3 className={styles.componentTitle}>Button</h3>

            <div className={styles.docSection}>
              <span className={styles.docLabel}>Purpose</span>
              <p className={styles.docBody}>
                Primary action for submitting or confirming an action.
              </p>
            </div>

            <div className={styles.docSection}>
              <span className={styles.docLabel}>Variants</span>
              <div className={styles.pillRow}>
                {variants.map((variant) => (
                  <Badge key={variant} variant="neutral">
                    {variant}
                  </Badge>
                ))}
              </div>
            </div>

            <div className={styles.docSection}>
              <span className={styles.docLabel}>States</span>
              <div className={styles.pillRow}>
                {states.map((state) => (
                  <Badge key={state} variant="neutral">
                    {state}
                  </Badge>
                ))}
              </div>
            </div>

            <div className={styles.docSection}>
              <span className={styles.docLabel}>Behaviour</span>
              <p className={styles.docBody}>Loading state prevents duplicate submission.</p>
            </div>

            <div className={styles.docSection}>
              <span className={styles.docLabel}>Accessibility</span>
              <p className={styles.docBody}>Keyboard accessible. Visible focus required.</p>
            </div>

            <div className={styles.docSection}>
              <span className={styles.docLabel}>Tokens</span>
              <div className={styles.tokenRow}>
                {tokens.map((token) => (
                  <code key={token} className={styles.token}>
                    {token}
                  </code>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
