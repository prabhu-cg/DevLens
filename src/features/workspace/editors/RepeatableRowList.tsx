import type { ReactNode } from 'react';
import { Plus, X } from 'lucide-react';
import { Button, IconButton } from '../../../components/ui';
import styles from './RepeatableRowList.module.css';

export interface RepeatableRowListProps<T extends { id: string }> {
  label: string;
  items: T[];
  onChange: (items: T[]) => void;
  createItem: () => T;
  renderRow: (item: T, update: (patch: Partial<T>) => void, index: number) => ReactNode;
  addLabel?: string;
  emptyLabel?: string;
}

export function RepeatableRowList<T extends { id: string }>({
  label,
  items,
  onChange,
  createItem,
  renderRow,
  addLabel = 'Add',
  emptyLabel = 'Nothing added yet.',
}: RepeatableRowListProps<T>) {
  const updateItem = (id: string, patch: Partial<T>) => {
    onChange(items.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  };

  const removeItem = (id: string) => {
    onChange(items.filter((item) => item.id !== id));
  };

  return (
    <div className={styles.field}>
      <span className={styles.label}>{label}</span>
      {items.length === 0 ? (
        <p className={styles.empty}>{emptyLabel}</p>
      ) : (
        <div className={styles.list}>
          {items.map((item, index) => (
            <div key={item.id} className={styles.row}>
              <div className={styles.rowFields}>
                {renderRow(item, (patch) => updateItem(item.id, patch), index)}
              </div>
              <IconButton
                icon={<X size={14} aria-hidden="true" />}
                label={`Remove ${label.toLowerCase()} ${index + 1}`}
                size="sm"
                onClick={() => removeItem(item.id)}
              />
            </div>
          ))}
        </div>
      )}
      <div>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => onChange([...items, createItem()])}
        >
          <Plus size={14} aria-hidden="true" />
          {addLabel}
        </Button>
      </div>
    </div>
  );
}
