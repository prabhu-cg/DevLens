import { cn } from '../../../utils/cn';
import styles from './ProgressBar.module.css';

export interface ProgressBarProps {
  label: string;
  value: number;
  tone?: 'brand' | 'success' | 'warning';
  hideValue?: boolean;
}

export function ProgressBar({ label, value, tone = 'brand', hideValue = false }: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value));

  return (
    <div className={styles.wrapper}>
      <div className={styles.labelRow}>
        <span className={styles.label}>{label}</span>
        {!hideValue && <span className={styles.value}>{clamped}%</span>}
      </div>
      <div
        className={styles.track}
        role="progressbar"
        aria-label={label}
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={cn(
            styles.fill,
            tone === 'success' && styles.fillSuccess,
            tone === 'warning' && styles.fillWarning,
          )}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
