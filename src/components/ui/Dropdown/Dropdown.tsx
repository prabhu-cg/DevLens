import type { ReactNode } from 'react';
import * as RadixDropdown from '@radix-ui/react-dropdown-menu';
import { cn } from '../../../utils/cn';
import styles from './Dropdown.module.css';

export interface DropdownItem {
  value: string;
  label: string;
  icon?: ReactNode;
  disabled?: boolean;
  destructive?: boolean;
  onSelect?: () => void;
}

export interface DropdownProps {
  trigger: ReactNode;
  items: DropdownItem[];
  align?: 'start' | 'center' | 'end';
}

export function Dropdown({ trigger, items, align = 'end' }: DropdownProps) {
  return (
    <RadixDropdown.Root>
      <RadixDropdown.Trigger asChild>{trigger}</RadixDropdown.Trigger>
      <RadixDropdown.Portal>
        <RadixDropdown.Content className={styles.content} align={align} sideOffset={4}>
          {items.map((item) => (
            <RadixDropdown.Item
              key={item.value}
              disabled={item.disabled}
              onSelect={item.onSelect}
              className={cn(styles.item, item.destructive && styles.destructive)}
            >
              {item.icon}
              {item.label}
            </RadixDropdown.Item>
          ))}
        </RadixDropdown.Content>
      </RadixDropdown.Portal>
    </RadixDropdown.Root>
  );
}
