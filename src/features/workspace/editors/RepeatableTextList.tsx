import { Plus, X } from 'lucide-react';
import { Button, IconButton, Input } from '../../../components/ui';
import styles from './RepeatableTextList.module.css';

export interface RepeatableTextListProps {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
  addLabel?: string;
  emptyLabel?: string;
}

export function RepeatableTextList({
  label,
  items,
  onChange,
  placeholder,
  addLabel = 'Add',
  emptyLabel = 'Nothing added yet.',
}: RepeatableTextListProps) {
  const update = (index: number, value: string) => {
    const next = [...items];
    next[index] = value;
    onChange(next);
  };

  const remove = (index: number) => {
    onChange(items.filter((_, itemIndex) => itemIndex !== index));
  };

  return (
    <div className={styles.field}>
      <span className={styles.label}>{label}</span>
      {items.length === 0 ? (
        <p className={styles.empty}>{emptyLabel}</p>
      ) : (
        <div className={styles.list}>
          {items.map((item, index) => (
            <div key={`${label}-${index}`} className={styles.row}>
              <Input
                label={`${label} ${index + 1}`}
                hideLabel
                className={styles.input}
                placeholder={placeholder}
                value={item}
                onChange={(event) => update(index, event.target.value)}
              />
              <IconButton
                icon={<X size={14} aria-hidden="true" />}
                label={`Remove ${label.toLowerCase()} ${index + 1}`}
                size="sm"
                onClick={() => remove(index)}
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
          onClick={() => onChange([...items, ''])}
        >
          <Plus size={14} aria-hidden="true" />
          {addLabel}
        </Button>
      </div>
    </div>
  );
}
