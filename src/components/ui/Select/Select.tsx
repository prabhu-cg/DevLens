import { useId } from 'react';
import * as RadixSelect from '@radix-ui/react-select';
import { Check, ChevronDown } from 'lucide-react';
import type { SelectOption } from '../../../types/common';
import styles from './Select.module.css';

export interface SelectProps {
  label: string;
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  hideLabel?: boolean;
  disabled?: boolean;
  onValueChange?: (value: string) => void;
}

export function Select({
  label,
  options,
  value,
  defaultValue,
  placeholder = 'Select an option',
  hideLabel = false,
  disabled,
  onValueChange,
}: SelectProps) {
  const triggerId = useId();

  return (
    <div className={styles.field}>
      <label htmlFor={triggerId} className={hideLabel ? 'sr-only' : styles.label}>
        {label}
      </label>
      <RadixSelect.Root
        value={value}
        defaultValue={defaultValue}
        disabled={disabled}
        onValueChange={onValueChange}
      >
        <RadixSelect.Trigger id={triggerId} className={styles.trigger}>
          <RadixSelect.Value placeholder={placeholder} />
          <RadixSelect.Icon className={styles.icon}>
            <ChevronDown size={16} aria-hidden="true" />
          </RadixSelect.Icon>
        </RadixSelect.Trigger>
        <RadixSelect.Portal>
          <RadixSelect.Content className={styles.content} position="popper" sideOffset={4}>
            <RadixSelect.Viewport className={styles.viewport}>
              {options.map((option) => (
                <RadixSelect.Item key={option.value} value={option.value} className={styles.item}>
                  <RadixSelect.ItemText>{option.label}</RadixSelect.ItemText>
                  <RadixSelect.ItemIndicator>
                    <Check size={16} aria-hidden="true" />
                  </RadixSelect.ItemIndicator>
                </RadixSelect.Item>
              ))}
            </RadixSelect.Viewport>
          </RadixSelect.Content>
        </RadixSelect.Portal>
      </RadixSelect.Root>
    </div>
  );
}
