import type { DocStatus } from '../../domain/documentation';
import { cn } from '../../utils/cn';
import styles from './DocStatusBadge.module.css';

const labels: Record<DocStatus, string> = {
  not_started: 'Not started',
  in_progress: 'In progress',
  documented: 'Documented',
};

const statusClass: Record<DocStatus, string> = {
  not_started: styles.notStarted!,
  in_progress: styles.inProgress!,
  documented: styles.documented!,
};

export interface DocStatusBadgeProps {
  status: DocStatus;
  hideLabel?: boolean;
}

export function DocStatusBadge({ status, hideLabel = false }: DocStatusBadgeProps) {
  return (
    <span className={cn(styles.badge, statusClass[status])}>
      <span className={styles.dot} aria-hidden="true" />
      {hideLabel ? <span className="sr-only">{labels[status]}</span> : labels[status]}
    </span>
  );
}
