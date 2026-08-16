import * as RadixSeparator from '@radix-ui/react-separator';
import { cn } from '../../../utils/cn';
import styles from './Divider.module.css';

export interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  decorative?: boolean;
  className?: string;
}

export function Divider({
  orientation = 'horizontal',
  decorative = true,
  className,
}: DividerProps) {
  return (
    <RadixSeparator.Root
      orientation={orientation}
      decorative={decorative}
      className={cn(styles.divider, styles[orientation], className)}
    />
  );
}
