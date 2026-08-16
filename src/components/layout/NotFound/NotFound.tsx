import { FileQuestion } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { Button, EmptyState } from '../../ui';
import styles from './NotFound.module.css';

export function NotFound() {
  return (
    <div className={styles.wrapper}>
      <EmptyState
        icon={<FileQuestion size={40} aria-hidden="true" />}
        title="Page not found"
        description="The page you're looking for doesn't exist or has moved."
        action={
          <Button asChild>
            <NavLink to="/">Back to home</NavLink>
          </Button>
        }
      />
    </div>
  );
}
