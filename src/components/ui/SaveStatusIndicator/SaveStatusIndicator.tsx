import { cn } from '../../../utils/cn';
import styles from './SaveStatusIndicator.module.css';

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'unsaved';

export interface SaveStatusIndicatorProps {
  status: SaveStatus;
}

export function SaveStatusIndicator({ status }: SaveStatusIndicatorProps) {
  if (status === 'idle') return null;

  const label =
    status === 'saving' ? 'Saving…' : status === 'saved' ? 'Saved locally' : 'Unsaved changes';

  return (
    <span className={styles.saveStatus} role="status">
      <span
        className={cn(
          styles.dot,
          status === 'saved' && styles.dotSaved,
          status === 'unsaved' && styles.dotUnsaved,
        )}
        aria-hidden="true"
      />
      {label}
    </span>
  );
}
