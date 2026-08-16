import type { HTMLAttributes } from 'react';
import { cn } from '../../../utils/cn';
import styles from './Card.module.css';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
}

export function Card({ interactive = false, className, children, ...rest }: CardProps) {
  return (
    <div className={cn(styles.card, interactive && styles.interactive, className)} {...rest}>
      {children}
    </div>
  );
}
